import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Olhar para o atacante, não para a bola',
    desc: "Observar os ombros e o braço do atacante para antecipar o momento e a direção do remate.",
  },
  {
    title: 'Saltar DEPOIS do atacante',
    desc: 'Esperar que o atacante esteja na fase de chamada. Se saltar ao mesmo tempo ou antes, desce cedo demais.',
  },
  {
    title: 'O atraso ideal: 0,2 a 0,3 segundos',
    desc: `Contar mentalmente "UM" quando o atacante salta, depois saltar imediatamente a seguir. Esta fração de segundo é crucial.`,
  },
  {
    title: 'Penetrar por cima da rede',
    desc: 'No pico do salto, empurrar as mãos e os braços para a frente e para baixo — não apenas para cima.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'O bloco ofensivo',
    objectif: "Devolver a bola diretamente para o campo adversário",
    points: [
      ['Posição', 'Mãos bem abertas, dedos estendidos e afastados'],
      ['Ação', 'Penetrar o mais possível por cima da rede, braços estendidos para a frente'],
      ['Alvo', "Rigidificar os pulsos para empurrar a bola para o chão adversário"],
      ['Quando', 'Quando está bem colocado e leu o ataque'],
    ],
  },
  {
    name: 'O bloco de cobertura',
    objectif: 'Travar a bola para que a sua defesa recupere',
    points: [
      ['Posição', 'Mãos próximas, palmas inclinadas para si'],
      ['Ação', 'Absorver o impacto em vez de empurrar'],
      ['Resultado', 'A bola cai suavemente no seu campo para ser jogada'],
      ['Quando', 'Quando está atrasado ou mal posicionado'],
    ],
  },
  {
    name: 'O bloco por zonas',
    objectif: 'Tirar zonas de ataque específicas',
    points: [
      ['Posição', 'Bloquear uma zona específica (linha ou diagonal)'],
      ['Ação', 'Inclinar as mãos para a zona que quer proteger'],
      ['Tática', 'Forçar o atacante a rematar para uma zona onde os seus defensores estão prontos'],
      ['Quando', 'De acordo com a sua defesa de zona de defesa'],
    ],
  },
  {
    name: 'O bloco a 2 ou 3 (bloco coletivo)',
    objectif: 'Criar uma muralha impenetrável',
    points: [
      ['Coordenação', 'Saltar juntos no mesmo momento'],
      ['Colocação', 'Os bloqueadores das pontas posicionam-se em relação ao central'],
      ['Mãos', 'Juntar as mãos com os colegas (sem espaço)'],
      ['Comunicação', 'Um bloqueador chama "linha" ou "diagonal" para coordenar'],
    ],
  },
];

const TIMING_TIPS = [
  ['O exercício do "um-dois"', `No treino, dizer "UM" quando o atacante salta, "DOIS" quando salta. Isto cria o atraso necessário.`],
  ['Observar os ombros', "A orientação dos ombros do atacante indica a direção do remate."],
  ['Ler o passe', 'Um passe alto = mais tempo. Um passe colado = reação rápida.'],
  ['Colocar-se cedo', 'Mais vale estar pronto à espera do que correr no último momento.'],
  ['Trabalhar a impulsão', 'Quanto mais alto saltar, mais margem de erro tem no timing.'],
];

const SAUT_POSITION = [
  'Pés à largura dos ombros',
  'Peso na base dos dedos dos pés',
  'Joelhos ligeiramente fletidos',
  'Braços ao longo do corpo ou ligeiramente à frente',
  'Posição a cerca de 30–50 cm da rede',
];

const SAUT_IMPULSION = [
  ['Passo lateral', 'Se precisar de se deslocar, usar um passo lateral rápido'],
  ['Flexão', 'Fletir as pernas rapidamente (sem ir demasiado baixo)'],
  ['Balanço dos braços', 'Balançar os braços para cima de forma explosiva'],
  ['Extensão completa', 'Estender totalmente as pernas para maximizar a altura'],
];

const SAUT_EN_LAIR = [
  'Manter os braços estendidos e juntos',
  'Mãos bem abertas, dedos estendidos e afastados',
  'Penetrar por cima da rede (sem tocar na rede!)',
  'Travar o tronco para manter a estabilidade',
];

const ERREURS = [
  ['Saltar cedo demais', 'Desce quando o atacante remata — esperar mais!'],
  ['Olhar para a bola', 'Perde informação sobre o atacante — olhar para o jogador!'],
  ['Mãos moles', 'A bola volta para o seu campo — rigidificar e travar os dedos!'],
  ['Saltar para a frente', 'Toca na rede — saltar na vertical!'],
  ['Baixar os braços cedo demais', 'Manter os braços em cima até aterrar.'],
];

