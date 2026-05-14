import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Principiante': 'var(--mint)',
  'Intermedio': 'var(--yellow)',
  'Avanzato': 'var(--orange)',
  'Agonistico': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Agonistico': '#fff',
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
    name: 'Servizio dal basso',
    level: 'Principiante',
    tagline: 'dal basso — movimento a pendolo sotto la cintura',
    description: "Movimento pendolare del braccio che colpisce la palla sotto la cintura. Consentito a tutti i livelli, consigliato per i principianti o in caso di infortunio alla spalla. Quasi inesistente oltre il livello regionale adulti.",
    biomechanics: [
      'Catena cinetica corta: anche → spalla → braccio → mano',
      'Movimento a pendolo senza rotazione del tronco',
      'Trasferimento del peso: piede posteriore → piede anteriore',
      'Contatto: tallone della mano o pugno chiuso sotto il centro della palla',
    ],
    steps: [
      'Piede sinistro avanti, peso sulla gamba posteriore',
      "La mano sinistra tiene la palla all'altezza dell'anca in linea con il braccio che colpisce",
      'Braccio destro caricato indietro, palmo aperto o pugno chiuso',
      'Rilascia la palla appena prima del contatto — non lanciarla',
      "Movimento in avanti, colpisci sotto il centro della palla",
      'Il braccio completa il movimento e punta al bersaglio, peso trasferito sul piede anteriore',
    ],
    errors: [
      ['Palla tenuta troppo bassa o decentrata', "Tieni la palla all'altezza dell'anca, in linea con il braccio che colpisce"],
      ['Colpire con le dita', 'Usa il tallone della mano — superficie più ampia e stabile'],
      ['Lancio troppo alto', "Rilascia semplicemente la palla, non lanciarla verso l'alto"],
      ['Polso molle', 'Blocca il braccio al contatto per un impatto pulito'],
    ],
    exercises: [
      'Bowling-cerchi: mirare a zone a 4 m dalla rete',
      "10 servizi a 4 m poi indietreggia di 1 m a serie fino alla linea di fondo",
      'Bersagli 4x3 m sul pavimento — obiettivo 50% di precisione',
    ],
    videos: [
      { title: 'Servizio dal basso + servizio tennis (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Come servire dal basso', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Servizio float da fermo',
    level: 'Intermedio',
    tagline: 'float da fermo — servizio standard del 90% degli amatori',
    description: `Servizio senza rotazione che produce una traiettoria imprevedibile (effetto "knuckleball"). A una velocità critica (~12-13 m/s), vortici asimmetrici creano forze laterali casuali. È il servizio da padroneggiare per primo.`,
    biomechanics: [
      'Catena cinetica completa: gambe → anche → tronco → spalla → gomito → mano',
      `Posizione "arco e freccia": gomito alto sopra la spalla, mano dietro l'orecchio`,
      "Polso BLOCCATO e fermo — requisito assoluto per l'effetto float",
      'Contatto: tallone della mano al centro della palla',
      `"Punch and freeze": accompagnamento CORTO — la mano si ferma subito dopo il contatto`,
    ],
    steps: [
      "Corpo a 45° rispetto alla rete, piedi alla larghezza delle spalle",
      "Braccio sinistro disteso davanti alla spalla, palla all'altezza della testa",
      `Lancio molto corto: "appoggia" la palla 30-50 cm sopra la spalla — la palla non ruota`,
      'Il piede sinistro avanza verso il bersaglio subito dopo aver posato la palla',
      'Estensione completa del braccio al contatto, mano ferma e piatta',
      'FREEZE: arresto immediato del movimento dopo il contatto — nessun accompagnamento del braccio',
    ],
    errors: [
      ['Accompagnamento prolungato del braccio', "Causa di fallimento #1: l'accompagnamento aggiunge rotazione che uccide il float — fermati immediatamente"],
      ['Lancio troppo alto', 'La palla cade in rete — lancio corto, solo 30-50 cm'],
      ['Lancio rotante', 'Induce rotazione sulla palla — appoggia la palla, non lanciarla'],
      ['Contatto solo con il palmo', 'Usa il tallone della mano (parte bassa del palmo) per una superficie piatta'],
    ],
    exercises: [
      'Toss & Drop: segna un punto a terra, lancia 20 volte senza colpire — obiettivo 18/20 sul punto',
      `"Punch and freeze" al muro a 3 m: lavora sull'arresto immediato del movimento`,
      '5 servizi consecutivi senza rotazione validati visivamente da un compagno',
    ],
    videos: [
      { title: 'Servizio float in 4 minuti', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Migliorare il servizio float', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Servizio: float + tennis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Servizio jump float',
    level: 'Avanzato',
    tagline: "jump float — standard delle giocatrici d'élite",
    description: "Float con una breve rincorsa e salto. Guadagna in altezza di contatto, velocità e angolo di discesa più ripido. È diventato lo standard tra le giocatrici d'élite (86% dei servizi nella pallavolo femminile professionistica secondo studi recenti). Meno rischioso del jump topspin pur essendo più disturbante del float da fermo.",
    biomechanics: [
      "Rincorsa breve (da 2 a 4 passi)",
      'Braccia in posizione arco e freccia durante il salto — diverso da una schiacciata in cui le braccia spingono',
      "La rincorsa fornisce la velocità della palla, non il solo braccio",
      'Contatto al punto più alto leggermente davanti alla testa',
      'Polso bloccato + freeze identico al float da fermo',
    ],
    steps: [
      'Posizione 2-3 m dietro la linea, palla nella mano sinistra',
      "Passo 1 (destro) come avvio, braccia rilassate",
      'Passo 2 (sinistro): lancia la palla a circa 1,5 m di altezza, senza rotazione',
      'Passo 3 + balzo: stacco a piedi pari dietro la linea — le braccia salgono in arco e freccia',
      "Salto verticale leggermente in avanti, corpo compatto",
      'Colpisci con il braccio disteso, tallone della mano al centro della palla',
      'FREEZE immediato — atterra dentro il campo',
    ],
    errors: [
      ['Lancio troppo alto', 'Riflesso di rotazione in salto — mantieni il lancio corto come per il float da fermo'],
      ["Braccia che oscillano come in attacco", 'Diventa una schiacciata con rotazione — mantieni la posizione arco e freccia'],
      ['Accompagnamento prolungato', 'Come per il float da fermo: il freeze è obbligatorio'],
      ['Fallo di piede allo stacco', "Assicurati che lo stacco avvenga dietro la linea di fondo"],
    ],
    exercises: [
      "Padroneggia il float da fermo (freeze solido) prima di aggiungere la rincorsa",
      'Solo rincorsa senza colpire: lavora su un lancio stabile e basso',
      'Jump float a velocità controllata: continuità prima della potenza',
    ],
    videos: [
      { title: "Servizio jump float — INF'AUX ENTRAÎNEURS (Bretagne)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + schiacciata (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Servizio jump topspin',
    level: 'Agonistico',
    tagline: 'jump serve — schiacciata da dietro la linea',
    description: `"Schiacciata da dietro la linea": palla colpita a piena velocità con topspin (80-95 km/h nei club forti). Massimo potenziale di ace ma anche il più alto tasso di errore. Riservato a chi ha investito 1000+ ripetizioni in allenamento.`,
    biomechanics: [
      "Rincorsa di 3-4 passi identica a un attacco dalla seconda linea",
      'Lancio alto (1-1,5 m davanti a te) con una leggera rotazione in avanti indotta',
      'Rotazione sequenziale: anche → tronco → spalla → gomito → polso',
      'Zona di contatto alle ore 10-11 sulla palla',
      "Frustata completa del polso per il topspin (~30 rotazioni/s a livello d'élite)",
      'Accompagnamento completo — opposto del float',
    ],
    steps: [
      'Posizione 3-4 m dietro la linea, palla nella mano che colpisce',
      'Passo 1 (destro) + lancio alto con un leggero topspin indotto',
      'Passo 2 (sinistro): accelerazione',
      "Passo 3 (destro): passo di potenza lungo, abbassamento del baricentro",
      "Passo 4 (sinistro): stacco, le braccia oscillano verso l'alto",
      'Salto verticale-in avanti esplosivo',
      "Colpo al culmine: la mano passa sopra la palla (ore 10), palmo poi dita che rotolano sopra",
      'Frustata completa del polso + accompagnamento — atterra 1-2 m dentro il campo',
    ],
    errors: [
      ['Lancio troppo basso o dietro di te', 'Causa #1 di colpire la rete — il lancio deve essere alto e davanti'],
      ['Lancio troppo avanti', 'Fallo di piede — rispetta i limiti della zona di servizio'],
      ['Mancanza di frustata del polso', 'La palla vola lunga senza rotazione verso il basso'],
      ['Usarlo in partita senza preparazione', "Prima 1000 ripetizioni in allenamento — regola d'oro"],
    ],
    exercises: [
      "Regola d'oro: 1000 ripetizioni in allenamento prima di usarlo in partita",
      'Jump spin "controllato": lancio più basso, velocità ridotta per mirare a zone precise',
      "Filma il tuo lancio: l'80% degli errori viene dal posizionamento del lancio",
    ],
    videos: [
      { title: 'Jump topspin potente + servizio float (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Zona 1 — fondo destra', "Blocca l'uscita dell'alzatore in un sistema 5-1"],
  ['Zona 2 — corta avanti destra', "Spezza l'uscita laterale destra, esclude il libero"],
  ['Zona 3 — corta avanti centro', 'Blocca il centrale, spezza gli attacchi rapidi'],
  ['Zona 4 — corta avanti sinistra', "Costringe l'attaccante principale a ricevere E attaccare"],
  ['Zona 5 — fondo profonda sinistra', "Diagonale lunga, alto tasso di errore"],
  ['Zona 6 — fondo profonda centro', 'Servizio lungo contro alzatori più bassi'],
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

export default function GuideServiceIt() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        L'80% degli errori al servizio viene dal lancio. Stabilizza il lancio come priorità prima di cercare la potenza.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>TIPI DI SERVIZIO</h2>
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
            <div style={S.labelTeal}>BIOMECCANICA CHIAVE</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>FASI DI ESECUZIONE (DESTRIMANE)</div>
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
              <div style={S.labelOrange}>✗ ERRORI COMUNI</div>
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
              <div style={S.labelTeal}>★ ESERCIZI</div>
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
            <div style={{ ...S.label, opacity: 0.6 }}>VIDEO — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>ZONE BERSAGLIO E TATTICHE</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>ZONA AVVERSARIA</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>EFFETTO TATTICO</th>
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
            ['Cuciture', "Mirare allo spazio tra due ricevitori è più efficace che mirare a un giocatore — la comunicazione dell'avversario viene messa alla prova."],
            ['Alternare corto/lungo', "Impedisce all'alzatore di sapere quando arretrare. Un float corto (zone 2-3-4) dietro la linea d'attacco è particolarmente disturbante."],
            ['Metrica FBSO%', "Un servizio che riduce il First Ball Side Out avversario dal 70% al 45% senza produrre un ace è un servizio molto efficace."],
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
          <div style={{ ...S.label, marginBottom: 16 }}>★ GERARCHIA DI APPRENDIMENTO</div>
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
            Padroneggia ogni livello prima di passare al successivo. <strong>Continuità prima della potenza.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
