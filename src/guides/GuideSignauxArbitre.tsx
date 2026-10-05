import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';

type Signal = { name: string; gesture: string; context: string };

// Compact SVG pictograms for each signal. The keys match the order of
// signals in the i18n array. Each icon is a stylized stick-figure cue —
// not a literal anatomy, but a memorable visual hook tied to the gesture
// description below.
const ICONS: Record<number, React.ReactNode> = {
  // 0. Point / Side-out — horizontal arm pointing right
  0: <Pictogram><line x1={20} y1={28} x2={48} y2={28} strokeWidth={3} /><polygon points="48,24 56,28 48,32" /></Pictogram>,
  // 1. Ball in — arm pointing down to floor
  1: <Pictogram><line x1={28} y1={14} x2={28} y2={42} strokeWidth={3} /><polygon points="24,42 28,50 32,42" /></Pictogram>,
  // 2. Ball out — both arms vertical
  2: <Pictogram>
        <line x1={18} y1={32} x2={18} y2={12} strokeWidth={3} />
        <line x1={38} y1={32} x2={38} y2={12} strokeWidth={3} />
        <line x1={14} y1={32} x2={42} y2={32} strokeWidth={3} />
      </Pictogram>,
  // 3. Net touch — finger on net line
  3: <Pictogram>
        <line x1={8} y1={20} x2={48} y2={20} strokeWidth={2} strokeDasharray="3 3" />
        <circle cx={32} cy={20} r={3} />
        <line x1={32} y1={20} x2={32} y2={40} strokeWidth={3} />
      </Pictogram>,
  // 4. Four hits — four fingers
  4: <Pictogram>
        {[18, 24, 30, 36].map(x => <line key={x} x1={x} y1={36} x2={x} y2={14} strokeWidth={3} />)}
      </Pictogram>,
  // 5. Double contact — two fingers
  5: <Pictogram>
        <line x1={24} y1={36} x2={24} y2={14} strokeWidth={3} />
        <line x1={32} y1={36} x2={32} y2={14} strokeWidth={3} />
      </Pictogram>,
  // 6. Ball held — palm up lift
  6: <Pictogram>
        <line x1={14} y1={32} x2={34} y2={32} strokeWidth={3} />
        <line x1={14} y1={32} x2={14} y2={24} strokeWidth={3} />
        <line x1={34} y1={32} x2={34} y2={24} strokeWidth={3} />
        <line x1={42} y1={32} x2={50} y2={20} strokeWidth={2} strokeDasharray="2 2" />
      </Pictogram>,
  // 7. Foot fault on serve — pointing down to line
  7: <Pictogram>
        <line x1={8} y1={42} x2={56} y2={42} strokeWidth={3} />
        <line x1={32} y1={20} x2={32} y2={42} strokeWidth={3} />
        <polygon points="28,40 32,46 36,40" />
      </Pictogram>,
  // 8. Rotation fault — circular arrow
  8: <Pictogram>
        <circle cx={32} cy={26} r={12} strokeWidth={3} fill="none" />
        <polygon points="42,22 46,28 38,28" />
      </Pictogram>,
  // 9. Overlap — two arms wide
  9: <Pictogram>
        <line x1={10} y1={28} x2={26} y2={28} strokeWidth={3} />
        <line x1={38} y1={28} x2={54} y2={28} strokeWidth={3} />
        <circle cx={28} cy={28} r={2} />
        <circle cx={36} cy={28} r={2} />
      </Pictogram>,
  // 10. Back-row attack — downward sweep
  10: <Pictogram>
        <line x1={14} y1={14} x2={42} y2={40} strokeWidth={3} />
        <polygon points="38,42 46,42 42,48" />
      </Pictogram>,
  // 11. Touched at block — hand over fingers
  11: <Pictogram>
        <line x1={20} y1={28} x2={20} y2={14} strokeWidth={3} />
        <line x1={28} y1={28} x2={28} y2={14} strokeWidth={3} />
        <line x1={14} y1={32} x2={36} y2={32} strokeWidth={3} />
      </Pictogram>,
  // 12. Timeout — T shape
  12: <Pictogram>
        <line x1={14} y1={20} x2={42} y2={20} strokeWidth={3} />
        <line x1={28} y1={20} x2={28} y2={44} strokeWidth={3} />
      </Pictogram>,
  // 13. Substitution — circular arms
  13: <Pictogram>
        <circle cx={22} cy={28} r={8} strokeWidth={2.5} fill="none" />
        <circle cx={38} cy={28} r={8} strokeWidth={2.5} fill="none" />
        <polygon points="14,26 18,22 20,30" />
        <polygon points="46,30 42,34 40,26" />
      </Pictogram>,
  // 14. Video challenge — rectangle (screen)
  14: <Pictogram>
        <rect x={12} y={14} width={32} height={20} strokeWidth={3} fill="none" />
      </Pictogram>,
};

function Pictogram({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 56"
      style={{
        width: 56,
        height: 48,
        stroke: 'var(--ink)',
        fill: 'var(--ink)',
        strokeLinecap: 'round',
      }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function GuideSignauxArbitre() {
  const { t } = useTranslation('guideContent');
  const signals = t('signauxArbitre.signals', { returnObjects: true }) as Signal[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <GoldenRule>{t('signauxArbitre.intro.body')}</GoldenRule>

      <section>
        <h2 style={S.section}>{t('signauxArbitre.intro.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {signals.map((sig, idx) => (
            <div key={idx} style={{ ...S.card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div
                style={{
                  flexShrink: 0,
                  width: 64,
                  height: 56,
                  background: 'var(--cream)',
                  border: '2px solid var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ICONS[idx] ?? <span style={{ fontSize: 18, opacity: 0.4 }}>?</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      color: 'var(--orange)',
                    }}
                  >
                    N° {String(idx + 1).padStart(2, '0')}
                  </span>
                  <strong style={{ fontSize: 13 }}>{sig.name}</strong>
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: 12, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--teal)' }}>Geste : </strong>
                  {sig.gesture}
                </p>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, opacity: 0.8 }}>
                  <strong>Contexte : </strong>
                  {sig.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
