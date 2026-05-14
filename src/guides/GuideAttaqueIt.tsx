import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Principiante': 'var(--mint)',
  'Principiante → Intermedio': 'var(--mint)',
  'Intermedio': 'var(--yellow)',
  'Intermedio+': 'var(--orange)',
  'Avanzato': 'var(--orange)',
};

const PHASES = [
  ['Inizio', 'Lettura dell\'alzata e decisione sulla rincorsa'],
  ['Caricamento', 'Inizio della rincorsa'],
  ['Cocking', "Gomito sopra la spalla, mano dietro l'orecchio — posizione di potenza"],
  ['Accelerazione', 'Rotazione sequenziale: anche → tronco → spalla → gomito → polso'],
  ['Contatto + accompagnamento', 'Frustata del polso, la mano "artiglia" sopra la palla → topspin'],
];

const APPROACH_3 = [
  ['Passo 1 (sinistro)', "Passo direzionale corto, orientato verso l'attacco"],
  ['Passo 2 (destro)', 'Passo di potenza — lungo e basso, tallone per primo, abbassamento del baricentro'],
  ['Passo 3 (sinistro)', 'Passo di chiusura — corto, frena la traslazione orizzontale e la converte in verticale'],
];

const APPROACH_4 = [
  ['Passo 1 (destro)', 'Passo di osservazione, ritmo lento'],
  ['Passo 2 (sinistro)', 'Accelerazione'],
  ['Passo 3 (destro)', 'Passo di potenza — il più importante, lungo e basso'],
  ['Passo 4 (sinistro)', 'Passo di chiusura parallelo alla rete'],
];

const TIMING_TABLE: [string, string][] = [
  ['Palla alta (3° tempo)', "Parti TARDI — quando la palla lascia le mani dell'alzatore"],
  ['2° tempo (Hut/Go)', "Parti quando il bagher sta arrivando verso l'alzatore"],
  ['1° tempo (Quick)', "Parti PRESTO — già in aria quando l'alzatore tocca la palla"],
  ['Slide', "Parti nell'istante in cui l'alzatore riceve il bagher"],
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
    name: 'Attacco zona 4 (Schiacciatore di banda / OH)',
    position: 'Banda sinistra',
    description: `Base per imparare ad attaccare. Lo schiacciatore di banda riceve il volume più grande di palle — è l'opzione "di sicurezza" dell'alzatore. Rincorsa a 45° da sinistra.`,
    keyPoints: [
      'Rincorsa a 4 passi a ~45° rispetto alla rete',
      'Stacco a 30-50 cm dalla rete',
      'Alzata "Hut" (3° tempo alta) o "Go" (2° tempo veloce)',
      'Salta VERTICALE — non verso la rete',
      'Contatto leggermente davanti alla spalla che colpisce',
    ],
    shots: ['Diagonale', 'Lungolinea', 'Cut shot (angolo stretto <3 m)', 'Pallonetto', 'Roll shot (topspin a velocità ridotta)'],
  },
  {
    id: 'middle',
    name: 'Attacco al centro (Quick / 1° tempo)',
    position: 'Centrale di prima linea',
    description: "L'attacco più veloce. Il centrale è in aria PRIMA o mentre l'alzatore tocca la palla. Alzata molto bassa (30-50 cm) e molto corta.",
    keyPoints: [
      "Innesca la rincorsa PRESTO — già in aria al rilascio dell'alzatore",
      'Rincorsa a 2-3 passi, braccio già caricato in salita',
      `Concetto "Ghost Middle": anche se la palla non arriva, esegui il quick a tutta velocità per tenere il muro avversario → libera gli schiacciatori di banda`,
      'Contatto 30-50 cm sopra la rete',
      'Transizione rapida: muro → rincorsa in 1-2 secondi',
    ],
    shots: ["Quick davanti all'alzatore (\"1\")", "Back-1 dietro l'alzatore", 'Slide (partenza dietro lungo la rete)', '31/Gap (intermedio tra alzatore e antenna)'],
  },
  {
    id: 'opposite',
    name: 'Attacco zona 2 (Opposto)',
    position: 'Banda destra',
    description: "L'opposto attacca dalla zona 2. Ideale per i mancini (spalla che colpisce dal lato dell'antenna destra = finestra massima). Per i destrimani: rotazione del tronco più marcata, posizione più lontana dall'antenna.",
    keyPoints: [
      'Rincorsa simmetrica a quella dello schiacciatore di banda ma da destra',
      'Finisci con il pollice in giù per il cut shot',
      'Opzione "release" per l\'alzatore quando la ricezione è scadente',
      'Attacco da seconda linea da P1 (zona D) quando è in seconda linea',
    ],
    shots: ['Diagonale', 'Lungolinea', 'Pipe/D da seconda linea', 'Cut shot diagonale verso zona 5'],
  },
  {
    id: 'backrow',
    name: 'Attacco da seconda linea (Pipe)',
    position: 'Centrale dietro o destra dietro',
    description: 'Attacco dalla zona arretrata. Lo stacco DEVE avvenire DIETRO la linea dei 3 m. Consente 4 attaccanti contro 3 muratori.',
    keyPoints: [
      'Stacco obbligatorio dietro la linea dei 3 m (altrimenti fallo)',
      "Atterraggio nella zona d'attacco dopo un salto legale = OK",
      'Pipe: da P6, alzata dietro fuori dal quick (BIC = appena sopra il quick)',
      "Zona D: da P1, spesso un attacco di ripiego per l'opposto",
    ],
    shots: ['Pipe (centro dietro)', 'Zona D (destra dietro)', 'Zona A (sinistra dietro, rara)', 'Pallonetto su un\'alzata scadente'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Pallonetto',
    level: 'Principiante → Intermedio',
    desc: "Rincorsa IDENTICA alla schiacciata (il camuffamento è cruciale), poi al contatto rallenta il braccio e appoggia la palla con un colpetto delle dita. Direzione: zona vuota individuata PRIMA del salto.",
  },
  {
    name: 'Roll shot / Topspin a velocità ridotta',
    level: 'Intermedio',
    desc: "Colpo a velocità ridotta (~50-70%) con forte topspin per una palla che cade corta dietro il muro. Più difficile da leggere di un pallonetto perché è più veloce.",
  },
  {
    name: 'Cut shot / Angolo stretto',
    level: 'Intermedio+',
    desc: "Angolo stretto verso la zona 1 (dalla 4) o zona 5 (dalla 2). Finisci con il pollice in giù, mano che taglia lateralmente la palla. Colpisci il lato della palla, non la parte alta.",
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermedio+',
    desc: 'Spingere deliberatamente la palla fuori dalle mani dei muratori. Su un\'alzata tirata sulla rete, salta verticale e spingi la palla lateralmente usando la mano esterna del muratore come una "rotaia".',
  },
];

