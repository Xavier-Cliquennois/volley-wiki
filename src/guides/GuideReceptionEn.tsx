import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'The ideal contact surface is between 2.5 and 15 cm above the wrists.'],
  ['Cup and fold', "Recommended technique: one closed fist, the other hand wrapping over the top — thumbs parallel, pointing down."],
  ['Thumbs down', "Pointing the thumbs toward the ground rotates the forearms outward and tightens the platform."],
  ['Never interlace', 'NEVER interlace the fingers on a powerful serve — risk of fracture.'],
  ["Angle drives direction", '"The ball goes where the platform looks" — for a deep reception: platform at 45°; for a short reception: platform more parallel to the floor.'],
];

const STEPS = [
  'Read the server: identify the type of serve before contact.',
  "Ready position with arms separated (NOT joined in advance).",
  'Read the trajectory the moment the opponent strikes the ball.',
  'Move (shuffle steps), arrive BEHIND the ball before the arms come together.',
  'Build the platform early: join the hands when the ball arrives, not too soon.',
  'FREEZE: become still just before contact, weight on the front foot — hold for 1-2 seconds.',
  'Contact on the sweet spot, shoulders oriented toward the target setter.',
  'Follow-through: hips and shoulders move forward toward the target — no arm swing.',
];

const DISPLACEMENTS = [
  {
    name: 'Lateral (shuffle steps)',
    desc: 'The foot on the ball side leaves first. Shuffle steps without crossing, hips low. Arrive behind the ball, reorient toward the target, freeze + platform at the last moment. For long distances: crossover steps then pivot.',
  },
  {
    name: 'Forward (short ball)',
    desc: 'For short serves or tips. Often ends in a forward lunge: knee collapsing toward the ground, platform placed in front of the lead knee.',
  },
  {
    name: 'Backward (drop step)',
    desc: "Pivot the foot then shuffle backward. NEVER run backward (loss of balance). If it is too late to retreat: pivot and create a platform to the side.",
  },
];

type ReceptionSystem = {
  name: string;
  level: string;
  desc: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
};

