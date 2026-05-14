import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Mira al atacante, no a la pelota',
    desc: "Observa los hombros y el brazo del atacante para anticipar el momento y la dirección del remate.",
  },
  {
    title: 'Salta DESPUÉS del atacante',
    desc: 'Espera a que el atacante esté en su fase de despegue. Si saltas al mismo tiempo o antes, caerás demasiado pronto.',
  },
  {
    title: 'El retardo ideal: 0,2 a 0,3 segundos',
    desc: `Cuenta mentalmente "UNO" cuando el atacante salta, luego salta inmediatamente después. Esta fracción de segundo es crucial.`,
  },
  {
    title: 'Penetra por encima de la red',
    desc: 'En el punto más alto de tu salto, empuja las manos y los brazos hacia adelante y hacia abajo — no solo hacia arriba.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'El bloqueo ofensivo',
    objectif: "Devolver la pelota directamente al campo rival",
    points: [
      ['Posición', 'Manos bien abiertas, dedos extendidos y separados'],
      ['Acción', 'Penetra lo más lejos posible por encima de la red, brazos extendidos hacia adelante'],
      ['Objetivo', "Tensa las muñecas para clavar la pelota al suelo rival"],
      ['Cuándo', 'Cuando estás bien colocado y has leído el ataque'],
    ],
  },
  {
    name: 'El bloqueo de cobertura',
    objectif: 'Frenar la pelota para que tu defensa pueda recuperar',
    points: [
      ['Posición', 'Manos juntas, palmas anguladas hacia ti'],
      ['Acción', 'Absorbe el impacto en lugar de empujar'],
      ['Resultado', 'La pelota cae suavemente en tu campo para poder jugarla'],
      ['Cuándo', 'Cuando llegas tarde o estás mal colocado'],
    ],
  },
  {
    name: 'El bloqueo por zona',
    objectif: 'Quitar zonas concretas de ataque',
    points: [
      ['Posición', 'Bloquea una zona concreta (línea o diagonal)'],
      ['Acción', 'Angula las manos hacia la zona que quieres proteger'],
      ['Táctica', 'Obliga al atacante a rematar a una zona donde tus defensores están preparados'],
      ['Cuándo', 'De acuerdo con tu defensa de zaga'],
    ],
  },
  {
    name: 'El bloqueo a 2 o 3 (bloqueo colectivo)',
    objectif: 'Crear un muro impenetrable',
    points: [
      ['Coordinación', 'Saltad juntos en el mismo momento'],
      ['Colocación', 'Los bloqueadores exteriores se sitúan en relación al central'],
      ['Manos', 'Une tus manos con las de tus compañeros (sin hueco)'],
      ['Comunicación', 'Un bloqueador canta "línea" o "diagonal" para coordinar'],
    ],
  },
];

const TIMING_TIPS = [
  ['Ejercicio "uno-dos"', `En el entrenamiento, di "UNO" cuando el atacante salta, "DOS" cuando saltas tú. Esto crea el retardo necesario.`],
  ['Mira los hombros', "La orientación de los hombros del atacante indica la dirección del remate."],
  ['Lee la colocación', 'Una colocación alta = más tiempo. Una colocación pegada a la red = reacción rápida.'],
  ['Colócate pronto', 'Mejor estar colocado y esperando que correr en el último momento.'],
  ['Trabaja tu salto vertical', 'Cuanto más alto saltes, más margen de error tendrás en el timing.'],
];

const SAUT_POSITION = [
  'Pies a la anchura de los hombros',
  'Peso en la planta de los pies',
  'Rodillas ligeramente flexionadas',
  'Brazos a los lados o ligeramente delante',
  'Sitúate a unos 30–50 cm de la red',
];

const SAUT_IMPULSION = [
  ['Paso lateral', 'Si necesitas moverte, usa un paso lateral rápido'],
  ['Flexión', 'Flexiona las piernas rápidamente (no bajes demasiado)'],
  ['Impulso de brazos', 'Lanza los brazos hacia arriba de forma explosiva'],
  ['Extensión completa', 'Extiende las piernas por completo para maximizar la altura'],
];

const SAUT_EN_LAIR = [
  'Mantén los brazos extendidos y firmes',
  'Manos bien abiertas, dedos extendidos y separados',
  'Penetra por encima de la red (¡sin tocar la red!)',
  'Tensa el core para mantenerte estable',
];

const ERREURS = [
  ['Saltar demasiado pronto', '¡Caes mientras el atacante remata — espera más!'],
  ['Mirar la pelota', '¡Pierdes información del atacante — mira al jugador!'],
  ['Manos blandas', '¡La pelota rebota a tu campo — endurece y tensa los dedos!'],
  ['Saltar hacia adelante', '¡Tocas la red — salta vertical!'],
  ['Bajar los brazos demasiado pronto', 'Mantén los brazos arriba hasta aterrizar.'],
];

