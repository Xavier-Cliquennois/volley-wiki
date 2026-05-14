import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Guarda l\'attaccante, non la palla',
    desc: "Osserva le spalle e il braccio dell'attaccante per anticipare il momento e la direzione della schiacciata.",
  },
  {
    title: "Salta DOPO l'attaccante",
    desc: "Aspetta che l'attaccante sia nella fase di stacco. Se salti contemporaneamente o prima, scenderai troppo presto.",
  },
  {
    title: 'Il ritardo ideale: 0,2-0,3 secondi',
    desc: `Conta mentalmente "UNO" quando l'attaccante salta, poi salta subito dopo. Questa frazione di secondo è cruciale.`,
  },
  {
    title: 'Penetra oltre la rete',
    desc: 'Al culmine del salto, spingi mani e braccia in avanti e verso il basso — non solo verso l\'alto.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'Il muro offensivo',
    objectif: "Rispedire la palla direttamente nel campo avversario",
    points: [
      ['Posizione', 'Mani ben aperte, dita estese e divaricate'],
      ['Azione', 'Penetra il più possibile oltre la rete, braccia distese in avanti'],
      ['Bersaglio', "Irrigidisci i polsi per spingere la palla verso il pavimento avversario"],
      ['Quando', 'Quando sei ben piazzato e hai letto l\'attacco'],
    ],
  },
  {
    name: 'Il muro di copertura',
    objectif: 'Rallentare la palla per permettere alla difesa di recuperare',
    points: [
      ['Posizione', 'Mani ravvicinate, palmi inclinati verso di te'],
      ['Azione', 'Assorbi l\'impatto invece di spingere'],
      ['Risultato', 'La palla cade morbida nel tuo campo per essere giocata'],
      ['Quando', 'Quando sei in ritardo o mal posizionato'],
    ],
  },
  {
    name: 'Il muro a zona',
    objectif: 'Togliere zone d\'attacco specifiche',
    points: [
      ['Posizione', 'Murare una zona specifica (lungolinea o diagonale)'],
      ['Azione', 'Angola le mani verso la zona che vuoi proteggere'],
      ['Tattica', 'Costringi l\'attaccante a schiacciare in una zona dove i tuoi difensori sono pronti'],
      ['Quando', 'In accordo con la difesa di seconda linea'],
    ],
  },
  {
    name: 'Il muro a 2 o 3 (muro collettivo)',
    objectif: 'Creare un muro impenetrabile',
    points: [
      ['Coordinazione', 'Saltare insieme nello stesso momento'],
      ['Posizionamento', 'I muratori esterni si posizionano rispetto al centrale'],
      ['Mani', 'Unisci le mani con i compagni (nessun buco)'],
      ['Comunicazione', 'Un muratore chiama "linea" o "diagonale" per coordinarsi'],
    ],
  },
];

const TIMING_TIPS = [
  ['Esercizio "uno-due"', `In allenamento, di' "UNO" quando l'attaccante salta, "DUE" quando salti tu. Crea il ritardo necessario.`],
  ['Guarda le spalle', "L'orientamento delle spalle dell'attaccante indica la direzione della schiacciata."],
  ['Leggi l\'alzata', "Un'alzata alta = più tempo. Un'alzata tirata = reazione rapida."],
  ['Posizionati presto', 'Meglio essere fermi in attesa che correre all\'ultimo momento.'],
  ['Lavora sull\'elevazione', "Più salti in alto, più margine d'errore hai sul timing."],
];

const SAUT_POSITION = [
  'Piedi alla larghezza delle spalle',
  'Peso sugli avampiedi',
  'Ginocchia leggermente piegate',
  'Braccia lungo i fianchi o leggermente davanti',
  'Posizione a circa 30-50 cm dalla rete',
];

const SAUT_IMPULSION = [
  ['Passo accostato', 'Se devi spostarti, usa un passo accostato rapido'],
  ['Caricamento', 'Piega rapidamente le gambe (non scendere troppo)'],
  ['Slancio delle braccia', "Slancia le braccia verso l'alto in modo esplosivo"],
  ['Estensione completa', "Estendi completamente le gambe per massimizzare l'altezza"],
];

const SAUT_EN_LAIR = [
  'Mantieni le braccia distese e contratte',
  'Mani ben aperte, dita estese e divaricate',
  'Penetra oltre la rete (niente tocco di rete!)',
  'Contrai il core per restare stabile',
];

const ERREURS = [
  ['Saltare troppo presto', "Scendi quando l'attaccante schiaccia — aspetta di più!"],
  ['Guardare la palla', "Perdi informazioni sull'attaccante — guarda il giocatore!"],
  ['Mani molli', 'La palla rimbalza nel tuo campo — irrigidisci e blocca le dita!'],
  ['Saltare in avanti', 'Tocchi la rete — salta verticale!'],
  ['Abbassare le braccia troppo presto', 'Tieni le braccia in alto fino all\'atterraggio.'],
];