const SYSTEMS_BY_SIZE: Record<TeamSize, ReceptionSystem[]> = {
  6: [
    {
      name: 'W system — 5 receivers',
      level: 'Beginner',
      desc: '3 players on the front line, 2 on the second — everyone except the setter participates. Historical shape that gives the "W-formation" its name (FIVB, USAV IMPACT).',
      pros: ['Reduced zones per player (~1.8 m lane)', 'Little communication required', 'Ideal for volleyball school and U13-U15'],
      cons: ['Many overlap zones between 5 players', 'Weak receivers forced to participate', 'Disorganizes the attackers (3 front-row players in reception)'],
    },
    {
      name: 'U system — 3 receivers',
      level: 'Modern standard',
      desc: 'Libero in zone 6 (the servers\' main target), wings in zones 5 and 1. The 3 best receivers take every ball, all the front-row attackers come out.',
      pros: ['Communication simplified to 3 players', 'The 3 best receivers cover everything', 'Front-row attackers free for their approach'],
      cons: ['Wider lateral zones to cover (~3 m per player)', 'Requires a high-performing libero', 'Vulnerable to short serves into the corners'],
      recommended: true,
    },
    {
      name: '2-person reception — libero + R4',
      level: 'Elite',
      desc: 'Only 2 receivers (libero + one selected R4) cover the entire width. Used at the highest level to free the 2nd R4 and keep them fresh for the attack without reception fatigue.',
      pros: ['All attackers available for the offensive transition', 'Better block/attack because the attackers are not worn down by reception', 'System preferred by pro teams (Poland, France, Italy)'],
      cons: ['Requires 2 very athletic receivers (~4.5 m lane each)', 'No margin for error — a misread serve = opponent point', 'Unusable without an international-level libero'],
    },
  ],
  5: [
    {
      name: '3-person reception — 2F-3B setup',
      level: 'Recommended',
      desc: 'The 3 back-row players (P5, P6, P1) receive. The setter in P1 comes out of the reception and penetrates the moment the server makes contact, just like the 5-1 in 6v6. The 2 front-row players (P4, P3) are free for their approach.',
      pros: ['Setup closest to the 5-1 6v6 (pedagogically ideal)', 'Good reception → attack transition', '2 front-row attackers + back-row pipe possible'],
      cons: ['3 receivers across 9 m (~3 m per player)', 'The setter must read fast and decide to penetrate in < 1 second', 'Gap in P1 if the setter leaves too soon'],
      recommended: true,
    },
    {
      name: '4-person reception — 3F-2B setup',
      level: 'Standard',
      desc: 'The 2 back-row players (P5, P1) + 2 front-row players (typically P4 and P3 — the setter in P2 steps out) receive. The setter stays at the target: no penetration, immediate distribution.',
      pros: ['Reduced zones (~2.25 m per player)', 'Ideal for mixed or beginner teams', 'Setter already at the target — no transition'],
      cons: ['Only 2 attackers available in front (P4 + P3 or P4 + middle)', 'The front-row players who receive then have to run their approach', '2-person block hard because the setter goes up to the net'],
    },
    {
      name: 'Pentagon reception — 4 or 5 players',
      level: 'Beginner / recreational',
      desc: '5 receivers (equivalent of the 5-player W). 1 player at the net center (often a dedicated setter), the 2 wings in the middle, the 2 back-row players in the deep zone. Everyone participates unless the center player is a dedicated setter.',
      pros: ['Even court coverage', 'Very low technical demand', 'Suited to introductory training sessions'],
      cons: ['Many overlaps with 5 receivers', 'No attacker is freed up', 'Ineffective as soon as the level rises'],
    },
  ],
  4: [
    {
      name: 'Diamond (3 receivers)',
      level: 'Standard 4v4',
      desc: 'Setter at the net center (P3, stepping out of the reception). The 2 wings (P4, P2) in mid-court + the lone back-row player (P1) in the deep zone receive. The most common formation in indoor 4v4 (college intramurals).',
      pros: ['Setter already at the target — no penetration', '3 clear and symmetric zones', 'Ideal for intramurals, recreational play, beach 4s'],
      cons: ['Covering 9 m of width with 3 = ~3 m per player', 'The lone back-row player must defend the entire deep zone after the reception', 'Only 2 attackers in front'],
      recommended: true,
    },
    {
      name: '3-1 line (3 receivers)',
      level: 'Intermediate',
      desc: 'Single setter in P1 (back row) who penetrates the moment the opponent\'s serve is contacted toward zone 2. The 3 front-row attackers (P4, P3, P2) receive. Simplified equivalent of the 5-1 6v6.',
      pros: ['3 attackers in front at all times', 'Useful pedagogy for preparing the 5-1 6v6', 'The setter can also attack after distributing'],
      cons: ['Demands a very clean reception (penetration is unforgiving)', 'Gap in P1 if the setter leaves before the ball is defended', 'Every attacker must know how to receive'],
    },
    {
      name: 'Box 2-2 (4 receivers)',
      level: 'Beginner',
      desc: '2 front-row players (P4, P2) + 2 back-row players (P5, P1), no dedicated setter at the net. The best-placed player takes the 2nd touch. Typical of introductory sessions or U11-U13.',
      pros: ['Covers the entire court (4 zones of 2.25 m)', 'No technical demand on the setter', 'Everyone receives — very educational'],
      cons: ['No dedicated setter — random distribution', 'No attacker is freed for their approach', 'Ineffective as soon as the level rises'],
    },
  ],
};

type PasseurRole = {
  title: string;
  bullets: string[];
  note?: string;
};

