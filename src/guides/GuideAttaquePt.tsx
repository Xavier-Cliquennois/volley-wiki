import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Iniciante': 'var(--mint)',
  'Iniciante → Intermédio': 'var(--mint)',
  'Intermédio': 'var(--yellow)',
  'Intermédio+': 'var(--orange)',
  'Avançado': 'var(--orange)',
};

const PHASES = [
  ['Iniciação', 'Ler o passe e decidir a corrida de balanço'],
  ['Wind-up', 'Início da corrida de balanço'],
  ['Cocking', 'Cotovelo acima do ombro, mão atrás da orelha — posição de potência'],
  ['Aceleração', 'Rotação sequencial: ancas → tronco → ombro → cotovelo → pulso'],
  ['Contacto + acompanhamento', 'Snap do pulso, a mão "agarra" por cima da bola → topspin'],
];

const APPROACH_3 = [
  ['Passo 1 (esquerdo)', 'Passo direcional curto, orientado para o ataque'],
  ['Passo 2 (direito)', 'Passo de potência — longo e baixo, calcanhar primeiro, a baixar o centro de gravidade'],
  ['Passo 3 (esquerdo)', 'Passo de fecho — curto, trava a translação horizontal e converte-a em vertical'],
];

const APPROACH_4 = [
  ['Passo 1 (direito)', 'Passo de observação, ritmo lento'],
  ['Passo 2 (esquerdo)', 'Aceleração'],
  ['Passo 3 (direito)', 'Passo de potência — o mais importante, longo e baixo'],
  ['Passo 4 (esquerdo)', 'Passo de fecho paralelo à rede'],
];

const TIMING_TABLE: [string, string][] = [
  ['Bola alta (3.º tempo)', 'Arrancar TARDE — quando a bola sai das mãos do distribuidor'],
  ['2.º tempo (Hut/Go)', 'Arrancar quando o passe está a chegar ao distribuidor'],
  ['1.º tempo (Quick)', 'Arrancar CEDO — já no ar quando o distribuidor toca na bola'],
  ['Slide', 'Arrancar no momento em que o distribuidor recebe o passe'],
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
    name: 'Ataque na zona 4 (Ponta / OH)',
    position: 'Ponta esquerda',
    description: `Base da aprendizagem do ataque. A ponta recebe o maior volume de bolas — é a opção de "segurança" do distribuidor. Corrida de balanço a 45° pela esquerda.`,
    keyPoints: [
      'Corrida de 4 passos a ~45° em relação à rede',
      'Chamada a 30-50 cm da rede',
      'Passe "Hut" (3.º tempo alto) ou "Go" (2.º tempo rápido)',
      'Saltar na VERTICAL — não em direção à rede',
      'Contacto ligeiramente à frente do ombro de batida',
    ],
    shots: ['Diagonal', 'Linha (paralela)', 'Cut shot (ângulo fechado <3 m)', 'Amorti', 'Roll shot (topspin off-speed)'],
  },
  {
    id: 'middle',
    name: 'Ataque central (Quick / 1.º tempo)',
    position: 'Central da frente',
    description: 'O ataque mais rápido. O central está no ar ANTES ou no exato momento em que o distribuidor toca na bola. Passe muito baixo (30-50 cm) e muito curto.',
    keyPoints: [
      'Desencadear a corrida de balanço CEDO — já no ar no momento em que o distribuidor solta a bola',
      'Corrida de 2-3 passos, braço já armado durante a subida',
      `Conceito "Ghost Middle": mesmo que a bola não venha, fazer o quick a toda a velocidade para prender o bloco adversário → liberta as pontas`,
      'Contacto 30-50 cm acima da rede',
      'Transição rápida: bloco → corrida de balanço em 1-2 segundos',
    ],
    shots: ['Quick à frente do distribuidor ("1")', 'Back-1 atrás do distribuidor', 'Slide (saída atrás ao longo da rede)', '31/Gap (offset entre distribuidor e antena)'],
  },
  {
    id: 'opposite',
    name: 'Ataque na zona 2 (Oposto)',
    position: 'Ponta direita',
    description: 'O oposto ataca a partir da zona 2. Ideal para esquerdinos (ombro de batida do lado da antena direita = janela máxima). Para destros: rotação do tronco mais pronunciada, posição mais afastada da antena.',
    keyPoints: [
      'Corrida de balanço simétrica à da ponta mas pela direita',
      'Terminar com o polegar para baixo no cut shot',
      'Opção "release" para o distribuidor quando a receção é fraca',
      'Ataque da zona de defesa a partir de P1 (zona D) quando está na zona de defesa',
    ],
    shots: ['Diagonal', 'Linha (paralela)', 'Pipe/D da zona de defesa', 'Cut shot diagonal para a zona 5'],
  },
  {
    id: 'backrow',
    name: 'Ataque da zona de defesa (Pipe)',
    position: 'Central de trás ou direita de trás',
    description: 'Ataque a partir da zona de defesa. A chamada TEM de acontecer ATRÁS da linha dos 3 m. Permite 4 atacantes contra 3 bloqueadores.',
    keyPoints: [
      'Chamada obrigatoriamente atrás da linha dos 3 m (caso contrário, falta)',
      'Aterrar na zona de ataque depois de um salto legal = OK',
      'Pipe: a partir de P6, passe atrás do quick (BIC = mesmo por cima do quick)',
      'Zona D: a partir de P1, muitas vezes um ataque de recurso para o oposto',
    ],
    shots: ['Pipe (central da zona de defesa)', 'Zona D (direita da zona de defesa)', 'Zona A (esquerda da zona de defesa, rara)', 'Amorti num passe mau'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Amorti / Finta',
    level: 'Iniciante → Intermédio',
    desc: 'Corrida de balanço IDÊNTICA à do remate (o disfarce é crucial), depois, no contacto, abrandar o braço e colocar a bola com um toque dos dedos. Direção: zona vazia identificada ANTES do salto.',
  },
  {
    name: 'Roll shot / Topspin off-speed',
    level: 'Intermédio',
    desc: 'Batida a velocidade reduzida (~50-70%) com forte topspin para uma bola que mergulha curta atrás do bloco. Mais difícil de ler do que um amorti porque é mais rápida.',
  },
  {
    name: 'Cut shot / Ângulo fechado',
    level: 'Intermédio+',
    desc: 'Ângulo fechado para a zona 1 (a partir de 4) ou zona 5 (a partir de 2). Terminar com o polegar para baixo, mão a cortar lateralmente pela bola. Bater no lado da bola, não no topo.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermédio+',
    desc: 'Empurrar deliberadamente a bola para fora pelas mãos dos bloqueadores. Num passe colado à rede, saltar na vertical e empurrar a bola lateralmente usando a mão externa do bloqueador como "calha".',
  },
];

