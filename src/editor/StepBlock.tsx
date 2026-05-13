import type { ReactNode } from 'react';

// Visual wrapper that materialises one of the four numbered "steps" of card
// authoring (1. décris / 2. place / 3. ballon / 4. tempo). The thick coloured
// ribbon on the left and the big number make the progression read at a glance.

const RIBBON: React.CSSProperties = {
  width: 28,
  flexShrink: 0,
  background: 'var(--orange)',
  color: '#fff',
  fontFamily: '"Bungee", sans-serif',
  fontSize: 16,
  letterSpacing: '0.04em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '2.5px solid var(--ink)',
};

export function StepBlock({
  number,
  title,
  children,
  tight = false,
}: {
  number: number;
  title: string;
  children: ReactNode;
  // `tight` removes the inner padding — used when the body is itself a large
  // canvas/picker that should fill the block edge-to-edge.
  tight?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      border: '2.5px solid var(--ink)',
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={RIBBON}>{number}</div>
      <div style={{ flex: 1, padding: tight ? 10 : '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 11,
          letterSpacing: '0.1em',
          color: 'var(--orange)',
          textTransform: 'uppercase',
        }}>
          Étape {number} — {title}
        </div>
        {children}
      </div>
    </div>
  );
}