const PASSEUR_BY_SIZE: Record<TeamSize, PasseurRole[]> = {
  6: [
    {
      title: 'BACK-ROW setter (P1 / P6 / P5) — P1, P6, P5 rotations of the 5-1',
      bullets: [
        'Steps out of the reception: no ball is intended for them.',
        'Starts in a special position (e.g. P1: ~7.5 m from the net, 1 m from the sideline), hidden behind another player (stack).',
        'Penetrates toward the target (between Z2 and Z3, ~1 m from the net, 3 m right of center) THE MOMENT THE OPPONENT CONTACTS THE SERVE — not before (overlap fault).',
        'P1: shortest penetration; P6: central penetration; P5: longest penetration (diagonal).',
        '3 attackers in front available (R4 + middle + opposite) + back-row attacks.',
      ],
    },
    {
      title: 'FRONT-ROW setter (P2 / P3 / P4) — P2, P3, P4 rotations of the 5-1',
      bullets: [
        'Steps out of the reception: they are already close to the target.',
        'In P2: already at the target — also becomes the line blocker against the opposing R4 from Z4 (double defensive workload).',
        'In P3: lateral switch toward the target immediately after the serve is contacted.',
        'In P4: crosses the entire net to reach the target (the longest front-row movement).',
        'Only 2 attackers in front (compensated by a pipe in P6 and a back-row attack from the opposite in P1).',
      ],
    },
  ],
  5: [
    {
      title: 'PENETRATING setter (2F-3B setup, recommended)',
      bullets: [
        'Starts in P1 back row, steps out of the reception.',
        'Penetrates toward the target (Z2/Z3, ~1 m from the net) THE MOMENT the opponent\'s serve is contacted — identical to the 5-1 6v6.',
        'The 3 back-row players (P5 + P6 + P1 leaving) cover the 3-person reception.',
        'Must wait until the ball is defended before leaving (common mistake: early departure → gap in P1).',
      ],
      note: 'Setup closest to 6v6 — recommended to prepare the transition.',
    },
    {
      title: 'FIXED FRONT-ROW setter (3F-2B or pentagon setup)',
      bullets: [
        'Stays at the target (P2 or P3 depending on the setup): no penetration.',
        'Steps out of the reception: no ball is intended for them.',
        'Immediate distribution as soon as the pass arrives — no transition.',
        'In P2: also becomes the line blocker against the opposing outside hitter (as in 5-1 6v6).',
      ],
    },
  ],
  4: [
    {
      title: 'FRONT-ROW setter in diamond (P3 net center)',
      bullets: [
        'Stays at the target (Z3, ~1 m from the net): no penetration.',
        'Steps out of the reception: the other 3 (2 wings + 1 back) receive.',
        'Quick distribution to Z4 or Z2 depending on the quality of the pass.',
        'Their defense → set transition must be executed in less than 2 seconds (only 1 back-row player = a lot of coverage).',
      ],
      note: 'Most-used formation in indoor 4v4.',
    },
    {
      title: 'PENETRATING setter in 3-1 line (P1 back row)',
      bullets: [
        'Starts in P1 back row, steps out of the reception.',
        'Penetrates toward zone 2 the moment the opponent\'s serve is contacted.',
        'The 3 front-row attackers (P4, P3, P2) receive.',
        'Requires a very clean reception — otherwise the setter cannot reach the target in time.',
      ],
    },
    {
      title: 'No dedicated setter (box 2-2)',
      bullets: [
        'The best-placed player after the 1st touch takes the 2nd touch.',
        'Everyone receives — 4 zones of ~2.25 m.',
        'Random distribution toward one of the 3 other players.',
        'Reserve for introductory sessions (U11-U13, school).',
      ],
    },
  ],
};

type LiberoNote = {
  title: string;
  text: string;
  accent: 'orange' | 'teal' | 'plum';
};

const LIBERO_BY_SIZE: Record<TeamSize, LiberoNote> = {
  6: {
    title: 'The libero — centerpiece of reception in 6v6',
    text: 'Defensive specialist in a contrasting jersey. Systematically replaces the middles when they rotate to the back row (unlimited substitutions, not counted by FIVB Rule 19). Plays 3 consecutive rotations in Z5-Z6-Z1. Preferred reception position: Z6 (the servers\' main target) or Z5. FIVB restrictions: no block, no attack above the net, no overhand set in front of the 3 m line if a teammate then attacks above the net.',
    accent: 'orange',
  },
  5: {
    title: 'No official libero in 5v5',
    text: 'Indoor 5v5 has no FIVB regulation. In practice, no federation allows a libero in this format. The best receiver is placed in P6 or P5 and systematically plays back row — they become the "de facto libero" without the contrasting jersey or the restrictions. They can therefore block and attack if necessary.',
    accent: 'teal',
  },
  4: {
    title: 'No libero in 4v4',
    text: 'No libero is allowed under 4v4 regulations (college intramurals, FFVb educational play, beach 4s). The lone back-row player in diamond — or the penetrating setter in 3-1 line — takes on the role of best receiver/defender. With ~3 m of lane per receiver in diamond, anticipation matters more than technique.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Underhand', 'Normal posture, take the ball high'],
  ['Standing float', "High posture, step forward to take it early before it deviates"],
  ['Topspin', 'Low posture, ready to retreat, angled platform'],
  ['Jump float', 'Can be played overhand at 4 m from the net'],
  ['Jump topspin', 'Low posture, anticipated retreat, rigid passive platform'],
  ['Hybrid serve', 'Platform ready for both scenarios (float or topspin)'],
];