const ERRORS = [
  ['Timing della rincorsa', 'Troppo presto: ri-salto senza potenza. Troppo tardi: braccio teso indietro al contatto.'],
  ['Ordine dei piedi sbagliato', 'Finisci sempre su sinistro-destro (destrimane) — entrambi i piedi quasi simultanei.'],
  ['Niente topspin', 'Mano piatta = nessuna frustata = palla che vola lunga. "Artiglio" sopra la palla.'],
  ['Fallo di rete', "Saltare in avanti su un'alzata tirata. Salta VERTICALE, non in avanti."],
  ['Fallo da seconda linea', 'Piede sulla o davanti alla linea dei 3 m allo stacco.'],
  ['Atterraggio su un piede', "Tranne per la slide: atterra a piedi pari per proteggere il ginocchio (rischio LCA)."],
];

const VIDEOS = [
  { title: 'Come attaccare — 3 passi (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'La schiacciata nella pallavolo (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: "Rincorsa d'attacco dettagliata", url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Seb\'s Sequence — tutto sulla schiacciata', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Saltare per attaccare (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Attacchi piazzati (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaqueIt() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="RINCORSA LENTA → VELOCE → PASSO DI POTENZA → CHIUSURA → SALTO VERTICALE → BRACCIO TESO AVANTI → FRUSTATA DEL POLSO">
        La potenza nasce dalla catena cinetica completa, non dal solo braccio. Una rincorsa ritmica con gli ultimi due passi veloci genera il 70% della potenza finale.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>Le 5 fasi della schiacciata</h2>
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
          <strong style={{ color: 'var(--ink)' }}>Contatto ideale: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Leggermente davanti alla spalla che colpisce, mai dietro la testa (perdita di potenza + rischio di infortunio). Distanza dalla rete allo stacco: 30-50 cm minimo.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Rincorsa</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 passi — Principiante</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Sinistro-destro-sinistro (destrimane)</div>
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
            <div style={S.label}>4 passi — Standard agonistico</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Destro-sinistro-destro-sinistro (destrimane)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Regola d'oro: gli ultimi due passi sono i più veloci — lento → veloce.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing per tipo di alzata</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo di alzata</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Quando iniziare la rincorsa</th>
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
        <h2 style={S.section}>Tipi di attacco per posizione</h2>
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
              <div style={S.labelTeal}>Punti chiave</div>
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
              <div style={S.label}>Selezione del colpo</div>
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
        <h2 style={S.section}>Colpi speciali</h2>
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
        <h2 style={S.section}>Errori comuni</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Da evitare</div>
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
        <h2 style={S.section}>Risorse video</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
