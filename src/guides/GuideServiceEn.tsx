import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Beginner': 'var(--mint)',
  'Intermediate': 'var(--yellow)',
  'Advanced': 'var(--orange)',
  'Competition': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Competition': '#fff',
};

type ServiceType = {
  id: string;
  name: string;
  level: string;
  tagline: string;
  description: string;
  biomechanics: string[];
  steps: string[];
  errors: [string, string][];
  exercises: string[];
  videos: { title: string; url: string }[];
};

const SERVICE_TYPES: ServiceType[] = [
  {
    id: 'cuillere',
    name: 'Underhand serve',
    level: 'Beginner',
    tagline: 'underhand — pendulum swing below the waist',
    description: "Pendulum arm motion striking the ball below the waist. Legal at all levels, recommended for beginners or in case of shoulder injury. Almost nonexistent above adult regional level.",
    biomechanics: [
      'Short kinetic chain: hips → shoulder → arm → hand',
      'Pendulum motion with no trunk rotation',
      'Weight transfer: back foot → front foot',
      'Contact: heel of the hand or closed fist below the center of the ball',
    ],
    steps: [
      'Left foot forward, weight on the back leg',
      "Left hand holds the ball at hip height in line with the striking arm",
      'Right arm cocked back, open palm or closed fist',
      'Release the ball just before contact — do not toss it',
      "Swing forward, strike below the center of the ball",
      'Arm follows through and points at the target, weight transferred to the front foot',
    ],
    errors: [
      ['Ball held too low or off-center', "Keep the ball at hip height, in line with the striking arm"],
      ['Striking with the fingers', 'Use the heel of the hand — a wider, more stable surface'],
      ['Tossing too high', 'Simply release the ball, do not toss it upward'],
      ['Loose wrist', 'Lock the arm at contact for a clean impact'],
    ],
    exercises: [
      'Bowling-hoops: aim at zones 4 m from the net',
      "10 serves at 4 m then step back 1 m per set until the baseline",
      'Targets 4x3 m on the floor — goal of 50% accuracy',
    ],
    videos: [
      { title: 'Underhand serve + tennis serve (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'How to serve underhand', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Standing float serve',
    level: 'Intermediate',
    tagline: 'standing float — default serve of 90% of amateurs',
    description: `Serve with no rotation producing an unpredictable trajectory ("knuckleball" effect). At a critical speed (~12-13 m/s), asymmetric vortices create random lateral lift forces. This is the serve to master first.`,
    biomechanics: [
      'Full kinetic chain: legs → hips → trunk → shoulder → elbow → hand',
      `"Bow and arrow" position: elbow high above the shoulder, hand behind the ear`,
      "Wrist LOCKED and firm — absolute requirement for the float effect",
      'Contact: heel of the hand at the center of the ball',
      `"Punch and freeze": SHORT follow-through — the hand stops immediately after contact`,
    ],
    steps: [
      "Body at 45° to the net, feet shoulder-width apart",
      "Left arm extended in front of the shoulder, ball at head height",
      `Very short toss: "place" the ball 30-50 cm above the shoulder — the ball does not spin`,
      'Left foot steps toward the target right after placing the ball',
      'Full arm extension at contact, hand firm and flat',
      'FREEZE: immediate stop of the motion after contact — no arm follow-through',
    ],
    errors: [
      ['Extended arm follow-through', "Failure cause #1: follow-through adds spin that kills the float — freeze immediately"],
      ['Toss too high', 'The ball drops into the net — toss short, only 30-50 cm'],
      ['Spinning toss', 'Induces spin on the ball — place the ball, do not toss it'],
      ['Contact with the palm only', 'Use the heel of the hand (bottom of the palm) for a flat surface'],
    ],
    exercises: [
      'Toss & Drop: mark a spot on the floor, toss 20 times without striking — goal 18/20 on the mark',
      `Wall "punch and freeze" at 3 m: work on the immediate stop of the motion`,
      '5 consecutive serves without rotation visually validated by a partner',
    ],
    videos: [
      { title: 'Float serve in 4 minutes', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Improving your float serve', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Serve: float + tennis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Jump float serve',
    level: 'Advanced',
    tagline: 'jump float — standard of elite women players',
    description: "Float with a short approach and jump. Gains contact height, speed, and steeper descent angle. Has become the standard among elite women players (86% of serves in pro women's volleyball according to recent studies). Less risky than the jump topspin while being more disruptive than the standing float.",
    biomechanics: [
      "Short approach (2 to 4 steps)",
      'Arms in bow-and-arrow position during the jump — different from a spike where the arms propel',
      "The approach provides the ball speed, not the arm alone",
      'Contact at the highest point slightly in front of the head',
      'Locked wrist + freeze identical to the standing float',
    ],
    steps: [
      'Position 2-3 m behind the line, ball in the left hand',
      "Step 1 (right) as a primer, arms relaxed",
      'Step 2 (left): toss the ball about 1.5 m high, with no rotation',
      'Step 3 + hop: take off on both feet behind the line — arms rise into bow-and-arrow',
      "Vertical jump slightly forward, body braced",
      'Strike with arm extended, heel of the hand at the center of the ball',
      'FREEZE immediately — land inside the court',
    ],
    errors: [
      ['Toss too high', 'Jump spin reflex — keep the toss short as for the standing float'],
      ["Arms swinging like in an attack", 'Becomes a spike with spin — maintain the bow-and-arrow position'],
      ['Extended follow-through', 'Same as the standing float: freeze is mandatory'],
      ['Foot fault at takeoff', "Make sure the takeoff happens behind the baseline"],
    ],
    exercises: [
      "Master the standing float (solid freeze) before adding the approach",
      'Approach only without striking: work on a stable, low toss',
      'Jump float at controlled speed: consistency before power',
    ],
    videos: [
      { title: "Jump float serve — INF'AUX ENTRAÎNEURS (Bretagne)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + spike (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Jump topspin serve',
    level: 'Competition',
    tagline: 'jump serve — spike from behind the line',
    description: `"Spike from behind the line": ball struck at full speed with topspin (50-60 mph in strong clubs). Highest ace potential but also the highest error rate. Reserved for those who have invested 1000+ reps in training.`,
    biomechanics: [
      "3-4 step approach identical to a back-row spike",
      'High toss (1-1.5 m in front of you) with a slight forward spin induced',
      'Sequential rotation: hips → trunk → shoulder → elbow → wrist',
      'Contact zone at 10-11 o\'clock on the ball',
      'Full wrist snap for the topspin (~30 rotations/s at elite level)',
      'Full follow-through — opposite of the float',
    ],
    steps: [
      'Position 3-4 m behind the line, ball in the hitting hand',
      'Step 1 (right) + high toss with a slight induced topspin',
      'Step 2 (left): acceleration',
      "Step 3 (right): long power step, center of gravity lowering",
      "Step 4 (left): takeoff, arms swing upward",
      'Explosive vertical-forward jump',
      'Strike at the peak: hand passes over the ball (10 o\'clock), palm then fingers rolling over',
      'Full wrist snap + follow-through — land 1-2 m inside the court',
    ],
    errors: [
      ['Toss too low or behind you', 'Cause #1 of hitting the net — the toss must be high and in front'],
      ['Toss too far forward', 'Foot fault — respect the limits of the service zone'],
      ['Lack of wrist snap', 'The ball flies long with no downward spin'],
      ['Using it in a match without preparation', "1000 reps in training first — golden rule"],
    ],
    exercises: [
      "Golden rule: 1000 reps in training before using it in a match",
      'Jump spin "control": lower toss, reduced speed to aim at precise zones',
      'Film your toss: 80% of errors come from toss placement',
    ],
    videos: [
      { title: 'Powerful jump topspin + float serve (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Zone 1 — back right', 'Blocks the setter release in a 5-1 system'],
  ['Zone 2 — short front right', 'Breaks the right-side start, excludes the libero'],
  ['Zone 3 — short front center', 'Blocks the middle, breaks quick attacks'],
  ['Zone 4 — short front left', "Forces the main attacker to pass AND attack"],
  ['Zone 5 — deep back left', "Long diagonal, high error rate"],
  ['Zone 6 — deep back center', 'Serve long against shorter setters'],
];

const S: Record<string, React.CSSProperties> = {
  sectionTitle: {
    fontFamily: '"Bungee", sans-serif', fontSize: 18, letterSpacing: '0.03em',
    margin: '0 0 18px 0', paddingBottom: 10, borderBottom: '3px solid var(--ink)',
  },
  label: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 10 },
  labelTeal: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 },
  labelOrange: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 },
  card: { border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 },
  alert: { border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px' },
};

export default function GuideServiceEn() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        80% of serving errors come from the toss. Stabilize the toss as a priority before chasing power.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>SERVE TYPES</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SERVICE_TYPES.map(t => {
            const on = activeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  padding: '7px 16px',
                  fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.06em',
                  border: '2.5px solid var(--ink)',
                  background: on ? LEVEL_COLOR[t.level] : 'var(--cream)',
                  color: on && LEVEL_TEXT[t.level] ? LEVEL_TEXT[t.level] : 'var(--ink)',
                  cursor: 'pointer',
                  boxShadow: on ? 'var(--shadow-sm)' : 'none',
                  transform: on ? 'translate(-1px,-1px)' : 'none',
                  transition: 'all 0.08s',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <span style={{
          padding: '3px 12px',
          border: '2.5px solid var(--ink)',
          background: LEVEL_COLOR[current.level],
          fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.1em',
          display: 'inline-block',
          color: LEVEL_TEXT[current.level] || 'var(--ink)',
        }}>{current.level.toUpperCase()}</span>

        <div style={S.card}>
          <h3 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, margin: '0 0 4px 0' }}>{current.name}</h3>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6, marginBottom: 14 }}>{current.tagline}</div>
          <p style={{ margin: '0 0 18px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{current.description}</p>

          <div style={{ marginBottom: 18 }}>
            <div style={S.labelTeal}>KEY BIOMECHANICS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>EXECUTION STEPS (RIGHT-HANDED)</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{
                    background: 'var(--orange)', color: 'var(--ink)',
                    fontFamily: '"Bungee", sans-serif', fontSize: 11,
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div>
              <div style={S.labelOrange}>✗ COMMON MISTAKES</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.errors.map(([label, fix], i) => (
                  <li key={i} style={{ fontSize: 13 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                      <strong>{label}</strong>
                    </div>
                    <div style={{ paddingLeft: 20, marginTop: 3, fontSize: 12, opacity: 0.65 }}>{fix}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.labelTeal}>★ DRILLS</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {current.exercises.map((e, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                    <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {current.videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...S.label, opacity: 0.6 }}>VIDEOS — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>TARGET ZONES & TACTICS</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>OPPONENT ZONE</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>TACTICAL EFFECT</th>
              </tr>
            </thead>
            <tbody>
              {ZONES_TABLE.map(([zone, effect], i) => (
                <tr key={i} style={{ borderBottom: i < ZONES_TABLE.length - 1 ? '2px solid var(--ink)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--orange)' }}>{zone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, opacity: 0.8 }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Seams', "Aiming at the space between two passers is more effective than aiming at a player — the opponent's communication is put to the test."],
            ['Alternate short/long', "Prevents the setter from knowing when to drop back. A short float (zones 2-3-4) behind the attack line is particularly disruptive."],
            ['FBSO% metric', "A serve that reduces the opponent's First Ball Side Out from 70% to 45% without producing an ace is a very effective serve."],
          ].map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
              <span><strong>{title}: </strong><span style={{ opacity: 0.8 }}>{text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section>
        <div style={{ border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 }}>
          <div style={{ ...S.label, marginBottom: 16 }}>★ LEARNING HIERARCHY</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
            {SERVICE_TYPES.map(t => {
              const textColor = LEVEL_TEXT[t.level] || 'var(--ink)';
              return (
                <div key={t.id} style={{
                  border: '2.5px solid var(--ink)',
                  background: LEVEL_COLOR[t.level],
                  padding: '10px 12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: textColor, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: textColor, opacity: 0.7 }}>{t.level}</div>
                </div>
              );
            })}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
            Master each level before moving to the next. <strong>Consistency over power.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
