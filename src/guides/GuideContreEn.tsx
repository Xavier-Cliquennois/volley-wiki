import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Watch the attacker, not the ball',
    desc: "Watch the attacker's shoulders and arm to anticipate the moment and direction of the spike.",
  },
  {
    title: 'Jump AFTER the attacker',
    desc: 'Wait until the attacker is in their takeoff phase. If you jump at the same time or before, you will come down too soon.',
  },
  {
    title: 'The ideal delay: 0.2 to 0.3 seconds',
    desc: `Count mentally "ONE" when the attacker jumps, then jump immediately after. This fraction of a second is crucial.`,
  },
  {
    title: 'Penetrate over the net',
    desc: 'At the peak of your jump, push your hands and arms forward and downward — not just upward.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'The offensive block',
    objectif: "Send the ball directly back into the opponent's court",
    points: [
      ['Position', 'Hands spread wide, fingers extended and spread'],
      ['Action', 'Penetrate as far as possible over the net, arms extended forward'],
      ['Target', "Stiffen your wrists to drive the ball down into the opponent's floor"],
      ['When', 'When you are well placed and have read the attack'],
    ],
  },
  {
    name: 'The cover block',
    objectif: 'Slow the ball down so your defense can recover',
    points: [
      ['Position', 'Hands close together, palms angled toward you'],
      ['Action', 'Absorb the impact rather than push'],
      ['Result', 'The ball drops softly into your court to be played'],
      ['When', 'When you are late or poorly positioned'],
    ],
  },
  {
    name: 'The zone block',
    objectif: 'Take away specific attack zones',
    points: [
      ['Position', 'Block a specific zone (line or cross-court)'],
      ['Action', 'Angle your hands toward the zone you want to protect'],
      ['Tactic', 'Force the attacker to spike into a zone where your defenders are ready'],
      ['When', 'In agreement with your back-row defense'],
    ],
  },
  {
    name: 'The 2- or 3-person block (collective block)',
    objectif: 'Create an impenetrable wall',
    points: [
      ['Coordination', 'Jump together at the same moment'],
      ['Placement', 'The outside blockers position themselves relative to the middle blocker'],
      ['Hands', 'Join your hands with your teammates (no gap)'],
      ['Communication', 'One blocker calls "line" or "cross" to coordinate'],
    ],
  },
];

const TIMING_TIPS = [
  ['The "one-two" drill', `In training, say "ONE" when the attacker jumps, "TWO" when you jump. This creates the necessary delay.`],
  ['Watch the shoulders', "The orientation of the attacker's shoulders indicates the direction of the spike."],
  ['Read the set', 'A high set = more time. A tight set = quick reaction.'],
  ['Get into position early', 'Better to be set and waiting than running at the last moment.'],
  ['Work on your vertical', 'The higher you jump, the more margin for error you have on timing.'],
];

const SAUT_POSITION = [
  'Feet shoulder-width apart',
  'Weight on the balls of your feet',
  'Knees slightly bent',
  'Arms by your sides or slightly in front',
  'Position about 30–50 cm from the net',
];

const SAUT_IMPULSION = [
  ['Shuffle step', 'If you need to move, use a quick shuffle step'],
  ['Bend', 'Bend your legs quickly (do not go too low)'],
  ['Arm swing', 'Swing your arms upward explosively'],
  ['Full extension', 'Fully extend your legs to maximize height'],
];

const SAUT_EN_LAIR = [
  'Keep your arms extended and tight',
  'Hands spread wide, fingers extended and spread',
  'Penetrate over the net (no net touch!)',
  'Brace your core to stay stable',
];

const ERREURS = [
  ['Jumping too early', 'You come down as the attacker spikes — wait longer!'],
  ['Watching the ball', 'You lose information about the attacker — watch the player!'],
  ['Soft hands', 'The ball bounces back into your court — stiffen and brace your fingers!'],
  ['Jumping forward', 'You touch the net — jump vertically!'],
  ['Dropping your arms too soon', 'Keep your arms up until you land.'],
];

const EXERCICES = [
  {
    title: 'Timing with a partner',
    desc: 'A partner pretends to attack (without a ball). You work only on the timing of your jump. Repeat 20 times.',
  },
  {
    title: 'Block on a fixed attack',
    desc: 'An attacker spikes from a fixed position. Focus on timing and technique. Gradually increase the speed.',
  },
  {
    title: 'Shoulder reading',
    desc: 'The attacker varies their spikes (line/cross). Try to read their shoulders to anticipate the direction.',
  },
  {
    title: 'Footwork + block',
    desc: 'Work on quick lateral movement followed by a block. Simulates match situations.',
  },
];

