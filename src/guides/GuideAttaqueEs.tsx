import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Principiante': 'var(--mint)',
  'Principiante → Intermedio': 'var(--mint)',
  'Intermedio': 'var(--yellow)',
  'Intermedio+': 'var(--orange)',
  'Avanzado': 'var(--orange)',
};

const PHASES = [
  ['Iniciación', 'Leer la colocación y decidir la carrera de aproximación'],
  ['Wind-up', 'Inicio de la carrera de aproximación'],
  ['Armado', 'Codo por encima del hombro, mano detrás de la oreja — posición de potencia'],
  ['Aceleración', 'Rotación secuencial: caderas → tronco → hombro → codo → muñeca'],
  ['Contacto + acompañamiento', 'Latigazo de muñeca, la mano "araña" por encima de la pelota → topspin'],
];

const APPROACH_3 = [
  ['Paso 1 (izquierdo)', 'Paso direccional corto, orientado hacia el ataque'],
  ['Paso 2 (derecho)', 'Paso de potencia — largo y bajo, talón primero, descenso del centro de gravedad'],
  ['Paso 3 (izquierdo)', 'Paso de cierre — corto, frena la traslación horizontal y la convierte en vertical'],
];

const APPROACH_4 = [
  ['Paso 1 (derecho)', 'Paso de observación, ritmo lento'],
  ['Paso 2 (izquierdo)', 'Aceleración'],
  ['Paso 3 (derecho)', 'Paso de potencia — el más importante, largo y bajo'],
  ['Paso 4 (izquierdo)', 'Paso de cierre paralelo a la red'],
];

const TIMING_TABLE: [string, string][] = [
  ['Pelota alta (3er tiempo)', 'Empieza TARDE — cuando la pelota sale de las manos del colocador'],
  ['2º tiempo (Hut/Go)', 'Empieza cuando el pase está llegando al colocador'],
  ['1er tiempo (Quick)', 'Empieza PRONTO — ya en el aire cuando el colocador toca la pelota'],
  ['Slide', 'Empieza en el momento en que el colocador recibe el pase'],
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
    name: 'Ataque por zona 4 (Punta / OH)',
    position: 'Punta izquierda',
    description: `Fundamento para aprender a atacar. La punta recibe el mayor volumen de pelotas — es la opción "segura" del colocador. Carrera de aproximación a 45° desde la izquierda.`,
    keyPoints: [
      'Carrera de aproximación de 4 pasos a ~45° de la red',
      'Despegue a 30-50 cm de la red',
      'Colocación "Hut" (3er tiempo alto) o "Go" (2º tiempo rápido)',
      'Salta VERTICALMENTE — no hacia la red',
      'Contacto ligeramente delante del hombro que golpea',
    ],
    shots: ['Diagonal larga', 'Línea (paralela)', 'Diagonal corta (ángulo cerrado <3 m)', 'Finta', 'Roll shot (topspin a media velocidad)'],
  },
  {
    id: 'middle',
    name: 'Ataque por el centro (Quick / 1er tiempo)',
    position: 'Central delantero',
    description: 'El ataque más rápido. El central está en el aire ANTES o cuando el colocador toca la pelota. Colocación muy baja (30-50 cm) y muy corta.',
    keyPoints: [
      'Inicia la carrera de aproximación PRONTO — ya en el aire al soltar el colocador',
      'Carrera de 2-3 pasos, brazo ya armado durante la subida',
      `Concepto "Ghost Middle": aunque la pelota no llegue, corre la rápida a máxima velocidad para mantener al bloqueo rival → libera a las puntas`,
      'Contacto 30-50 cm por encima de la red',
      'Transición rápida: bloqueo → carrera de aproximación en 1-2 segundos',
    ],
    shots: ['Rápida delante del colocador ("1")', 'Back-1 detrás del colocador', 'Slide (salida atrás a lo largo de la red)', '31/Gap (offset entre el colocador y la antena)'],
  },
  {
    id: 'opposite',
    name: 'Ataque por zona 2 (Opuesto)',
    position: 'Punta derecha',
    description: 'El opuesto ataca desde la zona 2. Ideal para zurdos (hombro que golpea del lado de la antena derecha = ventana máxima). Para diestros: rotación de tronco más marcada, posición más alejada de la antena.',
    keyPoints: [
      'Carrera de aproximación simétrica a la del punta pero desde la derecha',
      'Termina con el pulgar abajo para la diagonal corta',
      '"Release" como opción para el colocador cuando la recepción es mala',
      'Ataque de zaga desde P1 (zona D) cuando está en zaga',
    ],
    shots: ['Diagonal larga', 'Línea', 'Pipe/D desde zaga', 'Diagonal corta hacia zona 5'],
  },
  {
    id: 'backrow',
    name: 'Ataque de zaga (Pipe)',
    position: 'Centro de zaga o derecha de zaga',
    description: 'Ataque desde la zona de zaga. El despegue DEBE producirse DETRÁS de la línea de 3 m. Permite tener 4 atacantes contra 3 bloqueadores.',
    keyPoints: [
      'Despegue obligatorio detrás de la línea de 3 m (de lo contrario, falta)',
      'Aterrizaje en la zona delantera tras un salto legal = OK',
      'Pipe: desde P6, colocación atrás sobre la rápida (BIC = justo por encima de la rápida)',
      'Zona D: desde P1, a menudo ataque de reserva del opuesto',
    ],
    shots: ['Pipe (centro de zaga)', 'Zona D (derecha de zaga)', 'Zona A (izquierda de zaga, raro)', 'Finta sobre una mala colocación'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Finta',
    level: 'Principiante → Intermedio',
    desc: 'Carrera de aproximación IDÉNTICA al remate (el engaño es crucial), luego en el contacto frena el brazo y coloca la pelota con un toque de dedos. Dirección: zona vacía localizada ANTES del salto.',
  },
  {
    name: 'Roll shot / Topspin a media velocidad',
    level: 'Intermedio',
    desc: 'Golpe a velocidad reducida (~50-70%) con fuerte topspin para una pelota que cae corta detrás del bloqueo. Más difícil de leer que una finta porque es más rápido.',
  },
  {
    name: 'Diagonal corta / Ángulo cerrado',
    level: 'Intermedio+',
    desc: 'Ángulo cerrado hacia zona 1 (desde 4) o zona 5 (desde 2). Termina con el pulgar abajo, mano cortando lateralmente la pelota. Golpea el lado de la pelota, no la parte de arriba.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermedio+',
    desc: 'Empuja deliberadamente la pelota hacia fuera por las manos del bloqueo. Sobre una colocación pegada a la red, salta vertical y empuja la pelota lateralmente usando la mano exterior del bloqueador como "raíl".',
  },
];

