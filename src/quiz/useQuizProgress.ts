import { useCallback, useSyncExternalStore } from 'react';
import type { QuizProgress, QuizScore } from './types';

const STORAGE_KEY = 'volley-wiki:quiz-progress';
const EVENT_NAME = 'volley-wiki:quiz-progress-change';

function isProgress(value: unknown): value is QuizProgress {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Exported so consumers (e.g. QuizPlayer) can synchronously snapshot the
// stored progress at mount time without waiting for the hook's hydration.
export function readStoredProgress(): QuizProgress {
  return readStored();
}

function readStored(): QuizProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isProgress(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

// Module-level store shared by every hook instance. `cached` mirrors the
// stored progress; it is filled from localStorage on first read and dropped
// when the last subscriber leaves, so a later mount re-reads localStorage.
const EMPTY_PROGRESS: QuizProgress = {};
let cached: QuizProgress | null = null;
let subscriberCount = 0;

function getSnapshot(): QuizProgress {
  if (cached === null) cached = readStored();
  return cached;
}

// Server render (SSG) and hydration always see an empty progress.
function getServerSnapshot(): QuizProgress {
  return EMPTY_PROGRESS;
}

// Same-tab sync goes through a CustomEvent bus, cross-tab sync through the
// storage event.
function subscribe(onStoreChange: () => void): () => void {
  const onChange = (e: Event) => {
    const next = (e as CustomEvent<QuizProgress>).detail;
    if (!isProgress(next)) return;
    cached = next;
    onStoreChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const next = e.newValue ? JSON.parse(e.newValue) : {};
      if (!isProgress(next)) return;
      cached = next;
      onStoreChange();
    } catch {
      // ignore parse error
    }
  };
  subscriberCount += 1;
  window.addEventListener(EVENT_NAME, onChange as EventListener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange as EventListener);
    window.removeEventListener('storage', onStorage);
    subscriberCount -= 1;
    if (subscriberCount === 0) cached = null;
  };
}

function writeStored(value: QuizProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore quota / disabled storage
  }
  window.dispatchEvent(new CustomEvent<QuizProgress>(EVENT_NAME, { detail: value }));
}

// Hook mirrors the useUserLevel pattern: localStorage + CustomEvent bus for
// same-tab sync + storage event for cross-tab sync. SSR-safe initial state.
export function useQuizProgress(): readonly [
  QuizProgress,
  (slug: string, score: number, total: number) => void,
] {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const recordScore = useCallback(
    (slug: string, score: number, total: number) => {
      const current = readStored();
      const previous = current[slug];
      const next: QuizScore = {
        bestScore: previous ? Math.max(previous.bestScore, score) : score,
        lastScore: score,
        total,
        lastPlayedAt: new Date().toISOString(),
        attempts: (previous?.attempts ?? 0) + 1,
      };
      const updated = { ...current, [slug]: next };
      cached = updated;
      writeStored(updated);
    },
    [],
  );

  return [progress, recordScore] as const;
}
