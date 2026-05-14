import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Beginner': 'var(--mint)',
  'Beginner → Intermediate': 'var(--mint)',
  'Intermediate': 'var(--yellow)',
  'Intermediate+': 'var(--orange)',
  'Advanced': 'var(--orange)',
};

const PHASES = [
  ['Initiation', 'Reading the set and deciding on the approach'],
  ['Wind-up', 'Start of the approach'],
  ['Cocking', 'Elbow above the shoulder, hand behind the ear — power position'],
  ['Acceleration', 'Sequential rotation: hips → torso → shoulder → elbow → wrist'],
  ['Contact + follow-through', 'Wrist snap, the hand "claws" over the top of the ball → topspin'],
];

const APPROACH_3 = [
  ['Step 1 (left)', 'Short directional step, oriented toward the attack'],
  ['Step 2 (right)', 'Power step — long and low, heel first, lowering the center of gravity'],
  ['Step 3 (left)', 'Closing step — short, brakes the horizontal translation and converts it into vertical'],
];

const APPROACH_4 = [
  ['Step 1 (right)', 'Observation step, slow rhythm'],
  ['Step 2 (left)', 'Acceleration'],
  ['Step 3 (right)', 'Power step — the most important, long and low'],
  ['Step 4 (left)', 'Closing step parallel to the net'],
];

const TIMING_TABLE: [string, string][] = [
  ['High ball (3rd tempo)', 'Start LATE — when the ball leaves the setter\'s hands'],
  ['2nd tempo (Hut/Go)', 'Start when the pass is arriving toward the setter'],
  ['1st tempo (Quick)', 'Start EARLY — already in the air when the setter touches the ball'],
  ['Slide', 'Start the moment the setter receives the pass'],
];

type AttackType = {
  id: string;
  name: string;
  position: string;
  description: string;
  keyPoints: string[];
  shots: string[];
};

