// "Raconte" mode — full-screen slideshow that walks through each card with
// its title and description in large type. Used to validate the narrative
// reading of a scenario without the editor chrome around it.
//
// Keyboard: Esc to close, ← / → to navigate.

import { useCallback, useEffect, useState } from 'react';
import type { EditorStep } from './types';
import { TEMPO_META } from './types';
import { BRICK_BY_KIND, BRICK_CATEGORY_COLORS } from './bricks';

export type StoryModeProps = {
  steps: EditorStep[];
  startAt?: number;
  onClose: () => void;
};

export function StoryMode({ steps, startAt = 0, onClose }: StoryModeProps) {
  const [idx, setIdx] = useState(Math.min(Math.max(startAt, 0), steps.length - 1));

  const next = useCallback(() => setIdx(i => Math.min(steps.length - 1, i + 1)), [steps.length]);
  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  if (steps.length === 0) return null;
  const step = steps[idx];
  const tempo = TEMPO_META[step.tempo];
  const bricks = step.actions ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mode Raconte"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,24,18,0.92)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 880,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'var(--paper)',
          border: '4px solid var(--ink)',
          boxShadow: 'var(--shadow)',
          padding: 'clamp(24px, 4vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header — close + position indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.16em', opacity: 0.55, textTransform: 'uppercase' }}>
            Carte {idx + 1} / {steps.length} · {tempo.label}
          </span>
          <button
            onClick={onClose}
            style={{
              border: '2.5px solid var(--ink)',
              background: 'var(--cream)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              padding: '5px 12px',
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
            aria-label="Fermer le mode Raconte"
          >
            ✕ Esc
          </button>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 'clamp(28px, 5vw, 48px)',
          letterSpacing: '0.02em',
          margin: 0,
          color: 'var(--ink)',
          lineHeight: 1.1,
        }}>
          {step.title.replace(/^\d+\.\s*/, '')}
        </h2>

        {/* Bricks band — coloured chips, one per action */}
        {bricks.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bricks.map(b => {
              const meta = BRICK_BY_KIND[b.kind];
              const color = BRICK_CATEGORY_COLORS[meta.category];
              return (
                <span
                  key={b.id}
                  style={{
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    padding: '4px 10px',
                    background: color,
                    color: '#fff',
                    border: '1.5px solid var(--ink)',
                  }}
                  title={meta.description}
                >
                  {b.playerId} · {meta.label.toUpperCase()}
                </span>
              );
            })}
          </div>
        )}

        {/* Description */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          lineHeight: 1.6,
          margin: 0,
          color: 'var(--ink)',
          whiteSpace: 'pre-wrap',
        }}>
          {step.description || <span style={{ opacity: 0.4 }}>— pas de description —</span>}
        </p>

        {/* Footer — prev / progress / next */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '2px solid var(--ink)' }}>
          <button
            onClick={prev}
            disabled={idx === 0}
            style={{
              border: '2.5px solid var(--ink)',
              background: idx === 0 ? 'transparent' : 'var(--cream)',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 11,
              letterSpacing: '0.06em',
              padding: '8px 16px',
              cursor: idx === 0 ? 'not-allowed' : 'pointer',
              opacity: idx === 0 ? 0.35 : 1,
              color: 'var(--ink)',
            }}
          >
            ◀ Précédent
          </button>

          {/* Tiny segmented progress bar — one segment per card */}
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 6,
                  background: i <= idx ? 'var(--orange)' : 'rgba(26,24,18,0.18)',
                  border: '1px solid var(--ink)',
                  cursor: 'pointer',
                }}
                onClick={() => setIdx(i)}
                aria-label={`Aller à la carte ${i + 1}`}
                role="button"
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={idx === steps.length - 1}
            style={{
              border: '2.5px solid var(--ink)',
              background: idx === steps.length - 1 ? 'transparent' : 'var(--orange)',
              color: idx === steps.length - 1 ? 'var(--ink)' : '#fff',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 11,
              letterSpacing: '0.06em',
              padding: '8px 16px',
              cursor: idx === steps.length - 1 ? 'not-allowed' : 'pointer',
              opacity: idx === steps.length - 1 ? 0.35 : 1,
              boxShadow: idx === steps.length - 1 ? 'none' : '2px 2px 0 var(--ink)',
            }}
          >
            Suivant ▶
          </button>
        </div>
      </div>
    </div>
  );
}
