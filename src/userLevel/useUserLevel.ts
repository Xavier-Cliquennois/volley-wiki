import { useCallback, useSyncExternalStore } from 'react';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export const LEVELS: readonly Level[] = ['beginner', 'intermediate', 'advanced'];
export const DEFAULT_LEVEL: Level = 'intermediate';

const STORAGE_KEY = 'volley-wiki:userLevel';
const EVENT_NAME = 'volley-wiki:userLevel-change';

const LEVEL_RANK: Record<Level, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export function compareLevels(a: Level, b: Level): number {
  return LEVEL_RANK[a] - LEVEL_RANK[b];
}

// True when the user's current level is high enough to see content tagged as `required`.
export function meetsLevel(current: Level, required: Level): boolean {
  return LEVEL_RANK[current] >= LEVEL_RANK[required];
}

function isLevel(value: unknown): value is Level {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}

function readStoredLevel(): Level {
  if (typeof window === 'undefined') return DEFAULT_LEVEL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isLevel(raw) ? raw : DEFAULT_LEVEL;
  } catch {
    return DEFAULT_LEVEL;
  }
}

// Module-level store shared by every hook instance. `cachedLevel` mirrors the
// stored level; it is read from localStorage on first access and dropped when
// the last subscriber leaves, so a later mount re-reads localStorage. It also
// keeps the chosen level in memory when localStorage is unavailable.
let cachedLevel: Level | null = null;
let subscriberCount = 0;

function getSnapshot(): Level {
  if (cachedLevel === null) cachedLevel = readStoredLevel();
  return cachedLevel;
}

// SSR-safe: the server render (SSG) and hydration use the default level so the
// HTML matches the first client render; the stored level is applied right
// after. Brief flash on first paint is the standard trade-off for SSR +
// localStorage.
function getServerSnapshot(): Level {
  return DEFAULT_LEVEL;
}

// Same-tab sync goes through a CustomEvent bus, cross-tab sync through the
// storage event.
function subscribe(onStoreChange: () => void): () => void {
  const onChange = (e: Event) => {
    const next = (e as CustomEvent<Level>).detail;
    if (!isLevel(next)) return;
    cachedLevel = next;
    onStoreChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || !isLevel(e.newValue)) return;
    cachedLevel = e.newValue;
    onStoreChange();
  };
  subscriberCount += 1;
  window.addEventListener(EVENT_NAME, onChange as EventListener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange as EventListener);
    window.removeEventListener('storage', onStorage);
    subscriberCount -= 1;
    if (subscriberCount === 0) cachedLevel = null;
  };
}

// Shared hook: returns the current level and a setter that persists to localStorage
// and broadcasts the change to other hook instances in the same tab.
export function useUserLevel(): readonly [Level, (next: Level) => void] {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLevel = useCallback((next: Level) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore quota / disabled storage
    }
    cachedLevel = next;
    window.dispatchEvent(new CustomEvent<Level>(EVENT_NAME, { detail: next }));
  }, []);

  return [level, setLevel] as const;
}
