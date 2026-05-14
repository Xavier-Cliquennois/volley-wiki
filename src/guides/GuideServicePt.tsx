import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Iniciante': 'var(--mint)',
  'Intermédio': 'var(--yellow)',
  'Avançado': 'var(--orange)',
  'Competição': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Competição': '#fff',
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
    name: 'Serviço por baixo',
    level: 'Iniciante',
    tagline: 'por baixo — movimento pendular abaixo da cintura',
    description: "Movimento pendular do braço que bate na bola abaixo da cintura. Legal em todos os escalões, recomendado para iniciantes ou em caso de lesão no ombro. Praticamente inexistente acima do nível regional adulto.",
    biomechanics: [
      'Cadeia cinética curta: ancas → ombro → braço → mão',
      'Movimento pendular sem rotação do tronco',
      'Transferência de peso: pé de trás → pé da frente',
      'Contacto: talão da mão ou punho fechado abaixo do centro da bola',
    ],
    steps: [
      'Pé esquerdo à frente, peso na perna de trás',
      "Mão esquerda segura a bola à altura da anca, alinhada com o braço que bate",
      'Braço direito armado atrás, palma aberta ou punho fechado',
      'Largar a bola mesmo antes do contacto — não a lançar',
      "Movimento do braço para a frente, bater abaixo do centro da bola",
      'O braço acompanha o movimento e aponta ao alvo, peso transferido para o pé da frente',
    ],
    errors: [
      ['Bola segura demasiado baixo ou descentrada', "Manter a bola à altura da anca, alinhada com o braço que bate"],
      ['Bater com os dedos', 'Usar o talão da mão — superfície mais larga e mais estável'],
      ['Lançar a bola demasiado alto', 'Largar simplesmente a bola, não a lançar para cima'],
      ['Pulso solto', 'Bloquear o braço no contacto para um impacto limpo'],
    ],
    exercises: [
      'Bowling-arcos: apontar a zonas a 4 m da rede',
      "10 serviços a 4 m, depois recuar 1 m por série até à linha de fundo",
      'Alvos de 4x3 m no chão — objetivo de 50% de precisão',
    ],
    videos: [
      { title: 'Serviço por baixo + serviço tipo ténis (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Como servir por baixo', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Serviço flutuante apoiado',
    level: 'Intermédio',
    tagline: 'float apoiado — serviço padrão de 90% dos amadores',
    description: `Serviço sem rotação que produz uma trajetória imprevisível (efeito "knuckleball"). A uma velocidade crítica (~12-13 m/s), vórtices assimétricos criam forças de sustentação laterais aleatórias. Este é o serviço a dominar primeiro.`,
    biomechanics: [
      'Cadeia cinética completa: pernas → ancas → tronco → ombro → cotovelo → mão',
      `Posição em "arco e flecha": cotovelo alto, acima do ombro, mão atrás da orelha`,
      "Pulso BLOQUEADO e firme — requisito absoluto para o efeito float",
      'Contacto: talão da mão no centro da bola',
      `"Punch and freeze": acompanhamento CURTO — a mão para imediatamente depois do contacto`,
    ],
    steps: [
      "Corpo a 45° em relação à rede, pés à largura dos ombros",
      "Braço esquerdo estendido à frente do ombro, bola à altura da cabeça",
      `Lançamento muito curto: "colocar" a bola 30-50 cm acima do ombro — a bola não roda`,
      'O pé esquerdo avança em direção ao alvo logo após colocar a bola',
      'Extensão total do braço no contacto, mão firme e plana',
      'FREEZE: paragem imediata do movimento após o contacto — sem acompanhamento do braço',
    ],
    errors: [
      ['Acompanhamento prolongado do braço', "Causa de falha n.º 1: o acompanhamento adiciona rotação que mata o float — parar de imediato"],
      ['Lançamento demasiado alto', 'A bola cai na rede — lançamento curto, apenas 30-50 cm'],
      ['Lançamento com rotação', 'Induz rotação na bola — colocar a bola, não a lançar'],
      ['Contacto só com a palma', 'Usar o talão da mão (base da palma) para uma superfície plana'],
    ],
    exercises: [
      'Toss & Drop: marcar um ponto no chão, lançar 20 vezes sem bater — objetivo 18/20 no ponto',
      `"Punch and freeze" à parede a 3 m: trabalhar a paragem imediata do movimento`,
      '5 serviços consecutivos sem rotação validados visualmente por um parceiro',
    ],
    videos: [
      { title: 'Serviço float em 4 minutos', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Melhorar o serviço float', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Serviço: float + ténis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Jump float',
    level: 'Avançado',
    tagline: 'jump float — padrão das jogadoras de elite',
    description: "Float com uma corrida curta e salto. Ganha altura de contacto, velocidade e um ângulo de descida mais inclinado. Tornou-se o padrão entre as jogadoras de elite (86% dos serviços no voleibol feminino profissional segundo estudos recentes). Menos arriscado do que o jump topspin, sendo mais perturbador do que o float apoiado.",
    biomechanics: [
      "Corrida curta (2 a 4 passos)",
      'Braços em posição de arco e flecha durante o salto — diferente de um remate em que os braços impulsionam',
      "A corrida fornece a velocidade da bola, não o braço sozinho",
      'Contacto no ponto mais alto, ligeiramente à frente da cabeça',
      'Pulso bloqueado + freeze idênticos ao float apoiado',
    ],
    steps: [
      'Posição 2-3 m atrás da linha, bola na mão esquerda',
      "Passo 1 (direito) como preparação, braços relaxados",
      'Passo 2 (esquerdo): lançar a bola a cerca de 1,5 m de altura, sem rotação',
      'Passo 3 + hop: chamada com os dois pés atrás da linha — braços sobem para a posição de arco e flecha',
      "Salto vertical ligeiramente para a frente, corpo travado",
      'Bater com o braço estendido, talão da mão no centro da bola',
      'FREEZE imediato — aterrar dentro do campo',
    ],
    errors: [
      ['Lançamento demasiado alto', 'Reflexo de jump spin — manter o lançamento curto como no float apoiado'],
      ["Braços a oscilar como num ataque", 'Torna-se um remate com rotação — manter a posição de arco e flecha'],
      ['Acompanhamento prolongado', 'Igual ao float apoiado: o freeze é obrigatório'],
      ['Falta de pé na chamada', "Garantir que a chamada acontece atrás da linha de fundo"],
    ],
    exercises: [
      "Dominar o float apoiado (freeze sólido) antes de adicionar a corrida",
      'Só a corrida sem bater: trabalhar um lançamento estável e baixo',
      'Jump float a velocidade controlada: consistência antes da potência',
    ],
    videos: [
      { title: "Jump float — INF'AUX ENTRAÎNEURS (Bretanha)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + remate (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Jump topspin',
    level: 'Competição',
    tagline: 'jump serve — remate a partir de trás da linha',
    description: `"Remate a partir de trás da linha": bola batida em velocidade máxima com topspin (80-100 km/h em clubes fortes). Maior potencial de ace mas também a maior taxa de erro. Reservado a quem já investiu 1000+ repetições em treino.`,
    biomechanics: [
      "Corrida de 3-4 passos idêntica a um remate de zona de defesa",
      'Lançamento alto (1-1,5 m à frente) com ligeira rotação para a frente induzida',
      'Rotação sequencial: ancas → tronco → ombro → cotovelo → pulso',
      'Zona de contacto às 10-11 horas na bola',
      'Snap completo do pulso para o topspin (~30 rotações/s a nível de elite)',
      'Acompanhamento completo — o oposto do float',
    ],
    steps: [
      'Posição 3-4 m atrás da linha, bola na mão que bate',
      'Passo 1 (direito) + lançamento alto com ligeiro topspin induzido',
      'Passo 2 (esquerdo): aceleração',
      "Passo 3 (direito): passo de potência longo, centro de gravidade a baixar",
      "Passo 4 (esquerdo): chamada, braços sobem com força",
      'Salto explosivo vertical-para a frente',
      'Bater no pico: a mão passa por cima da bola (10 horas), palma e depois dedos a enrolar por cima',
      'Snap completo do pulso + acompanhamento — aterrar 1-2 m dentro do campo',
    ],
    errors: [
      ['Lançamento demasiado baixo ou atrás de si', 'Causa n.º 1 de bola na rede — o lançamento deve ser alto e à frente'],
      ['Lançamento demasiado à frente', 'Falta de pé — respeitar os limites da zona de serviço'],
      ['Falta de snap do pulso', 'A bola voa longa sem rotação para baixo'],
      ['Usá-lo em jogo sem preparação', "1000 repetições em treino primeiro — regra de ouro"],
    ],
    exercises: [
      "Regra de ouro: 1000 repetições em treino antes de usar em jogo",
      'Jump spin "controlado": lançamento mais baixo, velocidade reduzida para apontar a zonas precisas',
      'Filmar o lançamento: 80% dos erros vêm da colocação do lançamento',
    ],
    videos: [
      { title: 'Jump topspin potente + serviço float (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Zona 1 — fundo direito', 'Bloqueia a saída do distribuidor num sistema 5-1'],
  ['Zona 2 — frente curta à direita', 'Quebra a entrada do lado direito, exclui o líbero'],
  ['Zona 3 — frente curta ao centro', 'Bloqueia o central, quebra os ataques rápidos'],
  ['Zona 4 — frente curta à esquerda', "Obriga a ponta principal a receber E atacar"],
  ['Zona 5 — fundo profundo à esquerda', "Diagonal longa, taxa de erro elevada"],
  ['Zona 6 — fundo profundo ao centro', 'Servir longo contra distribuidores mais baixos'],
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

export default function GuideServicePt() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        80% dos erros de serviço vêm do lançamento. Estabilizar o lançamento como prioridade antes de procurar potência.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>TIPOS DE SERVIÇO</h2>
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
            <div style={S.labelTeal}>BIOMECÂNICA-CHAVE</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>PASSOS DE EXECUÇÃO (DESTRO)</div>
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
              <div style={S.labelOrange}>✗ ERROS FREQUENTES</div>
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
              <div style={S.labelTeal}>★ EXERCÍCIOS</div>
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
        <h2 style={S.sectionTitle}>ZONAS-ALVO E TÁTICAS</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>ZONA ADVERSÁRIA</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>EFEITO TÁTICO</th>
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
            ['Costuras', "Apontar ao espaço entre dois recebedores é mais eficaz do que apontar a um jogador — a comunicação do adversário é posta à prova."],
            ['Alternar curto/longo', "Impede o distribuidor de saber quando deve recuar. Um float curto (zonas 2-3-4) atrás da linha de ataque é particularmente perturbador."],
            ['Métrica FBSO%', "Um serviço que reduz o First Ball Side Out adversário de 70% para 45% sem produzir ace é um serviço muito eficaz."],
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
          <div style={{ ...S.label, marginBottom: 16 }}>★ HIERARQUIA DE APRENDIZAGEM</div>
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
            Dominar cada nível antes de passar ao seguinte. <strong>Consistência antes da potência.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