const READING_CUES = [
  'Server\'s position on the line → preferred angle',
  'Height and placement of the toss: high+behind → topspin; low+in front → float',
  "Length of the approach: long → jump topspin; short → jump float",
  'Direction of the server\'s shoulders at contact → direction of the ball',
];

const ERRORS_COMMON: [string, string][] = [
  ['Swinging arms', 'Cause #1 — arms swinging on contact, ball unpredictable. Fix: "the platform is passive, the legs are active".'],
  ['Broken platform', "One forearm higher than the other — lock the elbows and push the thumbs down."],
  ['Arms joined too early', "Slows the movement and prevents the late bump/hands choice. Join the hands only when arriving."],
  ['Torso too upright', "The platform passes under the ball → ball ends up too far from the net. Lean 30-45° forward."],
  ['Contact above the navel', 'Too high = reduced control. Aim for contact at waist height or lower.'],
  ['No freeze', "Still moving at contact = impossible to control direction. Come to a complete stop."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Mispositioned libero', 'Too central they miss short serves into the corners; too lateral they abandon the center. Reference target: Z6 lined up with the opposing server.'],
    ['Setter overlap', 'The setter leaves their position before the opponent contacts the serve — fault #1 in the 5-1 (FIVB Rule 7.4). Their feet must respect the front/back relations until contact.'],
    ['5-person reception without clear roles', 'In a W, the 3 front-row players interfere in the central zone. Explicitly define who takes the ball between P3 and P6 on serves down the middle.'],
  ],
  5: [
    ['Setter leaving too early', 'In the 2F-3B setup with a penetrating setter, leaving before the ball is defended = gap in P1. Wait for confirmation.'],
    ['2 receivers side by side', 'In the 3F-2B setup, P5 and P1 must be spaced apart (one per side). Centered together = exposed sidelines.'],
    ['Front-row receiver who forgets to attack', 'In the 3F-2B setup, the front-row player who receives must then run their attack approach — a reflex to specifically drill.'],
    ['No de-facto libero defined', 'Without a clear role, the 3 back-row players bounce responsibility around. Explicitly designate the best receiver as the priority in the central zone.'],
  ],
  4: [
    ['Diamond setter who receives', 'In a diamond, the setter in P3 must STEP OUT of the reception — otherwise distributing quickly is impossible. The other 3 take it.'],
    ['Overloaded lone back-row', 'In a diamond, the back-row P1 covers ~3.5 m of deep court alone. Anticipation = skill #1; constant shuffle steps and early reading.'],
    ['Box 2-2 without a call on 2nd touch', 'Without a dedicated setter, who sets? Shouting "MINE!" on the 2nd touch as soon as the reception happens is non-negotiable.'],
    ['Diamond wings in a straight line', 'P4 and P2 in mid-court at the same level as P1 → the short cut shot drops between them. Stagger the positions.'],
  ],
};