const EXERCICES = [
  {
    title: 'Timing con un compagno',
    desc: 'Un compagno finge di attaccare (senza palla). Lavora solo sul timing del salto. Ripeti 20 volte.',
  },
  {
    title: 'Muro su attacco fisso',
    desc: 'Un attaccante schiaccia da una posizione fissa. Concentrati su timing e tecnica. Aumenta gradualmente la velocità.',
  },
  {
    title: 'Lettura delle spalle',
    desc: 'L\'attaccante varia le schiacciate (lungolinea/diagonale). Prova a leggere le sue spalle per anticipare la direzione.',
  },
  {
    title: 'Spostamenti + muro',
    desc: 'Lavora su uno spostamento laterale rapido seguito da un muro. Simula situazioni di partita.',
  },
];

const CONSEILS_PRO = [
  ['Pazienza', 'Il muro è una delle tecniche più difficili. Sii paziente con te stesso.'],
  ['Ripetizione', 'La memoria muscolare si costruisce con centinaia di ripetizioni.'],
  ['Video', 'Filmati per analizzare il tuo timing e la tua tecnica.'],
  ['Guarda i professionisti', 'Osserva come i giocatori professionisti leggono il gioco e cronometrano i salti.'],
  ['Inizia semplice', 'Padroneggia il muro contro attacchi lenti prima di passare agli attacchi rapidi.'],
];

export default function GuideContreIt() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="PALLA → ALZATORE → PALLA → SPALLA DELL'ATTACCANTE → SALTO → PENETRAZIONE OLTRE LA RETE">
        Con la pratica regolare e un'attenzione particolare al timing, migliorerai significativamente i tuoi muri. Un muro ben cronometrato con elevazione media è meglio di un salto altissimo ma mal cronometrato.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>I fondamentali del muro</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Il muro è un'azione difensiva cruciale che può diventare un'arma offensiva.
            La chiave sta nel <strong style={{ color: 'var(--orange)' }}>timing perfetto</strong> e in una buona lettura del gioco.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing: la chiave del successo</h2>
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
        <h2 style={S.section}>I diversi tipi di muro</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Obiettivo: </span>
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
        <h2 style={S.section}>Consigli per migliorare il timing</h2>
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
        <h2 style={S.section}>Sequenza visiva d'élite</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>I migliori muratori non guardano la palla — seguono una sequenza precisa:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['PALLA', 'ALZATORE', 'PALLA', "SPALLA DELL'ATTACCANTE"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. PALLA', 'Vedi la palla viaggiare verso l\'alzatore'],
              ['2. ALZATORE', "Leggi le mani dell'alzatore al momento del contatto — direzione dell'alzata"],
              ['3. PALLA', 'Segui brevemente la palla per confermare la direzione'],
              ['4. SPALLA DELL\'ATTACCANTE', "Aggancia la spalla dell'attaccante — rivela la direzione della schiacciata prima del contatto"],
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
        <h2 style={S.section}>Timing preciso per tipo di attacco</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo di attacco</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Timing salto del muratore</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1° tempo (centrale)', 'CON o un attimo prima dell\'attaccante (commit block)'],
                ['Shoot / 2° tempo banda', '~0,1s dopo l\'attaccante'],
                ['Palla alta banda (3° tempo)', '0,2-0,3s dopo l\'attaccante'],
                ['Alzata tirata sotto rete', 'CON l\'attaccante'],
                ['Alzata staccata dalla rete', '~0,5s dopo, oppure non saltare'],
                ['Slide (centrale)', 'CON o subito dopo — segui lateralmente'],
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
            <div style={S.label}>Read blocking — consigliato</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>Il muratore aspetta la decisione dell'alzatore, legge la palla e l'attaccante, poi si sposta. Posizione "bunch read" (tutti vicini al centro, poi esplodono verso l'antenna).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Stabile e presente sulla maggior parte delle alzate', 'Preserva anche e ginocchia', 'Adatto a tutti i livelli amatoriali'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — avanzato/pro</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>Il centrale decide PRIMA che l'alzatore liberi la palla di saltare con il quick. Spegne l'attacco rapido avversario, ma se l'alzatore alza altrove, il centrale è completamente fuori dal gioco.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Efficace contro centrali dominanti', 'Alto rischio se l\'alzatore si adatta', 'Riservato a giocatori con eccellente lettura'].map((pt, i) => (
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
        <h2 style={S.section}>Tecnica di salto per il muro</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Posizione di partenza', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'Lo stacco', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'In aria', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
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
        <h2 style={S.section}>Errori comuni da evitare</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Errori comuni</div>
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
        <h2 style={S.section}>Esercizi di allenamento</h2>
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
        <h2 style={S.section}>Consigli da professionisti</h2>
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
        <h2 style={S.section}>Risorse video</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Imparare a murare (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'Il muro nella pallavolo (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Esercizio: saltare per murare', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Esercizio: murare un attacco', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