const ERRORS = [
  ['Timing de la carrera de aproximación', 'Demasiado pronto: se vuelve a saltar sin potencia. Demasiado tarde: brazo estirado atrás en el contacto.'],
  ['Orden de pies erróneo', 'Termina siempre en izquierdo-derecho (diestro) — ambos pies casi simultáneos.'],
  ['Sin topspin', 'Mano plana = sin latigazo = pelota larga. "Araña" por encima de la pelota.'],
  ['Falta de red', 'Saltar hacia adelante sobre una colocación pegada. Salta VERTICAL, no hacia adelante.'],
  ['Falta de zaga', 'Pie sobre o delante de la línea de 3 m en el despegue.'],
  ['Aterrizaje a un pie', 'Salvo en el slide: aterriza con los dos pies para proteger la rodilla (riesgo de LCA).'],
];

const VIDEOS = [
  { title: 'Cómo atacar — 3 pasos (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'El remate en voleibol (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Carrera de aproximación detallada', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Seb\'s Sequence — todo sobre el remate', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Saltar para atacar (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Ataques colocados (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaqueEs() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="APROXIMACIÓN LENTA → RÁPIDA → PASO DE POTENCIA → CIERRE → SALTO VERTICAL → BRAZO EXTENDIDO ADELANTE → LATIGAZO DE MUÑECA">
        La potencia viene de la cadena cinética completa, no solo del brazo. Una carrera de aproximación con ritmo y los dos últimos pasos rápidos genera el 70% de la potencia final.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>Las 5 fases del remate</h2>
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
          <strong style={{ color: 'var(--ink)' }}>Contacto ideal: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Ligeramente delante del hombro que golpea, nunca detrás de la cabeza (pérdida de potencia + riesgo de lesión). Distancia a la red en el despegue: 30-50 cm mínimo.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Carrera de aproximación</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 pasos — Principiante</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Izquierdo-derecho-izquierdo (diestro)</div>
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
            <div style={S.label}>4 pasos — Estándar de competición</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Derecho-izquierdo-derecho-izquierdo (diestro)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Regla de oro: los dos últimos pasos son los más rápidos — lento → rápido.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing según el tipo de colocación</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de colocación</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Cuándo iniciar la carrera de aproximación</th>
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
        <h2 style={S.section}>Tipos de ataque por posición</h2>
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
              <div style={S.labelTeal}>Puntos clave</div>
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
              <div style={S.label}>Selección de golpe</div>
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
        <h2 style={S.section}>Golpes especiales</h2>
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
        <h2 style={S.section}>Errores comunes</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>A evitar</div>
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