const ERRORS = [
  ['Timing da corrida de balanço', 'Cedo demais: novo salto sem potência. Tarde demais: braço esticado atrás no contacto.'],
  ['Ordem de pés errada', 'Terminar sempre em esquerdo-direito (destro) — os dois pés quase em simultâneo.'],
  ['Sem topspin', 'Mão plana = sem snap = bola vai longa. "Agarrar" por cima da bola.'],
  ['Toque na rede', 'Saltar para a frente num passe colado. Saltar na VERTICAL, não para a frente.'],
  ['Falta de zona de defesa', 'Pé sobre ou à frente da linha dos 3 m na chamada.'],
  ['Aterragem num só pé', 'Exceto no slide: aterrar nos dois pés para proteger o joelho (risco de LCA).'],
];

const VIDEOS = [
  { title: 'Como atacar — 3 passos (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'O remate em voleibol (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Corrida de balanço detalhada', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Seb\'s Sequence — tudo sobre o remate', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Saltar para atacar (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Ataques colocados (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaquePt() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="CORRIDA LENTA → RÁPIDA → PASSO DE POTÊNCIA → FECHO → SALTO VERTICAL → BRAÇO ESTENDIDO À FRENTE → SNAP DO PULSO">
        A potência vem da cadeia cinética completa, não só do braço. Uma corrida de balanço rítmica com os dois últimos passos rápidos gera 70% da potência final.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>As 5 fases do remate</h2>
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
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Ligeiramente à frente do ombro de batida, nunca atrás da cabeça (perda de potência + risco de lesão). Distância à rede na chamada: 30-50 cm no mínimo.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Corrida de balanço</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 passos — Iniciante</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Esquerdo-direito-esquerdo (destro)</div>
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
            <div style={S.label}>4 passos — Padrão de competição</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Direito-esquerdo-direito-esquerdo (destro)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Regra de ouro: os dois últimos passos são os mais rápidos — lento → rápido.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing por tipo de passe</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de passe</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Quando iniciar a corrida</th>
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
        <h2 style={S.section}>Tipos de ataque por posição</h2>
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
              <div style={S.labelTeal}>Pontos-chave</div>
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
              <div style={S.label}>Seleção de batidas</div>
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
        <h2 style={S.section}>Batidas especiais</h2>
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
        <h2 style={S.section}>Erros comuns</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Evitar</div>
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
        <h2 style={S.section}>Recursos em vídeo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
