import { useState } from 'react';

// Semantic ball-height presets — the values map to actual Y in metres.
// The "Filet" preset sits at 2.5m (just above the 2.43m women's net height,
// rounded to read cleanly). "Cloche" is the typical apex for a high pass.
const PRESETS = [
  { key: 'sol',    label: 'Sol',    sub: '0 m',   y: 0,   color: '#5fb37e' }, // green
  { key: 'hanche', label: 'Hanche', sub: '1 m',   y: 1.0, color: '#f0c84c' }, // yellow
  { key: 'filet',  label: 'Filet',  sub: '2.5 m', y: 2.5, color: '#e67e22' }, // orange
  { key: 'cloche', label: 'Cloche', sub: '4 m',   y: 4.0, color: '#3498db' }, // blue
] as const;

const SNAP_TOLERANCE = 0.05;

const monoLabel: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
  marginBottom: 6,
  display: 'block',
};

export function BallHeightPicker({ value, onChange }: { value: number; onChange: (y: number) => void }) {
  const [showFine, setShowFine] = useState(false);

  // Detect if the current value matches a preset (within tolerance) — that
  // preset's button is highlighted; otherwise none of them are.
  const activePreset = PRESETS.find(p => Math.abs(p.y - value) < SNAP_TOLERANCE);
  const semanticHint = activePreset ? `« ${activePreset.label.toLowerCase()} »` : 'personnalisé';

  return (
    <div>
      <span style={monoLabel}>
        Position d'arrivée — {value.toFixed(2)} m · <span style={{ opacity: 0.55 }}>{semanticHint}</span>
      </span>
      <p style={{ margin: '0 0 8px 0', fontSize: 11, color: 'var(--ink)', opacity: 0.55, fontFamily: '"DM Mono", monospace', lineHeight: 1.4 }}>
        Hauteur où le ballon se trouve <strong>à la fin de cette carte</strong>.
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {PRESETS.map(p => {
          const isActive = activePreset?.key === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.y)}
              style={{
                flex: '1 1 80px',
                minWidth: 80,
                padding: '8px 10px',
                border: `2.5px solid ${isActive ? p.color : 'var(--ink)'}`,
                background: isActive ? p.color : 'var(--cream)',
                color: isActive ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                fontFamily: '"Bungee", sans-serif',
                fontSize: 11,
                letterSpacing: '0.06em',
                boxShadow: isActive ? '2px 2px 0 var(--ink)' : 'none',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.color, border: '1.5px solid var(--ink)' }} />
              <span>{p.label}</span>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, opacity: isActive ? 0.85 : 0.55, letterSpacing: 0 }}>
                {p.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fine-grain slider — collapsed by default to keep the picker tidy */}
      <button
        onClick={() => setShowFine(s => !s)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: 'var(--ink)',
          fontFamily: '"DM Mono", monospace',
          fontSize: 11,
          opacity: 0.65,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        type="button"
      >
        {showFine ? '▾ Masquer le réglage fin' : '▸ Réglage fin…'}
      </button>
      {showFine && (
        <div style={{ marginTop: 8 }}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={value}
            onChange={e => onChange(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
