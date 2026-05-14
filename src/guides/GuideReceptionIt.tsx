import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'La superficie di contatto ideale si trova tra 2,5 e 15 cm sopra i polsi.'],
  ['Cup and fold', "Tecnica consigliata: un pugno chiuso, l'altra mano che lo avvolge sopra — pollici paralleli, rivolti verso il basso."],
  ['Pollici in giù', 'Puntare i pollici verso terra ruota gli avambracci verso l\'esterno e irrigidisce il piano di rimbalzo.'],
  ['Mai intrecciare', 'MAI intrecciare le dita su un servizio potente — rischio di frattura.'],
  ["L'angolo dirige la palla", '"La palla va dove guarda il piano di rimbalzo" — per una ricezione profonda: piano a 45°; per una ricezione corta: piano più parallelo al pavimento.'],
];

const STEPS = [
  'Leggere il battitore: identificare il tipo di servizio prima del contatto.',
  "Posizione di attesa con braccia separate (NON unite in anticipo).",
  "Leggere la traiettoria nell'istante in cui l'avversario colpisce la palla.",
  'Spostarsi (passi accostati), arrivare DIETRO la palla prima che le braccia si uniscano.',
  "Costruire il piano in anticipo: unisci le mani quando la palla arriva, non troppo presto.",
  'FREEZE: fermati appena prima del contatto, peso sul piede anteriore — tieni per 1-2 secondi.',
  "Contatto sul sweet spot, spalle orientate verso l'alzatore bersaglio.",
  "Accompagnamento: anche e spalle si muovono in avanti verso il bersaglio — nessuna oscillazione delle braccia.",
];