const VIDEOS = [
  { title: 'How to bump (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'The forearm pass (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Controlled bump to the setter', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Learning high and low reception (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Individual forearm pass warm-up', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionEn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSize = parseInt(searchParams.get('size') ?? '6') as TeamSize;
  const [teamSize, setTeamSize] = useState<TeamSize>([4, 5, 6].includes(initialSize) ? initialSize : 6);

  useEffect(() => {
    setSearchParams({ size: String(teamSize) }, { replace: true });
  }, [teamSize, setSearchParams]);

  const systems = SYSTEMS_BY_SIZE[teamSize];
  const passeurRoles = PASSEUR_BY_SIZE[teamSize];
  const liberoNote = LIBERO_BY_SIZE[teamSize];
  const errorsSize = ERRORS_BY_SIZE[teamSize];

  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)', color: 'var(--ink)',
    cursor: 'pointer',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', boxShadow: 'var(--shadow-sm)' };

  const accentColor = (a: LiberoNote['accent']) =>
    a === 'orange' ? 'var(--orange)' : a === 'teal' ? 'var(--teal)' : 'var(--plum)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      <GoldenRule>
        The forearm pass determines 60% of a team's offensive success. Without a good reception, no quick attack. The platform is passive — the legs are active.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Game format</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          The <strong>reception systems</strong>, the <strong>setter's role</strong> and the <strong>common errors</strong> below adapt to the chosen format.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {([6, 5, 4] as const).map(size => (
            <button key={size} onClick={() => setTeamSize(size)} style={teamSize === size ? btnActive : btnBase}>
              {size}v{size}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Ready position</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Feet slightly wider than the shoulders, one foot slightly ahead',
              "Knees flexed toward the inside of the feet, hips low, torso leaning 30-45°",
              'Back straight, weight on the balls of the feet (heels slightly lightened but not lifted)',
              'Arms SEPARATED (not joined), flexed at 90-145°, at waist height',
              'Eyes on the server from the moment of the toss',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Main error: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>having the arms already joined into a platform before the ball arrives — this slows the movement and prevents the late bump/hands choice.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>The platform</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PLATFORM_TIPS.map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14 }}>
              <span style={S.bullet}>▸</span>
              <span>
                <strong style={{ color: 'var(--ink)', fontFamily: '"DM Sans", sans-serif' }}>{title}: </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Execution — key steps</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>The freeze: </strong>
          "Pose for a picture" — become completely still for 1-2 seconds after contact. At 50-90 km/h, a defender on the move cannot adjust their angle. Standing still, they can move in any direction.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Movements</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>One-arm bump — emergency</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              A last-resort move when the ball is too far for both arms. Arm extended, platform flat on the inner forearm, no swing — just a stab to deflect the ball upward. Variants: one-arm stab (fist on a powerful spike), one-arm scoop (open palm facing up, low ball).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Reception systems — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Non-official FIVB format</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "Indoor 5v5 has no dedicated FIVB or FFVb regulation. The systems below are logical adaptations of the 5-1 6v6 documented by VolleyballXL, The Art of Coaching Volleyball and Volleyball Canada."
                : "Indoor 4v4 has no official FIVB regulation. The formations below come from college intramurals (USA), FFVb / Volleyball Canada educational manuals and the beach literature (Brandon Joyner, Better at Beach)."}
            </p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {systems.map((s, i) => (
            <div key={i} style={{ ...S.card, borderColor: s.recommended ? 'var(--orange)' : 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 2 }}>{s.name}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: s.recommended ? 'var(--orange)' : 'var(--ink)', opacity: s.recommended ? 1 : 0.5 }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{s.desc}</p>
              <div>
                <div style={S.labelTeal}>Pros</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.pros.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={S.bullet}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Cons</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.cons.map((c, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Setter's role in reception — {teamSize}v{teamSize}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {passeurRoles.map((role, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 8 }}>{role.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {role.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{b}</span>
                  </li>
                ))}
              </ul>
              {role.note && (
                <div style={{ marginTop: 10, borderLeft: '4px solid var(--teal)', paddingLeft: 12, fontSize: 12, color: 'var(--ink)', opacity: 0.7 }}>
                  <strong style={{ color: 'var(--teal)' }}>Note: </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>The libero — specialized reception</h2>
        <div style={{ ...S.card, borderLeft: `5px solid ${accentColor(liberoNote.accent)}` }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: accentColor(liberoNote.accent), marginBottom: 8 }}>
            {liberoNote.title}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0, lineHeight: 1.65 }}>
            {liberoNote.text}
          </p>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Reading the serve to get into position</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Serve type</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Receiver's adjustment</th>
              </tr>
            </thead>
            <tbody>
              {READING_TABLE.map(([type, adapt], i) => (
                <tr key={i} style={{ borderBottom: i < READING_TABLE.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{adapt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={S.labelTeal}>Cues before the server's contact</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {READING_CUES.map((cue, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Common errors</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Technical errors (all formats)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Errors specific to {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

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
