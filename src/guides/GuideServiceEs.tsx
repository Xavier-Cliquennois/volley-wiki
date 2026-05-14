import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Principiante': 'var(--mint)',
  'Intermedio': 'var(--yellow)',
  'Avanzado': 'var(--orange)',
  'Competición': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Competición': '#fff',
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
    name: 'Saque de abajo',
    level: 'Principiante',
    tagline: 'por abajo — movimiento pendular por debajo de la cintura',
    description: "Movimiento pendular del brazo golpeando la pelota por debajo de la cintura. Legal en todos los niveles, recomendado para principiantes o en caso de lesión de hombro. Casi inexistente por encima del nivel regional adulto.",
    biomechanics: [
      'Cadena cinética corta: caderas → hombro → brazo → mano',
      'Movimiento pendular sin rotación del tronco',
      'Transferencia de peso: pie atrasado → pie adelantado',
      'Contacto: talón de la mano o puño cerrado por debajo del centro de la pelota',
    ],
    steps: [
      'Pie izquierdo adelante, peso sobre la pierna atrasada',
      "La mano izquierda sostiene la pelota a la altura de la cadera, alineada con el brazo que golpea",
      'Brazo derecho armado atrás, palma abierta o puño cerrado',
      'Suelta la pelota justo antes del contacto — no la lances',
      "Golpe hacia adelante, contacto por debajo del centro de la pelota",
      'El brazo acompaña y apunta al objetivo, peso transferido al pie adelantado',
    ],
    errors: [
      ['Pelota demasiado baja o descentrada', "Mantén la pelota a la altura de la cadera, alineada con el brazo que golpea"],
      ['Golpear con los dedos', 'Usa el talón de la mano — una superficie más amplia y estable'],
      ['Lanzar demasiado alto', 'Simplemente suelta la pelota, no la lances hacia arriba'],
      ['Muñeca floja', 'Bloquea el brazo en el contacto para un impacto limpio'],
    ],
    exercises: [
      'Bolos-aros: apunta a zonas a 4 m de la red',
      "10 saques a 4 m y luego retrocede 1 m por serie hasta la línea de fondo",
      'Dianas de 4x3 m en el suelo — objetivo 50% de precisión',
    ],
    videos: [
      { title: 'Saque de abajo + saque de tenis (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Cómo sacar por abajo', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Saque flotante de pie',
    level: 'Intermedio',
    tagline: 'flotante de pie — saque base del 90% de los aficionados',
    description: `Saque sin rotación que produce una trayectoria impredecible (efecto "knuckleball"). A una velocidad crítica (~12-13 m/s), vórtices asimétricos generan fuerzas de sustentación laterales aleatorias. Es el saque que hay que dominar primero.`,
    biomechanics: [
      'Cadena cinética completa: piernas → caderas → tronco → hombro → codo → mano',
      `Posición "arco y flecha": codo alto sobre el hombro, mano detrás de la oreja`,
      "Muñeca BLOQUEADA y firme — requisito absoluto para el efecto flotante",
      'Contacto: talón de la mano en el centro de la pelota',
      `"Punch and freeze": acompañamiento CORTO — la mano se detiene inmediatamente tras el contacto`,
    ],
    steps: [
      "Cuerpo a 45° de la red, pies a la anchura de los hombros",
      "Brazo izquierdo extendido delante del hombro, pelota a la altura de la cabeza",
      `Lanzamiento muy corto: "coloca" la pelota 30-50 cm por encima del hombro — la pelota no rota`,
      'El pie izquierdo avanza hacia el objetivo justo después de colocar la pelota',
      'Extensión completa del brazo en el contacto, mano firme y plana',
      'FREEZE: parada inmediata del movimiento tras el contacto — sin acompañamiento del brazo',
    ],
    errors: [
      ['Acompañamiento prolongado del brazo', "Causa de fallo nº1: el acompañamiento añade rotación que mata el efecto flotante — congela el movimiento de inmediato"],
      ['Lanzamiento demasiado alto', 'La pelota cae en la red — lanza corto, solo 30-50 cm'],
      ['Lanzamiento con rotación', 'Induce rotación en la pelota — coloca la pelota, no la lances'],
      ['Contacto solo con la palma', 'Usa el talón de la mano (parte baja de la palma) para una superficie plana'],
    ],
    exercises: [
      'Toss & Drop: marca un punto en el suelo, lanza 20 veces sin golpear — objetivo 18/20 en el punto',
      `"Punch and freeze" en la pared a 3 m: trabaja la parada inmediata del movimiento`,
      '5 saques consecutivos sin rotación, validados visualmente por un compañero',
    ],
    videos: [
      { title: 'Saque flotante en 4 minutos', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Mejora tu saque flotante', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Saque: flotante + tenis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Saque flotante en suspensión',
    level: 'Avanzado',
    tagline: 'jump float — estándar de las jugadoras de élite',
    description: "Flotante con carrera corta y salto. Gana altura de contacto, velocidad y ángulo de descenso más pronunciado. Se ha convertido en el estándar entre las jugadoras de élite (86% de los saques en el voleibol femenino profesional según estudios recientes). Menos arriesgado que el jump topspin y más perturbador que el flotante de pie.",
    biomechanics: [
      "Carrera corta (2 a 4 pasos)",
      'Brazos en posición de arco y flecha durante el salto — distinto de un remate donde los brazos impulsan',
      "La carrera proporciona la velocidad a la pelota, no solo el brazo",
      'Contacto en el punto más alto, ligeramente delante de la cabeza',
      'Muñeca bloqueada + freeze idénticos al flotante de pie',
    ],
    steps: [
      'Sitúate 2-3 m detrás de la línea, pelota en la mano izquierda',
      "Paso 1 (derecho) como impulso, brazos relajados",
      'Paso 2 (izquierdo): lanza la pelota a unos 1,5 m de altura, sin rotación',
      'Paso 3 + salto: despegue con ambos pies detrás de la línea — los brazos se elevan en arco y flecha',
      "Salto vertical ligeramente hacia adelante, cuerpo armado",
      'Golpea con el brazo extendido, talón de la mano en el centro de la pelota',
      'FREEZE inmediatamente — aterriza dentro de la cancha',
    ],
    errors: [
      ['Lanzamiento demasiado alto', 'Reflejo de jump spin — mantén el lanzamiento corto, como en el flotante de pie'],
      ["Brazos oscilando como en un ataque", 'Se convierte en un remate con efecto — mantén la posición de arco y flecha'],
      ['Acompañamiento prolongado', 'Igual que en el flotante de pie: el freeze es obligatorio'],
      ['Falta de pie en el despegue', "Asegúrate de que el despegue se produce detrás de la línea de fondo"],
    ],
    exercises: [
      "Domina el flotante de pie (freeze sólido) antes de añadir la carrera",
      'Solo carrera sin golpear: trabaja un lanzamiento estable y bajo',
      'Jump float a velocidad controlada: consistencia antes que potencia',
    ],
    videos: [
      { title: "Saque jump float — INF'AUX ENTRAÎNEURS (Bretaña)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + remate (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Saque potente en suspensión',
    level: 'Competición',
    tagline: 'jump serve — remate desde detrás de la línea',
    description: `"Remate desde detrás de la línea": pelota golpeada a máxima velocidad con topspin (80-95 km/h en clubes fuertes). El mayor potencial de ace pero también la mayor tasa de error. Reservado para quienes han invertido más de 1000 repeticiones en entrenamiento.`,
    biomechanics: [
      "Carrera de 3-4 pasos idéntica a un ataque de zaga",
      'Lanzamiento alto (1-1,5 m delante de ti) con un ligero topspin inducido',
      'Rotación secuencial: caderas → tronco → hombro → codo → muñeca',
      'Zona de contacto a las 10-11 horas de la pelota',
      'Latigazo completo de muñeca para el topspin (~30 rotaciones/s a nivel de élite)',
      'Acompañamiento completo — lo contrario del flotante',
    ],
    steps: [
      'Sitúate 3-4 m detrás de la línea, pelota en la mano que golpea',
      'Paso 1 (derecho) + lanzamiento alto con un ligero topspin inducido',
      'Paso 2 (izquierdo): aceleración',
      "Paso 3 (derecho): paso largo de potencia, descenso del centro de gravedad",
      "Paso 4 (izquierdo): despegue, los brazos suben",
      'Salto explosivo vertical-frontal',
      'Golpea en el punto más alto: la mano pasa por encima de la pelota (10 horas), palma y luego dedos rodando por encima',
      'Latigazo completo de muñeca + acompañamiento — aterriza 1-2 m dentro de la cancha',
    ],
    errors: [
      ['Lanzamiento demasiado bajo o atrasado', 'Causa nº1 de golpear la red — el lanzamiento debe ser alto y adelante'],
      ['Lanzamiento demasiado adelante', 'Falta de pie — respeta los límites de la zona de saque'],
      ['Falta de latigazo de muñeca', 'La pelota se va larga sin rotación descendente'],
      ['Usarlo en partido sin preparación', "1000 repeticiones en entrenamiento primero — regla de oro"],
    ],
    exercises: [
      "Regla de oro: 1000 repeticiones en entrenamiento antes de usarlo en partido",
      'Jump spin "control": lanzamiento más bajo, velocidad reducida para apuntar a zonas precisas',
      'Graba tu lanzamiento: el 80% de los errores vienen de la colocación del lanzamiento',
    ],
    videos: [
      { title: 'Saque jump topspin potente + flotante (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Zona 1 — fondo derecha', 'Bloquea la salida del colocador en un sistema 5-1'],
  ['Zona 2 — corta delante derecha', 'Rompe el inicio por la derecha, excluye al líbero'],
  ['Zona 3 — corta delante centro', 'Bloquea al central, rompe los ataques rápidos'],
  ['Zona 4 — corta delante izquierda', "Obliga al atacante principal a recibir Y atacar"],
  ['Zona 5 — fondo izquierda larga', "Diagonal larga, alta tasa de error"],
  ['Zona 6 — fondo centro larga', 'Saque largo contra colocadores bajos'],
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

export default function GuideServiceEs() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        El 80% de los errores de saque vienen del lanzamiento. Estabiliza el lanzamiento como prioridad antes de buscar potencia.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>TIPOS DE SAQUE</h2>
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
            <div style={S.labelTeal}>BIOMECÁNICA CLAVE</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>PASOS DE EJECUCIÓN (DIESTROS)</div>
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
              <div style={S.labelOrange}>✗ ERRORES COMUNES</div>
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
              <div style={S.labelTeal}>★ EJERCICIOS</div>
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
            <div style={{ ...S.label, opacity: 0.6 }}>VÍDEOS — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>ZONAS OBJETIVO Y TÁCTICAS</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>ZONA RIVAL</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>EFECTO TÁCTICO</th>
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
            ['Costuras', "Apuntar al espacio entre dos receptores es más efectivo que apuntar a un jugador — la comunicación rival queda a prueba."],
            ['Alternar corto/largo', "Impide al colocador saber cuándo retrasarse. Un flotante corto (zonas 2-3-4) detrás de la línea de ataque es especialmente perturbador."],
            ['Métrica FBSO%', "Un saque que reduce el First Ball Side Out rival del 70% al 45% sin producir un ace es un saque muy efectivo."],
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
          <div style={{ ...S.label, marginBottom: 16 }}>★ JERARQUÍA DE APRENDIZAJE</div>
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
            Domina cada nivel antes de pasar al siguiente. <strong>Consistencia antes que potencia.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