const EXERCICES = [
  {
    title: 'Timing com um parceiro',
    desc: 'Um parceiro finge atacar (sem bola). Trabalha apenas no timing do salto. Repetir 20 vezes.',
  },
  {
    title: 'Bloco sobre ataque fixo',
    desc: 'Um atacante remata a partir de uma posição fixa. Concentrar-se no timing e na técnica. Aumentar progressivamente a velocidade.',
  },
  {
    title: 'Leitura dos ombros',
    desc: 'O atacante varia os remates (linha/diagonal). Tentar ler-lhe os ombros para antecipar a direção.',
  },
  {
    title: 'Deslocamento + bloco',
    desc: 'Trabalhar deslocamento lateral rápido seguido de bloco. Simula situações de jogo.',
  },
];

const CONSEILS_PRO = [
  ['Paciência', 'O bloco é uma das técnicas mais difíceis. Seja paciente consigo próprio.'],
  ['Repetição', 'A memória muscular constrói-se com centenas de repetições.'],
  ['Vídeo', 'Filme-se para analisar o seu timing e a sua técnica.'],
  ['Ver profissionais', 'Veja como os jogadores profissionais leem o jogo e cronometram os saltos.'],
  ['Começar simples', 'Dominar o bloco contra ataques lentos antes de passar a ataques rápidos.'],
];

export default function GuideContrePt() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="BOLA → DISTRIBUIDOR → BOLA → OMBRO DO ATACANTE → SALTO → PENETRAÇÃO POR CIMA DA REDE">
        Com prática regular e atenção particular ao timing, vai melhorar significativamente os seus blocos. Um bloco bem cronometrado com impulsão média é melhor do que um salto muito alto mas mal cronometrado.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>Os fundamentos do bloco</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            O bloco é um gesto defensivo crucial que pode tornar-se uma arma ofensiva.
            A chave está num <strong style={{ color: 'var(--orange)' }}>timing perfeito</strong> e numa boa leitura do jogo.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing: a chave do sucesso</h2>
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
        <h2 style={S.section}>Os diferentes tipos de bloco</h2>
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
        <h2 style={S.section}>Dicas para melhorar o seu timing</h2>
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
        <h2 style={S.section}>Sequência visual de elite</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>Os melhores bloqueadores não olham para a bola — seguem uma sequência precisa:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['BOLA', 'DISTRIBUIDOR', 'BOLA', "OMBRO DO ATACANTE"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. BOLA', 'Ver a bola a viajar para o distribuidor'],
              ['2. DISTRIBUIDOR', "Ler as mãos do distribuidor no momento do contacto — direção do passe"],
              ['3. BOLA', 'Seguir brevemente a bola para confirmar a direção'],
              ['4. OMBRO DO ATACANTE', "Fixar-se no ombro do atacante — denuncia a direção do remate antes do contacto"],
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
        <h2 style={S.section}>Timing preciso por tipo de ataque</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de ataque</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Timing do salto do bloqueador</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1.º tempo (central)', 'COM ou uma fração antes do atacante (commit block)'],
                ['Shoot / 2.º tempo da ponta', '~0,1s depois do atacante'],
                ['Bola alta da ponta (3.º tempo)', '0,2–0,3s depois do atacante'],
                ['Passe colado à rede', 'COM o atacante'],
                ['Passe afastado da rede', '~0,5s depois, ou não saltar'],
                ['Slide (central)', 'COM ou logo a seguir — seguir lateralmente'],
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
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>O bloqueador espera pela decisão do distribuidor, lê a bola e o atacante e depois desloca-se. Posição "bunch read" (todos próximos do centro, depois explodir para a antena).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Estável e presente na maioria dos passes', 'Preserva ancas e joelhos', 'Adaptado a todos os níveis amadores'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — avançado/pro</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>O central decide ANTES de o distribuidor soltar a bola saltar com o quick. Anula o ataque rápido adversário, mas se o distribuidor passar para outro lado, o central fica completamente fora da jogada.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Eficaz contra centrais dominantes', 'Alto risco se o distribuidor se adaptar', 'Reservado a jogadores com excelente leitura'].map((pt, i) => (
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
        <h2 style={S.section}>Técnica de salto para o bloco</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Posição inicial', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'A chamada', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'No ar', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
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
        <h2 style={S.section}>Erros comuns a evitar</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Erros comuns</div>
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
        <h2 style={S.section}>Exercícios de treino</h2>
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
        <h2 style={S.section}>Conselhos de pro</h2>
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
        <h2 style={S.section}>Recursos em vídeo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Aprender a bloquear (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'O bloco em voleibol (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Exercício: saltar para bloquear', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Exercício: bloquear um ataque', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
