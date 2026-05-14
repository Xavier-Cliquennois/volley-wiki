import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'La superficie de contacto ideal está entre 2,5 y 15 cm por encima de las muñecas.'],
  ['Cup and fold', "Técnica recomendada: un puño cerrado, la otra mano envolviendo por encima — pulgares paralelos apuntando hacia abajo."],
  ['Pulgares abajo', "Apuntar los pulgares hacia el suelo rota los antebrazos hacia fuera y tensa la plataforma."],
  ['Nunca entrelazar', 'NUNCA entrelaces los dedos en un saque potente — riesgo de fractura.'],
  ["El ángulo dirige", '"La pelota va hacia donde mira la plataforma" — para una recepción profunda: plataforma a 45°; para una recepción corta: plataforma más paralela al suelo.'],
];

const STEPS = [
  'Lee al sacador: identifica el tipo de saque antes del contacto.',
  "Posición de listos con los brazos separados (NO unidos de antemano).",
  'Lee la trayectoria en el momento en que el rival golpea la pelota.',
  'Desplázate (pasos laterales), llega DETRÁS de la pelota antes de juntar los brazos.',
  'Construye la plataforma a tiempo: une las manos cuando llega la pelota, no demasiado pronto.',
  'FREEZE: quédate quieto justo antes del contacto, peso sobre el pie adelantado — mantén 1-2 segundos.',
  'Contacto en el sweet spot, hombros orientados hacia el colocador objetivo.',
  'Acompañamiento: caderas y hombros avanzan hacia el objetivo — sin balanceo de brazos.',
];