const EXERCICES = [
  {
    title: 'Timing con un compañero',
    desc: 'Un compañero finge atacar (sin pelota). Trabajas solo el timing de tu salto. Repite 20 veces.',
  },
  {
    title: 'Bloqueo sobre un ataque fijo',
    desc: 'Un atacante remata desde una posición fija. Concéntrate en el timing y la técnica. Aumenta la velocidad gradualmente.',
  },
  {
    title: 'Lectura de hombros',
    desc: 'El atacante varía los remates (línea/diagonal). Intenta leer sus hombros para anticipar la dirección.',
  },
  {
    title: 'Juego de pies + bloqueo',
    desc: 'Trabaja el desplazamiento lateral rápido seguido de un bloqueo. Simula situaciones de partido.',
  },
];

const CONSEILS_PRO = [
  ['Paciencia', 'El bloqueo es una de las técnicas más difíciles. Sé paciente contigo mismo.'],
  ['Repetición', 'La memoria muscular se construye con cientos de repeticiones.'],
  ['Vídeo', 'Grábate para analizar tu timing y tu técnica.'],
  ['Mira a los profesionales', 'Observa cómo los jugadores profesionales leen el juego y cronometran sus saltos.'],
  ['Empieza simple', 'Domina el bloqueo contra ataques lentos antes de pasar a los ataques rápidos.'],
];

export default function GuideContreEs() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="PELOTA → COLOCADOR → PELOTA → HOMBRO DEL ATACANTE → SALTO → PENETRACIÓN POR ENCIMA DE LA RED">
        Con práctica regular y especial atención al timing, mejorarás significativamente tus bloqueos. Un bloqueo con buen timing y salto medio es mejor que un salto muy alto con mal timing.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>Los fundamentos del bloqueo</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            El bloqueo es un movimiento defensivo crucial que puede convertirse en un arma ofensiva.
            La clave está en un <strong style={{ color: 'var(--orange)' }}>timing perfecto</strong> y una buena lectura del juego.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing: la clave del éxito</h2>
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
        <h2 style={S.section}>Los distintos tipos de bloqueo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Objetivo: </span>
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
        <h2 style={S.section}>Consejos para mejorar tu timing</h2>
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
        <h2 style={S.section}>Secuencia visual de élite</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>Los mejores bloqueadores no miran la pelota — siguen una secuencia precisa:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['PELOTA', 'COLOCADOR', 'PELOTA', "HOMBRO DEL ATACANTE"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. PELOTA', 'Ve la pelota viajar hacia el colocador'],
              ['2. COLOCADOR', "Lee las manos del colocador en el momento del contacto — dirección de la colocación"],
              ['3. PELOTA', 'Sigue brevemente la pelota para confirmar la dirección'],
              ['4. HOMBRO DEL ATACANTE', "Fíjate en el hombro del atacante — revela la dirección del remate antes del contacto"],
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
        <h2 style={S.section}>Timing preciso según el tipo de ataque</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de ataque</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Timing del salto del bloqueador</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1er tiempo (central)', 'CON o justo antes que el atacante (commit block)'],
                ['Shoot / 2º tiempo punta', '~0,1s después del atacante'],
                ['Pelota alta punta (3er tiempo)', '0,2–0,3s después del atacante'],
                ['Colocación pegada a la red', 'CON el atacante'],
                ['Colocación separada de la red', '~0,5s después, o no saltes'],
                ['Slide (central)', 'CON o justo después — sigue lateralmente'],
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
            <div style={S.label}>Read blocking — recomendado</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>El bloqueador espera la decisión del colocador, lee la pelota y al atacante, y luego se mueve. Posición "bunch read" (todos cerca del centro, después explotan hacia el pin).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Estable y presente en la mayoría de colocaciones', 'Cuida caderas y rodillas', 'Adecuado para todos los niveles amateurs'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — avanzado/pro</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>El central decide ANTES de que el colocador suelte la pelota para saltar con la rápida. Anula el ataque rápido rival, pero si el colocador coloca a otro lado, el central queda completamente fuera de la jugada.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Eficaz contra centrales dominantes', 'Alto riesgo si el colocador se adapta', 'Reservado a jugadores con excelente lectura'].map((pt, i) => (
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
        <h2 style={S.section}>Técnica de salto para el bloqueo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Posición inicial', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'El despegue', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'En el aire', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
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
        <h2 style={S.section}>Errores comunes a evitar</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Errores comunes</div>
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
        <h2 style={S.section}>Ejercicios de entrenamiento</h2>
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
        <h2 style={S.section}>Consejos de profesionales</h2>
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
        <h2 style={S.section}>Recursos en vídeo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Aprender a bloquear (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'El bloqueo en voleibol (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Ejercicio: saltar para bloquear', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Ejercicio: bloquear un ataque', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