const ATTACK_TYPES: AttackType[] = [
  {
    id: 'outside',
    name: 'Zone 4 attack (Outside / OH)',
    position: 'Left wing',
    description: `Foundation for learning to attack. The outside hitter receives the largest volume of balls — it's the setter's "safety" option. Approach at 45° from the left.`,
    keyPoints: [
      '4-step approach at ~45° to the net',
      'Plant 30-50 cm from the net',
      '"Hut" set (high 3rd tempo) or "Go" (fast 2nd tempo)',
      'Jump VERTICALLY — not toward the net',
      'Contact slightly in front of the hitting shoulder',
    ],
    shots: ['Cross-court', 'Line shot', 'Cut shot (sharp angle <3 m)', 'Tip', 'Roll shot (topspin off-speed)'],
  },
  {
    id: 'middle',
    name: 'Middle attack (Quick / 1st tempo)',
    position: 'Front middle',
    description: 'The fastest attack. The middle blocker is in the air BEFORE or as the setter touches the ball. Very low (30-50 cm) and very short set.',
    keyPoints: [
      'Trigger the approach EARLY — already in the air at the setter\'s release',
      '2-3 step approach, arm already loaded on the way up',
      `"Ghost Middle" concept: even if the ball doesn't come, run the quick at full speed to hold the opposing block → frees up the outside hitters`,
      'Contact 30-50 cm above the net',
      'Fast transition: block → approach in 1-2 seconds',
    ],
    shots: ['Quick in front of the setter ("1")', 'Back-1 behind the setter', 'Slide (back start along the net)', '31/Gap (offset between setter and antenna)'],
  },
  {
    id: 'opposite',
    name: 'Zone 2 attack (Opposite)',
    position: 'Right wing',
    description: 'The opposite attacks from zone 2. Ideal for left-handers (hitting shoulder on the right antenna side = maximum window). For right-handers: more pronounced torso rotation, position further from the antenna.',
    keyPoints: [
      'Approach symmetrical to the outside hitter but from the right',
      'Finish with the thumb down for the cut shot',
      '"Release" option for the setter when the reception is poor',
      'Back-row attack from P1 (zone D) when in back-row',
    ],
    shots: ['Cross-court', 'Line shot', 'Pipe/D from back-row', 'Cut shot diagonal toward zone 5'],
  },
  {
    id: 'backrow',
    name: 'Back-row attack (Pipe)',
    position: 'Back middle or back right',
    description: 'Attack from the back zone. The plant MUST happen BEHIND the 3 m line. Allows for 4 attackers against 3 blockers.',
    keyPoints: [
      'Take-off mandatory behind the 3 m line (otherwise fault)',
      'Landing in the front zone after a legal jump = OK',
      'Pipe: from P6, back set off the quick (BIC = just above the quick)',
      'Zone D: from P1, often a fallback attack for the opposite',
    ],
    shots: ['Pipe (back middle)', 'Zone D (back right)', 'Zone A (back left, rare)', 'Tip on a bad set'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Tip',
    level: 'Beginner → Intermediate',
    desc: 'IDENTICAL approach to the spike (disguise is crucial), then at contact slow the arm down and place the ball with a flick of the fingers. Direction: empty zone spotted BEFORE the jump.',
  },
  {
    name: 'Roll shot / Topspin off-speed',
    level: 'Intermediate',
    desc: 'Hit at reduced speed (~50-70%) with strong topspin for a ball that dives short behind the block. Harder to read than a tip because it\'s faster.',
  },
  {
    name: 'Cut shot / Sharp angle',
    level: 'Intermediate+',
    desc: 'Sharp angle toward zone 1 (from 4) or zone 5 (from 2). Finish with the thumb down, hand cutting laterally across the ball. Strike the side of the ball, not the top.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermediate+',
    desc: 'Deliberately push the ball out off the blockers\' hands. On a set tight to the net, jump vertically and push the ball laterally using the blocker\'s outside hand as a "rail".',
  },
];

const ERRORS = [
  ['Approach timing', 'Too early: re-jump without power. Too late: arm stretched back at contact.'],
  ['Wrong foot order', 'Always finish on left-right (right-hander) — both feet nearly simultaneous.'],
  ['No topspin', 'Flat hand = no snap = ball sails long. "Claw" over the top of the ball.'],
  ['Net fault', 'Jumping forward on a tight set. Jump VERTICAL, not forward.'],
  ['Back-row fault', 'Foot on or in front of the 3 m line at take-off.'],
  ['One-foot landing', 'Except for the slide: land on both feet to protect the knee (ACL risk).'],
];

const VIDEOS = [
  { title: 'How to attack — 3 steps (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'The spike in volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Detailed attack approach', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Seb\'s Sequence — everything about the spike', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Jumping to attack (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Placed attacks (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaqueEn() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="SLOW APPROACH → FAST → POWER STEP → CLOSING → VERTICAL JUMP → ARM EXTENDED FORWARD → WRIST SNAP">
        Power comes from the full kinetic chain, not from the arm alone. A rhythmic approach with the last two steps fast generates 70% of the final power.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>The 5 phases of the spike</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PHASES.map(([phase, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{phase}: </strong>
                <span style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14 }}>
          <strong style={{ color: 'var(--ink)' }}>Ideal contact: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Slightly in front of the hitting shoulder, never behind the head (loss of power + injury risk). Distance to the net at take-off: 30-50 cm minimum.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Approach</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 steps — Beginner</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Left-right-left (right-hander)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_3.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>4 steps — Competition standard</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Right-left-right-left (right-hander)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Golden rule: the last two steps are the fastest — slow → fast.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing by set type</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Set type</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>When to start the approach</th>
              </tr>
            </thead>
            <tbody>
              {TIMING_TABLE.map(([type, timing], i) => (
                <tr key={i} style={{ borderBottom: i < TIMING_TABLE.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attack types */}
      <section>
        <h2 style={S.section}>Attack types by position</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {ATTACK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAttack(t.id)}
              style={{
                padding: '6px 14px',
                fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
                border: '2.5px solid var(--ink)',
                background: activeAttack === t.id ? 'var(--orange)' : 'var(--cream)',
                color: activeAttack === t.id ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                boxShadow: activeAttack === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.position}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{current.name}</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.position}</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6, marginBottom: 16 }}>{current.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <div style={S.labelTeal}>Key points</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.keyPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.label}>Shot selection</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.shots.map((s, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special shots */}
      <section>
        <h2 style={S.section}>Special shots</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPECIAL_SHOTS.map((s, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{s.name}</div>
                <span style={{
                  fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 10px',
                  border: '1.5px solid var(--ink)',
                  background: LEVEL_COLOR[s.level] || 'var(--paper)',
                  color: 'var(--ink)', flexShrink: 0,
                }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Errors */}
      <section>
        <h2 style={S.section}>Common mistakes</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Avoid</div>
          {ERRORS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section>
        <h2 style={S.section}>Video resources</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
