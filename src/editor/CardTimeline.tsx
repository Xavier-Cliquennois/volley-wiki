// Visual timeline of cards: a horizontal strip of bigger, glance-able cards
// (versus the previous text-only buttons). Each tile shows the card number,
// short title, tempo, and a small dot per brick posed on the card.

import { BRICK_BY_KIND, BRICK_CATEGORY_COLORS } from './bricks';
import { TEMPO_META } from './types';
import type { EditorStep } from './types';
import { useEffect, useRef } from 'react';

export type CardTimelineProps = {
  steps: EditorStep[];
  activeIdx: number;
  onJump: (idx: number) => void;
};

export function CardTimeline({ steps, activeIdx, onJump }: CardTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the active tile in view when navigation changes the active card.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[activeIdx] as HTMLElement | undefined;
    if (!child) return;
    const target = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, [activeIdx]);

  return (
    <div style={{
      border: '2.5px solid var(--ink)',
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ borderBottom: '2px solid var(--ink)', padding: '6px 12px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.1em' }}>
          TIMELINE — {steps.length} CARTE{steps.length > 1 ? 'S' : ''}
        </span>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.55 }}>
          clique pour sauter
        </span>
      </div>
      <div
        ref={ref}
        style={{ display: 'flex', gap: 8, padding: 10, overflowX: 'auto' }}
      >
        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const tempo = TEMPO_META[step.tempo];
          const brickColors = (step.actions ?? []).map(b =>
            BRICK_CATEGORY_COLORS[BRICK_BY_KIND[b.kind].category],
          );
          return (
            <button
              key={step.id}
              onClick={() => onJump(idx)}
              style={{
                flexShrink: 0,
                width: 150,
                border: `2.5px solid ${isActive ? 'var(--orange)' : 'var(--ink)'}`,
                background: isActive ? 'rgba(226,84,46,0.08)' : isPast ? 'var(--paper)' : 'var(--cream)',
                opacity: isPast && !isActive ? 0.6 : 1,
                padding: '8px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                color: 'var(--ink)',
                font: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, color: isActive ? 'var(--orange)' : 'var(--ink)' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.1em', opacity: 0.55, textTransform: 'uppercase' }}>
                  {tempo.label}
                </span>
              </div>
              <div style={{
                fontFamily: '"Bungee", sans-serif',
                fontSize: 10,
                lineHeight: 1.3,
                letterSpacing: '0.02em',
                color: isActive ? 'var(--orange)' : 'var(--ink)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6em',
              }}>
                {step.title.replace(/^\d+\.\s*/, '') || '— sans titre —'}
              </div>
              {brickColors.length > 0 && (
                <div style={{ display: 'flex', gap: 3, marginTop: 'auto', paddingTop: 4 }}>
                  {brickColors.map((c, i) => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid var(--ink)' }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