const DISPLACEMENTS = [
  {
    name: 'Laterale (passi accostati)',
    desc: 'Il piede dal lato della palla parte per primo. Passi accostati senza incrociare, anche basse. Arriva dietro la palla, riorientati verso il bersaglio, freeze + piano di rimbalzo all\'ultimo momento. Per lunghe distanze: passi incrociati poi perno.',
  },
  {
    name: 'In avanti (palla corta)',
    desc: 'Per servizi corti o pallonetti. Termina spesso in un affondo in avanti: ginocchio che si abbassa verso terra, piano di rimbalzo posto davanti al ginocchio guida.',
  },
  {
    name: 'Indietro (drop step)',
    desc: "Perno sul piede poi passi accostati indietro. MAI correre all'indietro (perdita di equilibrio). Se è troppo tardi per arretrare: perno e crea un piano di rimbalzo laterale.",
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
      name: 'Sistema a W — 5 ricevitori',
      level: 'Principiante',
      desc: '3 giocatori in prima linea, 2 in seconda — tutti tranne l\'alzatore partecipano. Forma storica che dà il nome alla "W-formation" (FIVB, USAV IMPACT).',
      pros: ['Zone ridotte per giocatore (~1,8 m di corridoio)', 'Poca comunicazione richiesta', 'Ideale per scuola di pallavolo e U13-U15'],
      cons: ['Molte zone di sovrapposizione tra 5 giocatori', 'Ricevitori deboli costretti a partecipare', 'Disorganizza gli attaccanti (3 giocatori di prima linea in ricezione)'],
    },
    {
      name: 'Sistema a U — 3 ricevitori',
      level: 'Standard moderno',
      desc: "Libero in zona 6 (il bersaglio principale dei battitori), schiacciatori in zone 5 e 1. I 3 migliori ricevitori prendono ogni palla, tutti gli attaccanti di prima linea escono dalla ricezione.",
      pros: ['Comunicazione semplificata a 3 giocatori', 'I 3 migliori ricevitori coprono tutto', 'Attaccanti di prima linea liberi per la loro rincorsa'],
      cons: ['Zone laterali più ampie da coprire (~3 m per giocatore)', 'Richiede un libero di alto livello', 'Vulnerabile a servizi corti negli angoli'],
      recommended: true,
    },
    {
      name: 'Ricezione a 2 — libero + S4',
      level: 'Élite',
      desc: "Solo 2 ricevitori (libero + un S4 selezionato) coprono tutta la larghezza. Usato ai massimi livelli per liberare il 2° S4 e tenerlo fresco per l'attacco senza la stanchezza della ricezione.",
      pros: ["Tutti gli attaccanti disponibili per la transizione offensiva", 'Miglior muro/attacco perché gli attaccanti non sono logorati dalla ricezione', 'Sistema preferito dalle squadre pro (Polonia, Francia, Italia)'],
      cons: ['Richiede 2 ricevitori molto atletici (~4,5 m di corridoio ciascuno)', "Nessun margine d'errore — un servizio letto male = punto avversario", 'Inutilizzabile senza un libero di livello internazionale'],
    },
  ],
  5: [
    {
      name: 'Ricezione a 3 — schema 2F-3B',
      level: 'Consigliato',
      desc: "I 3 giocatori di seconda linea (P5, P6, P1) ricevono. L'alzatore in P1 esce dalla ricezione e penetra nell'istante in cui il battitore tocca la palla, esattamente come nel 5-1 6v6. I 2 giocatori di prima linea (P4, P3) sono liberi per la rincorsa.",
      pros: ['Schema più vicino al 5-1 6v6 (pedagogicamente ideale)', 'Buona transizione ricezione → attacco', '2 attaccanti di prima linea + pipe dalla seconda linea possibile'],
      cons: ['3 ricevitori su 9 m (~3 m per giocatore)', "L'alzatore deve leggere veloce e decidere di penetrare in < 1 secondo", "Buco in P1 se l'alzatore parte troppo presto"],
      recommended: true,
    },
    {
      name: 'Ricezione a 4 — schema 3F-2B',
      level: 'Standard',
      desc: "I 2 giocatori di seconda linea (P5, P1) + 2 di prima linea (tipicamente P4 e P3 — l'alzatore in P2 esce) ricevono. L'alzatore resta al bersaglio: nessuna penetrazione, distribuzione immediata.",
      pros: ['Zone ridotte (~2,25 m per giocatore)', 'Ideale per squadre miste o principianti', 'Alzatore già al bersaglio — nessuna transizione'],
      cons: ['Solo 2 attaccanti disponibili davanti (P4 + P3 o P4 + centrale)', 'I giocatori di prima linea che ricevono devono poi fare la rincorsa', "Muro a 2 difficile perché l'alzatore va a rete"],
    },
    {
      name: 'Ricezione a pentagono — 4 o 5 giocatori',
      level: 'Principiante / amatoriale',
      desc: '5 ricevitori (equivalente della W a 5 giocatori). 1 giocatore al centro rete (spesso un alzatore designato), i 2 schiacciatori in mezzo, i 2 di seconda linea nella zona profonda. Tutti partecipano a meno che il giocatore centrale non sia un alzatore designato.',
      pros: ['Copertura del campo uniforme', 'Esigenza tecnica molto bassa', 'Adatto a sessioni introduttive'],
      cons: ['Molte sovrapposizioni con 5 ricevitori', 'Nessun attaccante è liberato', 'Inefficace appena il livello sale'],
    },
  ],
  4: [
    {
      name: 'Diamante (3 ricevitori)',
      level: 'Standard 4v4',
      desc: "Alzatore al centro rete (P3, fuori dalla ricezione). I 2 schiacciatori (P4, P2) a metà campo + l'unico giocatore di seconda linea (P1) in zona profonda ricevono. La formazione più comune nel 4v4 indoor (intramurali universitari).",
      pros: ['Alzatore già al bersaglio — nessuna penetrazione', '3 zone chiare e simmetriche', 'Ideale per intramurali, gioco amatoriale, beach 4'],
      cons: ['Coprire 9 m di larghezza con 3 = ~3 m per giocatore', "L'unico giocatore di seconda linea deve difendere tutta la zona profonda dopo la ricezione", 'Solo 2 attaccanti davanti'],
      recommended: true,
    },
    {
      name: 'Linea 3-1 (3 ricevitori)',
      level: 'Intermedio',
      desc: "Unico alzatore in P1 (seconda linea) che penetra nell'istante in cui il servizio avversario è colpito verso la zona 2. I 3 attaccanti di prima linea (P4, P3, P2) ricevono. Equivalente semplificato del 5-1 6v6.",
      pros: ['3 attaccanti davanti in ogni momento', 'Pedagogia utile per preparare il 5-1 6v6', "L'alzatore può anche attaccare dopo aver distribuito"],
      cons: ['Richiede una ricezione molto pulita (la penetrazione non perdona)', "Buco in P1 se l'alzatore parte prima che la palla sia difesa", 'Ogni attaccante deve saper ricevere'],
    },
    {
      name: 'Box 2-2 (4 ricevitori)',
      level: 'Principiante',
      desc: "2 giocatori di prima linea (P4, P2) + 2 di seconda linea (P5, P1), nessun alzatore designato a rete. Il giocatore meglio posizionato prende il 2° tocco. Tipico delle sessioni introduttive o U11-U13.",
      pros: ["Copre tutto il campo (4 zone di 2,25 m)", "Nessuna esigenza tecnica sull'alzatore", 'Tutti ricevono — molto didattico'],
      cons: ['Nessun alzatore designato — distribuzione casuale', 'Nessun attaccante è liberato per la rincorsa', 'Inefficace appena il livello sale'],
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
      title: 'Alzatore di SECONDA LINEA (P1 / P6 / P5) — rotazioni P1, P6, P5 del 5-1',
      bullets: [
        'Esce dalla ricezione: nessuna palla è destinata a lui.',
        'Parte in una posizione speciale (es. P1: ~7,5 m dalla rete, 1 m dalla linea laterale), nascosto dietro un altro giocatore (stack).',
        "Penetra verso il bersaglio (tra Z2 e Z3, ~1 m dalla rete, 3 m a destra del centro) NELL'ISTANTE IN CUI L'AVVERSARIO TOCCA IL SERVIZIO — non prima (fallo di sovrapposizione).",
        'P1: penetrazione più corta; P6: penetrazione centrale; P5: penetrazione più lunga (diagonale).',
        '3 attaccanti davanti disponibili (S4 + centrale + opposto) + attacchi dalla seconda linea.',
      ],
    },
    {
      title: 'Alzatore di PRIMA LINEA (P2 / P3 / P4) — rotazioni P2, P3, P4 del 5-1',
      bullets: [
        'Esce dalla ricezione: è già vicino al bersaglio.',
        "In P2: già al bersaglio — diventa anche muro di linea contro l'S4 avversario da Z4 (doppio carico difensivo).",
        'In P3: switch laterale verso il bersaglio subito dopo il tocco del servizio.',
        'In P4: attraversa tutta la rete per raggiungere il bersaglio (il più lungo spostamento di prima linea).',
        "Solo 2 attaccanti davanti (compensati da una pipe in P6 e un attacco da seconda linea dell'opposto in P1).",
      ],
    },
  ],
  5: [
    {
      title: 'Alzatore PENETRANTE (schema 2F-3B, consigliato)',
      bullets: [
        'Parte in P1 seconda linea, esce dalla ricezione.',
        "Penetra verso il bersaglio (Z2/Z3, ~1 m dalla rete) NELL'ISTANTE in cui il servizio avversario è toccato — identico al 5-1 6v6.",
        'I 3 giocatori di seconda linea (P5 + P6 + P1 che esce) coprono la ricezione a 3.',
        'Deve aspettare che la palla sia difesa prima di partire (errore comune: partenza anticipata → buco in P1).',
      ],
      note: 'Schema più vicino al 6v6 — consigliato per preparare la transizione.',
    },
    {
      title: 'Alzatore FISSO DI PRIMA LINEA (schema 3F-2B o pentagono)',
      bullets: [
        'Resta al bersaglio (P2 o P3 secondo lo schema): nessuna penetrazione.',
        'Esce dalla ricezione: nessuna palla è destinata a lui.',
        "Distribuzione immediata appena arriva il bagher — nessuna transizione.",
        "In P2: diventa anche muro di linea contro lo schiacciatore avversario (come nel 5-1 6v6).",
      ],
    },
  ],
  4: [
    {
      title: 'Alzatore di PRIMA LINEA in diamante (P3 centro rete)',
      bullets: [
        'Resta al bersaglio (Z3, ~1 m dalla rete): nessuna penetrazione.',
        'Esce dalla ricezione: gli altri 3 (2 schiacciatori + 1 di seconda linea) ricevono.',
        'Distribuzione rapida verso Z4 o Z2 a seconda della qualità del bagher.',
        "La sua transizione difesa → alzata deve essere eseguita in meno di 2 secondi (solo 1 giocatore di seconda linea = molta copertura).",
      ],
      note: 'Formazione più usata nel 4v4 indoor.',
    },
    {
      title: 'Alzatore PENETRANTE in linea 3-1 (P1 seconda linea)',
      bullets: [
        'Parte in P1 seconda linea, esce dalla ricezione.',
        "Penetra verso la zona 2 nell'istante in cui il servizio avversario è toccato.",
        'I 3 attaccanti di prima linea (P4, P3, P2) ricevono.',
        "Richiede una ricezione molto pulita — altrimenti l'alzatore non arriva al bersaglio in tempo.",
      ],
    },
    {
      title: 'Nessun alzatore designato (box 2-2)',
      bullets: [
        'Il giocatore meglio posizionato dopo il 1° tocco prende il 2° tocco.',
        'Tutti ricevono — 4 zone di ~2,25 m.',
        'Distribuzione casuale verso uno dei 3 altri giocatori.',
        'Da riservare a sessioni introduttive (U11-U13, scuola).',
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
    title: 'Il libero — fulcro della ricezione nel 6v6',
    text: 'Specialista difensivo con maglia di colore contrastante. Sostituisce sistematicamente i centrali quando ruotano in seconda linea (sostituzioni illimitate, non conteggiate secondo la Regola 19 FIVB). Gioca 3 rotazioni consecutive in Z5-Z6-Z1. Posizione di ricezione preferita: Z6 (il bersaglio principale dei battitori) o Z5. Restrizioni FIVB: niente muro, niente attacco sopra la rete, niente alzata di palleggio davanti alla linea dei 3 m se un compagno attacca poi sopra la rete.',
    accent: 'orange',
  },
  5: {
    title: 'Nessun libero ufficiale nel 5v5',
    text: 'Il 5v5 indoor non ha regolamento FIVB. In pratica, nessuna federazione consente un libero in questo formato. Il miglior ricevitore viene piazzato in P6 o P5 e gioca sistematicamente in seconda linea — diventa il "libero di fatto" senza la maglia contrastante né le restrizioni. Può quindi murare e attaccare se necessario.',
    accent: 'teal',
  },
  4: {
    title: 'Nessun libero nel 4v4',
    text: "Nessun libero è ammesso secondo i regolamenti 4v4 (intramurali universitari, gioco didattico FFVb, beach 4). L'unico giocatore di seconda linea in diamante — o l'alzatore penetrante in linea 3-1 — assume il ruolo di miglior ricevitore/difensore. Con ~3 m di corridoio per ricevitore in diamante, l'anticipazione conta più della tecnica.",
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Dal basso', 'Postura normale, prendere la palla alta'],
  ['Float da fermo', "Postura alta, fare un passo avanti per prenderla presto prima che devii"],
  ['Topspin', 'Postura bassa, pronti ad arretrare, piano di rimbalzo angolato'],
  ['Jump float', 'Può essere giocato di palleggio a 4 m dalla rete'],
  ['Jump topspin', 'Postura bassa, arretramento anticipato, piano di rimbalzo rigido e passivo'],
  ['Servizio ibrido', 'Piano di rimbalzo pronto per entrambi gli scenari (float o topspin)'],
];

const READING_CUES = [
  "Posizione del battitore sulla linea → angolo preferito",
  'Altezza e posizionamento del lancio: alto+dietro → topspin; basso+davanti → float',
  "Lunghezza della rincorsa: lunga → jump topspin; corta → jump float",
  "Direzione delle spalle del battitore al contatto → direzione della palla",
];

const ERRORS_COMMON: [string, string][] = [
  ['Braccia che oscillano', 'Causa #1 — braccia che oscillano al contatto, palla imprevedibile. Soluzione: "il piano di rimbalzo è passivo, le gambe sono attive".'],
  ['Piano di rimbalzo rotto', "Un avambraccio più alto dell'altro — blocca i gomiti e spingi i pollici in giù."],
  ['Braccia unite troppo presto', "Rallenta il movimento e impedisce la scelta tardiva bagher/palleggio. Unisci le mani solo all'arrivo."],
  ['Tronco troppo eretto', "Il piano passa sotto la palla → la palla finisce troppo lontana dalla rete. Inclinati 30-45° in avanti."],
  ["Contatto sopra l'ombelico", 'Troppo alto = controllo ridotto. Mira al contatto all\'altezza della vita o più basso.'],
  ['Nessun freeze', "Ancora in movimento al contatto = impossibile controllare la direzione. Fermati completamente."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Libero mal posizionato', 'Troppo centrale perde i servizi corti negli angoli; troppo laterale abbandona il centro. Bersaglio di riferimento: Z6 allineato con il battitore avversario.'],
    ['Sovrapposizione alzatore', "L'alzatore lascia la sua posizione prima che l'avversario tocchi il servizio — fallo #1 nel 5-1 (Regola FIVB 7.4). I suoi piedi devono rispettare le relazioni davanti/dietro fino al contatto."],
    ['Ricezione a 5 senza ruoli chiari', "In una W, i 3 giocatori di prima linea interferiscono nella zona centrale. Definisci esplicitamente chi prende la palla tra P3 e P6 sui servizi al centro."],
  ],
  5: [
    ["Alzatore che parte troppo presto", "Nello schema 2F-3B con alzatore penetrante, partire prima che la palla sia difesa = buco in P1. Aspetta la conferma."],
    ['2 ricevitori fianco a fianco', 'Nello schema 3F-2B, P5 e P1 devono essere distanziati (uno per lato). Centrati insieme = linee laterali esposte.'],
    ["Ricevitore di prima linea che dimentica di attaccare", "Nello schema 3F-2B, il giocatore di prima linea che riceve deve poi fare la sua rincorsa d'attacco — un riflesso da allenare specificamente."],
    ['Nessun libero di fatto definito', 'Senza un ruolo chiaro, i 3 giocatori di seconda linea si rimbalzano la responsabilità. Designa esplicitamente il miglior ricevitore come priorità nella zona centrale.'],
  ],
  4: [
    ['Alzatore in diamante che riceve', "In un diamante, l'alzatore in P3 deve USCIRE dalla ricezione — altrimenti distribuire velocemente è impossibile. Gli altri 3 ricevono."],
    ['Unico giocatore di seconda linea sovraccarico', 'In un diamante, il P1 di seconda linea copre da solo ~3,5 m di campo profondo. Anticipazione = abilità #1; passi accostati costanti e lettura anticipata.'],
    ["Box 2-2 senza chiamata al 2° tocco", "Senza un alzatore designato, chi alza? Gridare \"MIA!\" al 2° tocco appena avvenuta la ricezione è non negoziabile."],
    ['Schiacciatori in diamante in linea retta', 'P4 e P2 a metà campo allo stesso livello di P1 → il colpo corto in mezzo cade tra di loro. Scaglionare le posizioni.'],
  ],
};

const VIDEOS = [
  { title: 'Come fare bagher (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'Il bagher (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: "Bagher controllato verso l'alzatore", url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Imparare ricezione alta e bassa (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Riscaldamento individuale di bagher', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionIt() {
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
        Il bagher determina il 60% del successo offensivo di una squadra. Senza una buona ricezione, niente attacchi rapidi. Il piano di rimbalzo è passivo — le gambe sono attive.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Formato di gioco</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          I <strong>sistemi di ricezione</strong>, il <strong>ruolo dell'alzatore</strong> e gli <strong>errori comuni</strong> qui sotto si adattano al formato scelto.
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
        <h2 style={S.section}>Posizione di attesa</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Piedi leggermente più larghi delle spalle, un piede leggermente avanti',
              "Ginocchia flesse verso l'interno dei piedi, anche basse, tronco inclinato 30-45°",
              'Schiena dritta, peso sugli avampiedi (talloni leggermente sollevati ma non staccati)',
              'Braccia SEPARATE (non unite), flesse a 90-145°, all\'altezza della vita',
              'Occhi sul battitore dal momento del lancio',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Errore principale: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>avere le braccia già unite a formare un piano prima che la palla arrivi — questo rallenta il movimento e impedisce la scelta tardiva bagher/palleggio.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Il piano di rimbalzo</h2>
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
        <h2 style={S.section}>Esecuzione — fasi chiave</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>Il freeze: </strong>
          "Posa per una foto" — diventa completamente immobile per 1-2 secondi dopo il contatto. A 50-90 km/h, un difensore in movimento non riesce ad aggiustare il proprio angolo. Fermo, può muoversi in qualsiasi direzione.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Spostamenti</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Bagher a un braccio — emergenza</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Una mossa di ultima istanza quando la palla è troppo lontana per entrambe le braccia. Braccio disteso, piano piatto sull'avambraccio interno, nessuna oscillazione — solo una stoccata per deviare la palla verso l'alto. Varianti: stab a un braccio (pugno su una schiacciata potente), scoop a un braccio (palmo aperto rivolto verso l'alto, palla bassa).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Sistemi di ricezione — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Formato non ufficiale FIVB</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "Il 5v5 indoor non ha un regolamento FIVB o FFVb dedicato. I sistemi qui sotto sono adattamenti logici del 5-1 6v6 documentati da VolleyballXL, The Art of Coaching Volleyball e Volleyball Canada."
                : "Il 4v4 indoor non ha regolamento ufficiale FIVB. Le formazioni qui sotto provengono dagli intramurali universitari (USA), dai manuali didattici FFVb / Volleyball Canada e dalla letteratura del beach (Brandon Joyner, Better at Beach)."}
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
                <div style={S.labelTeal}>Pro</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Contro</div>
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
        <h2 style={S.section}>Ruolo dell'alzatore in ricezione — {teamSize}v{teamSize}</h2>
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
                  <strong style={{ color: 'var(--teal)' }}>Nota: </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Il libero — ricezione specializzata</h2>
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
        <h2 style={S.section}>Leggere il servizio per posizionarsi</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo di servizio</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Adattamento del ricevitore</th>
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
          <div style={S.labelTeal}>Indizi prima del contatto del battitore</div>
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
        <h2 style={S.section}>Errori comuni</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Errori tecnici (tutti i formati)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Errori specifici del {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

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
