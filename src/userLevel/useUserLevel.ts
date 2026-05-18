import { useCallback, useEffect, useState } from 'react';

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

// Shared hook: returns the current level and a setter that persists to localStorage
// and broadcasts the change to other hook instances in the same tab.
//
// SSR-safe: initial state is the default level so server-rendered HTML matches
// the first client render. After mount, the real value from localStorage is
// applied. Brief flash on first paint is the standard trade-off for SSR + localStorage.
export function useUserLevel(): readonly [Level, (next: Level) => void] {
  const [level, setLevelState] = useState<Level>(DEFAULT_LEVEL);

  useEffect(() => {
    const stored = readStoredLevel();
    if (stored !== DEFAULT_LEVEL) setLevelState(stored);

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Level>).detail;
      if (isLevel(next)) setLevelState(next);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isLevel(e.newValue)) setLevelState(e.newValue);
    };
    window.addEventListener(EVENT_NAME, onChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setLevel = useCallback((next: Level) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore quota / disabled storage
    }
    window.dispatchEvent(new CustomEvent<Level>(EVENT_NAME, { detail: next }));
    setLevelState(next);
  }, []);

  return [level, setLevel] as const;
}