const DISPLACEMENTS = [
  {
    name: 'Lateral (pasos laterales)',
    desc: 'El pie del lado de la pelota sale primero. Pasos laterales sin cruzar, caderas bajas. Llega detrás de la pelota, reorientate hacia el objetivo, freeze + plataforma en el último momento. Para distancias largas: pasos cruzados y luego pivote.',
  },
  {
    name: 'Hacia adelante (pelota corta)',
    desc: 'Para saques cortos o fintas. Suele terminar en una zancada frontal: rodilla descendiendo hacia el suelo, plataforma colocada delante de la rodilla adelantada.',
  },
  {
    name: 'Hacia atrás (drop step)',
    desc: "Pivota el pie y desplázate hacia atrás con pasos laterales. NUNCA corras hacia atrás (pérdida de equilibrio). Si es tarde para retroceder: pivota y crea una plataforma lateral.",
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
      name: 'Sistema W — 5 receptores',
      level: 'Principiante',
      desc: '3 jugadores en la línea delantera, 2 en la segunda — todos salvo el colocador participan. Forma histórica que da nombre a la "W-formation" (FIVB, USAV IMPACT).',
      pros: ['Zonas reducidas por jugador (~1,8 m de carril)', 'Poca comunicación necesaria', 'Ideal para escuela de voleibol y U13-U15'],
      cons: ['Muchas zonas de solapamiento entre 5 jugadores', 'Receptores débiles obligados a participar', 'Desorganiza a los atacantes (3 delanteros en recepción)'],
    },
    {
      name: 'Sistema U — 3 receptores',
      level: 'Estándar moderno',
      desc: 'Líbero en zona 6 (objetivo principal de los sacadores), puntas en zonas 5 y 1. Los 3 mejores receptores toman todas las pelotas, todos los atacantes delanteros salen.',
      pros: ['Comunicación simplificada a 3 jugadores', 'Los 3 mejores receptores cubren todo', 'Atacantes delanteros libres para su carrera de aproximación'],
      cons: ['Zonas laterales más amplias que cubrir (~3 m por jugador)', 'Requiere un líbero de alto rendimiento', 'Vulnerable a los saques cortos a las esquinas'],
      recommended: true,
    },
    {
      name: 'Recepción a 2 — líbero + R4',
      level: 'Élite',
      desc: 'Solo 2 receptores (líbero + un R4 seleccionado) cubren todo el ancho. Usado en el máximo nivel para liberar al 2º R4 y mantenerlo fresco para el ataque sin fatiga de recepción.',
      pros: ['Todos los atacantes disponibles para la transición ofensiva', 'Mejor bloqueo/ataque al no desgastarse los atacantes en recepción', 'Sistema preferido por los equipos profesionales (Polonia, Francia, Italia)'],
      cons: ['Requiere 2 receptores muy atléticos (~4,5 m de carril cada uno)', 'Sin margen de error — un saque mal leído = punto rival', 'Inutilizable sin un líbero de nivel internacional'],
    },
  ],
  5: [
    {
      name: 'Recepción a 3 — disposición 2D-3Z',
      level: 'Recomendado',
      desc: 'Los 3 jugadores de zaga (P5, P6, P1) reciben. El colocador en P1 sale de la recepción y penetra en el momento en que el sacador contacta la pelota, igual que el 5-1 en 6v6. Los 2 delanteros (P4, P3) quedan libres para su aproximación.',
      pros: ['Disposición más cercana al 5-1 6v6 (pedagógicamente ideal)', 'Buena transición recepción → ataque', '2 atacantes delanteros + pipe desde zaga posible'],
      cons: ['3 receptores en 9 m (~3 m por jugador)', 'El colocador debe leer rápido y decidir penetrar en <1 segundo', 'Hueco en P1 si el colocador sale demasiado pronto'],
      recommended: true,
    },
    {
      name: 'Recepción a 4 — disposición 3D-2Z',
      level: 'Estándar',
      desc: 'Los 2 jugadores de zaga (P5, P1) + 2 delanteros (típicamente P4 y P3 — el colocador en P2 sale) reciben. El colocador se queda en el objetivo: sin penetración, distribución inmediata.',
      pros: ['Zonas reducidas (~2,25 m por jugador)', 'Ideal para equipos mixtos o principiantes', 'Colocador ya en el objetivo — sin transición'],
      cons: ['Solo 2 atacantes disponibles delante (P4 + P3 o P4 + central)', 'Los delanteros que reciben deben luego correr su aproximación', 'Bloqueo a 2 difícil porque el colocador sube a la red'],
    },
    {
      name: 'Recepción en pentágono — 4 o 5 jugadores',
      level: 'Principiante / recreativo',
      desc: '5 receptores (equivalente al W de 5 jugadores). 1 jugador en el centro de la red (a menudo un colocador dedicado), las 2 puntas en el medio, los 2 jugadores de zaga en la zona profunda. Todos participan salvo si el central es un colocador dedicado.',
      pros: ['Cobertura uniforme de la cancha', 'Exigencia técnica muy baja', 'Adecuado para sesiones de iniciación'],
      cons: ['Muchos solapamientos con 5 receptores', 'Ningún atacante queda liberado', 'Ineficaz en cuanto sube el nivel'],
    },
  ],
  4: [
    {
      name: 'Diamante (3 receptores)',
      level: 'Estándar 4v4',
      desc: 'Colocador en el centro de la red (P3, saliendo de la recepción). Las 2 puntas (P4, P2) en media cancha + el único jugador de zaga (P1) en la zona profunda reciben. La formación más común en 4v4 indoor (intramurales universitarios).',
      pros: ['Colocador ya en el objetivo — sin penetración', '3 zonas claras y simétricas', 'Ideal para intramurales, juego recreativo, 4s de playa'],
      cons: ['Cubrir 9 m de ancho con 3 = ~3 m por jugador', 'El único jugador de zaga debe defender toda la zona profunda tras la recepción', 'Solo 2 atacantes delante'],
      recommended: true,
    },
    {
      name: 'Línea 3-1 (3 receptores)',
      level: 'Intermedio',
      desc: 'Único colocador en P1 (zaga) que penetra en el momento en que se contacta el saque rival hacia zona 2. Los 3 atacantes delanteros (P4, P3, P2) reciben. Equivalente simplificado del 5-1 6v6.',
      pros: ['3 atacantes delante siempre', 'Pedagogía útil para preparar el 5-1 6v6', 'El colocador también puede atacar tras distribuir'],
      cons: ['Exige una recepción muy limpia (la penetración no perdona)', 'Hueco en P1 si el colocador sale antes de defenderse la pelota', 'Todos los atacantes deben saber recibir'],
    },
    {
      name: 'Caja 2-2 (4 receptores)',
      level: 'Principiante',
      desc: '2 delanteros (P4, P2) + 2 jugadores de zaga (P5, P1), sin colocador dedicado en la red. El jugador mejor situado toma el 2º toque. Típico de sesiones de iniciación o U11-U13.',
      pros: ['Cubre toda la cancha (4 zonas de 2,25 m)', 'Sin exigencia técnica al colocador', 'Todos reciben — muy educativo'],
      cons: ['Sin colocador dedicado — distribución aleatoria', 'Ningún atacante queda liberado para su aproximación', 'Ineficaz en cuanto sube el nivel'],
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
      title: 'Colocador en ZAGA (P1 / P6 / P5) — rotaciones P1, P6, P5 del 5-1',
      bullets: [
        'Sale de la recepción: ninguna pelota va dirigida a él.',
        'Inicia en una posición especial (p. ej. P1: ~7,5 m de la red, 1 m de la línea lateral), escondido detrás de otro jugador (stack).',
        'Penetra hacia el objetivo (entre Z2 y Z3, ~1 m de la red, 3 m a la derecha del centro) EN EL MOMENTO EN QUE EL RIVAL CONTACTA EL SAQUE — no antes (falta de overlap).',
        'P1: penetración más corta; P6: penetración central; P5: penetración más larga (diagonal).',
        '3 atacantes delante disponibles (R4 + central + opuesto) + ataques desde zaga.',
      ],
    },
    {
      title: 'Colocador DELANTERO (P2 / P3 / P4) — rotaciones P2, P3, P4 del 5-1',
      bullets: [
        'Sale de la recepción: ya está cerca del objetivo.',
        'En P2: ya en el objetivo — también se convierte en el bloqueador de línea contra el R4 rival desde Z4 (doble carga defensiva).',
        'En P3: switch lateral hacia el objetivo justo después del contacto del saque.',
        'En P4: cruza toda la red para llegar al objetivo (el desplazamiento delantero más largo).',
        'Solo 2 atacantes delante (compensados por un pipe en P6 y un ataque de zaga del opuesto en P1).',
      ],
    },
  ],
  5: [
    {
      title: 'Colocador PENETRANTE (disposición 2D-3Z, recomendada)',
      bullets: [
        'Inicia en P1 zaga, sale de la recepción.',
        'Penetra hacia el objetivo (Z2/Z3, ~1 m de la red) EN EL MOMENTO en que se contacta el saque rival — idéntico al 5-1 6v6.',
        'Los 3 jugadores de zaga (P5 + P6 + P1 al salir) cubren la recepción a 3.',
        'Debe esperar a que se defienda la pelota antes de salir (error común: salida prematura → hueco en P1).',
      ],
      note: 'Disposición más cercana al 6v6 — recomendada para preparar la transición.',
    },
    {
      title: 'Colocador DELANTERO FIJO (disposición 3D-2Z o pentágono)',
      bullets: [
        'Se queda en el objetivo (P2 o P3 según la disposición): sin penetración.',
        'Sale de la recepción: ninguna pelota va dirigida a él.',
        'Distribución inmediata en cuanto llega el pase — sin transición.',
        'En P2: también se convierte en el bloqueador de línea contra el punta rival (como en 5-1 6v6).',
      ],
    },
  ],
  4: [
    {
      title: 'Colocador DELANTERO en diamante (P3 centro red)',
      bullets: [
        'Se queda en el objetivo (Z3, ~1 m de la red): sin penetración.',
        'Sale de la recepción: los otros 3 (2 puntas + 1 de zaga) reciben.',
        'Distribución rápida hacia Z4 o Z2 según la calidad del pase.',
        'Su transición defensa → colocación debe ejecutarse en menos de 2 segundos (solo 1 jugador de zaga = mucha cobertura).',
      ],
      note: 'Formación más utilizada en 4v4 indoor.',
    },
    {
      title: 'Colocador PENETRANTE en línea 3-1 (P1 zaga)',
      bullets: [
        'Inicia en P1 zaga, sale de la recepción.',
        'Penetra hacia zona 2 en el momento en que se contacta el saque rival.',
        'Los 3 atacantes delanteros (P4, P3, P2) reciben.',
        'Requiere una recepción muy limpia — de lo contrario el colocador no llega al objetivo a tiempo.',
      ],
    },
    {
      title: 'Sin colocador dedicado (caja 2-2)',
      bullets: [
        'El jugador mejor situado tras el 1er toque toma el 2º toque.',
        'Todos reciben — 4 zonas de ~2,25 m.',
        'Distribución aleatoria hacia uno de los otros 3 jugadores.',
        'Reservar para sesiones de iniciación (U11-U13, escolar).',
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
    title: 'El líbero — pieza central de la recepción en 6v6',
    text: 'Especialista defensivo con camiseta de color contrastante. Sustituye sistemáticamente a los centrales cuando rotan a zaga (sustituciones ilimitadas, no contabilizadas por la Regla 19 FIVB). Juega 3 rotaciones consecutivas en Z5-Z6-Z1. Posición preferida de recepción: Z6 (objetivo principal de los sacadores) o Z5. Restricciones FIVB: sin bloqueo, sin ataque por encima de la red, sin colocación de dedos delante de la línea de 3 m si un compañero ataca luego por encima de la red.',
    accent: 'orange',
  },
  5: {
    title: 'Sin líbero oficial en 5v5',
    text: 'El 5v5 indoor no tiene regulación FIVB. En la práctica, ninguna federación permite líbero en este formato. El mejor receptor se coloca en P6 o P5 y juega sistemáticamente en zaga — se convierte en el "líbero de facto" sin la camiseta contrastante ni las restricciones. Por tanto puede bloquear y atacar si es necesario.',
    accent: 'teal',
  },
  4: {
    title: 'Sin líbero en 4v4',
    text: 'No se permite líbero bajo la normativa 4v4 (intramurales universitarios, juego educativo de la FFVb, 4s de playa). El único jugador de zaga en diamante — o el colocador penetrante en línea 3-1 — asume el rol de mejor receptor/defensor. Con ~3 m de carril por receptor en diamante, la anticipación importa más que la técnica.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Por abajo', 'Postura normal, toma la pelota alta'],
  ['Flotante de pie', "Postura alta, paso adelante para tomarla pronto antes de que se desvíe"],
  ['Topspin', 'Postura baja, listo para retroceder, plataforma angulada'],
  ['Jump float', 'Puede jugarse con dedos a 4 m de la red'],
  ['Jump topspin', 'Postura baja, retroceso anticipado, plataforma rígida pasiva'],
  ['Saque híbrido', 'Plataforma lista para ambos escenarios (flotante o topspin)'],
];

const READING_CUES = [
  'Posición del sacador en la línea → ángulo preferido',
  'Altura y colocación del lanzamiento: alto+atrás → topspin; bajo+adelante → flotante',
  "Longitud de la carrera: larga → jump topspin; corta → jump float",
  'Dirección de los hombros del sacador en el contacto → dirección de la pelota',
];

const ERRORS_COMMON: [string, string][] = [
  ['Balanceo de brazos', 'Causa nº1 — brazos oscilando en el contacto, pelota impredecible. Corrección: "la plataforma es pasiva, las piernas son activas".'],
  ['Plataforma rota', "Un antebrazo más alto que el otro — bloquea los codos y empuja los pulgares hacia abajo."],
  ['Brazos unidos demasiado pronto', "Ralentiza el movimiento e impide la decisión tardía entre plataforma/dedos. Une las manos solo al llegar."],
  ['Tronco demasiado erguido', "La plataforma pasa por debajo de la pelota → la pelota acaba demasiado lejos de la red. Inclina 30-45° hacia adelante."],
  ['Contacto por encima del ombligo', 'Demasiado alto = control reducido. Apunta a un contacto a la altura de la cintura o más bajo.'],
  ['Sin freeze', "Aún en movimiento en el contacto = imposible controlar la dirección. Detente por completo."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Líbero mal posicionado', 'Demasiado central: se le escapan los saques cortos a las esquinas; demasiado lateral: abandona el centro. Objetivo de referencia: Z6 alineado con el sacador rival.'],
    ['Overlap del colocador', 'El colocador sale de su posición antes de que el rival contacte el saque — falta nº1 en el 5-1 (Regla 7.4 FIVB). Sus pies deben respetar las relaciones delante/detrás hasta el contacto.'],
    ['Recepción a 5 sin roles claros', 'En un W, los 3 delanteros interfieren en la zona central. Define explícitamente quién toma la pelota entre P3 y P6 en saques por el centro.'],
  ],
  5: [
    ['Colocador que sale demasiado pronto', 'En la disposición 2D-3Z con colocador penetrante, salir antes de defenderse la pelota = hueco en P1. Espera confirmación.'],
    ['2 receptores codo con codo', 'En la disposición 3D-2Z, P5 y P1 deben estar separados (uno por lado). Centrados juntos = líneas laterales expuestas.'],
    ['Receptor delantero que olvida atacar', 'En la disposición 3D-2Z, el delantero que recibe debe luego correr su aproximación de ataque — un reflejo a entrenar específicamente.'],
    ['Sin líbero de facto definido', 'Sin un rol claro, los 3 jugadores de zaga se pasan la responsabilidad. Designa explícitamente al mejor receptor como prioridad en la zona central.'],
  ],
  4: [
    ['Colocador en diamante que recibe', 'En diamante, el colocador en P3 debe SALIR de la recepción — de lo contrario es imposible distribuir rápido. Los otros 3 reciben.'],
    ['Único zaguero sobrecargado', 'En diamante, el P1 de zaga cubre ~3,5 m de fondo solo. Anticipación = habilidad nº1; pasos laterales constantes y lectura temprana.'],
    ['Caja 2-2 sin llamada en el 2º toque', 'Sin colocador dedicado, ¿quién coloca? Gritar "¡MÍA!" en el 2º toque en cuanto se produce la recepción es innegociable.'],
    ['Puntas en diamante en línea recta', 'P4 y P2 en media cancha al mismo nivel que P1 → el corte corto cae entre ellos. Escalona las posiciones.'],
  ],
};

const VIDEOS = [
  { title: 'Cómo hacer una plataforma (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'El pase de antebrazos (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Recepción controlada al colocador', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Aprender la recepción alta y baja (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Calentamiento individual de antebrazos', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionEs() {
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
        El pase de antebrazos determina el 60% del éxito ofensivo de un equipo. Sin una buena recepción, no hay ataque rápido. La plataforma es pasiva — las piernas son activas.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Formato de juego</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          Los <strong>sistemas de recepción</strong>, el <strong>rol del colocador</strong> y los <strong>errores comunes</strong> de abajo se adaptan al formato elegido.
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
        <h2 style={S.section}>Posición de listos</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Pies algo más anchos que los hombros, un pie ligeramente adelantado',
              "Rodillas flexionadas hacia el interior de los pies, caderas bajas, tronco inclinado 30-45°",
              'Espalda recta, peso en la planta de los pies (talones ligeramente aligerados pero no levantados)',
              'Brazos SEPARADOS (no unidos), flexionados a 90-145°, a la altura de la cintura',
              'Ojos en el sacador desde el momento del lanzamiento',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Error principal: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>tener los brazos ya unidos en plataforma antes de que llegue la pelota — esto ralentiza el movimiento e impide la decisión tardía entre plataforma/dedos.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>La plataforma</h2>
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
        <h2 style={S.section}>Ejecución — pasos clave</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>El freeze: </strong>
          "Posa para la foto" — quédate completamente quieto durante 1-2 segundos tras el contacto. A 50-90 km/h, un defensor en movimiento no puede ajustar su ángulo. Quieto, puede moverse en cualquier dirección.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Desplazamientos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Recepción con un brazo — emergencia</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Un recurso de última hora cuando la pelota está demasiado lejos para los dos brazos. Brazo extendido, plataforma plana sobre el antebrazo interior, sin balanceo — solo una estocada para desviar la pelota hacia arriba. Variantes: one-arm stab (puño contra un remate potente), one-arm scoop (palma abierta hacia arriba, pelota baja).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Sistemas de recepción — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Formato no oficial FIVB</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "El 5v5 indoor no tiene regulación dedicada FIVB ni FFVb. Los sistemas de abajo son adaptaciones lógicas del 5-1 6v6 documentadas por VolleyballXL, The Art of Coaching Volleyball y Volleyball Canada."
                : "El 4v4 indoor no tiene regulación oficial FIVB. Las formaciones de abajo provienen de los intramurales universitarios (EE. UU.), los manuales educativos de la FFVb / Volleyball Canada y la literatura de playa (Brandon Joyner, Better at Beach)."}
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
                <div style={S.labelTeal}>Ventajas</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Inconvenientes</div>
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
        <h2 style={S.section}>Rol del colocador en recepción — {teamSize}v{teamSize}</h2>
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
        <h2 style={S.section}>El líbero — recepción especializada</h2>
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
        <h2 style={S.section}>Leer el saque para colocarse</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de saque</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Ajuste del receptor</th>
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
          <div style={S.labelTeal}>Pistas antes del contacto del sacador</div>
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
        <h2 style={S.section}>Errores comunes</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Errores técnicos (todos los formatos)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Errores específicos de {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Recursos en vídeo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