const CONSEILS_PRO = [
  ['Patience', 'Blocking is one of the most difficult techniques. Be patient with yourself.'],
  ['Repetition', 'Muscle memory is built through hundreds of repetitions.'],
  ['Video', 'Film yourself to analyze your timing and technique.'],
  ['Watch the pros', 'Watch how professional players read the game and time their jumps.'],
  ['Start simple', 'Master the block against slow attacks before moving on to quick attacks.'],
];

export default function GuideContreEn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="BALL → SETTER → BALL → HITTER'S SHOULDER → JUMP → PENETRATION OVER THE NET">
        With regular practice and particular attention to timing, you will significantly improve your blocks. A well-timed block with average vertical is better than a very high but poorly-timed jump.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>The fundamentals of blocking</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            The block is a crucial defensive move that can become an offensive weapon.
            The key lies in <strong style={{ color: 'var(--orange)' }}>perfect timing</strong> and good reading of the game.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing: the key to success</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {TIMING_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 4px 0' }}>{step.title}</p>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types de contres */}
      <section>
        <h2 style={S.section}>The different types of blocks</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Goal: </span>
                <span style={{ color: 'var(--teal)' }}>{type.objectif}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {type.points.map(([label, text], j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Astuces timing */}
      <section>
        <h2 style={S.section}>Tips to improve your timing</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIMING_TIPS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Séquence visuelle élite */}
      <section>
        <h2 style={S.section}>Elite visual sequence</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>The best blockers do not watch the ball — they follow a precise sequence:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['BALL', 'SETTER', 'BALL', "HITTER'S SHOULDER"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. BALL', 'See the ball travel toward the setter'],
              ['2. SETTER', "Read the setter's hands at the moment of contact — direction of the set"],
              ['3. BALL', 'Briefly follow the ball to confirm the direction'],
              ['4. HITTER\'S SHOULDER', "Lock onto the attacker's shoulder — gives away the spike direction before contact"],
            ].map(([label, text], i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bulletOrange}>▸</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timing précis par type d'attaque */}
      <section>
        <h2 style={S.section}>Precise timing by attack type</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Attack type</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Blocker jump timing</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1st tempo (middle)', 'WITH or a hair before the hitter (commit block)'],
                ['Shoot / 2nd tempo outside', '~0.1s after the hitter'],
                ['High ball outside (3rd tempo)', '0.2–0.3s after the hitter'],
                ['Tight set near the net', 'WITH the hitter'],
                ['Set off the net', '~0.5s after, or do not jump'],
                ['Slide (middle)', 'WITH or just after — track laterally'],
              ].map(([type, timing], i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read vs Commit blocking */}
      <section>
        <h2 style={S.section}>Read blocking vs Commit blocking</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>Read blocking — recommended</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>The blocker waits for the setter's decision, reads the ball and the attacker, then moves. "Bunch read" position (all close to the middle, then explode toward the pin).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Stable and present on the majority of sets', 'Preserves hips and knees', 'Suitable for all amateur levels'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — advanced/pro</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>The middle decides BEFORE the setter releases the ball to jump with the quick. Shuts down the opponent's fast attack, but if the setter sets elsewhere, the middle is completely out of the play.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Effective against dominant middles', 'High risk if the setter adapts', 'Reserved for players with excellent reading'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technique de saut */}
      <section>
        <h2 style={S.section}>Jump technique for the block</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Starting position', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'The takeoff', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'In the air', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
          ] as Array<{ title: string; items: Array<{ label?: string; text: string }> }>).map((col, ci) => (
            <div key={ci} style={S.card}>
              <div style={S.label}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>
                      {'label' in item && item.label ? <><strong>{item.label}: </strong></> : null}
                      <span style={{ opacity: 0.8 }}>{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Erreurs fréquentes */}
      <section>
        <h2 style={S.section}>Common mistakes to avoid</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Common mistakes</div>
          {ERREURS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section>
        <h2 style={S.section}>Training drills</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--orange)', flexShrink: 0, width: 24, textAlign: 'right' }}>{i + 1}.</span>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{ex.title}</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conseils de pro */}
      <section>
        <h2 style={S.section}>Pro tips</h2>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONSEILS_PRO.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vidéos */}
      <section>
        <h2 style={S.section}>Video resources</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Learning to block (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'The block in volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Drill: jumping to block', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Drill: blocking an attack', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
