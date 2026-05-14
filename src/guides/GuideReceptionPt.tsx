import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'A superfície de contacto ideal situa-se entre 2,5 e 15 cm acima dos pulsos.'],
  ['Cup and fold', "Técnica recomendada: um punho fechado, a outra mão envolve por cima — polegares paralelos, apontados para baixo."],
  ['Polegares para baixo', "Apontar os polegares para o chão roda os antebraços para fora e tensiona a manchete."],
  ['Nunca entrelaçar', 'NUNCA entrelaçar os dedos num serviço potente — risco de fratura.'],
  ["Ângulo dita a direção", '"A bola vai para onde a manchete olha" — para uma receção profunda: manchete a 45°; para uma receção curta: manchete mais paralela ao chão.'],
];

const STEPS = [
  'Ler o servidor: identificar o tipo de serviço antes do contacto.',
  "Posição base com os braços separados (NÃO já unidos).",
  'Ler a trajetória no momento em que o adversário bate na bola.',
  'Deslocar-se (passos laterais), chegar ATRÁS da bola antes de juntar os braços.',
  'Construir a manchete cedo: juntar as mãos quando a bola chega, não demasiado cedo.',
  'FREEZE: parar completamente mesmo antes do contacto, peso no pé da frente — manter 1-2 segundos.',
  'Contacto no sweet spot, ombros orientados para o distribuidor-alvo.',
  'Acompanhamento: ancas e ombros avançam para o alvo — sem balanço dos braços.',
];

const DISPLACEMENTS = [
  {
    name: 'Lateral (passos laterais)',
    desc: 'O pé do lado da bola sai primeiro. Passos laterais sem cruzar, ancas baixas. Chegar atrás da bola, reorientar-se para o alvo, freeze + manchete no último momento. Para distâncias longas: passos cruzados e depois pivot.',
  },
  {
    name: 'Para a frente (bola curta)',
    desc: 'Para serviços curtos ou amortis. Termina muitas vezes num avanço (lunge): joelho a descer para o chão, manchete colocada à frente do joelho da frente.',
  },
  {
    name: 'Para trás (drop step)',
    desc: "Pivotar o pé e depois passo lateral para trás. NUNCA correr para trás (perda de equilíbrio). Se for tarde demais para recuar: pivotar e criar uma manchete para o lado.",
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
      name: 'Sistema em W — 5 recebedores',
      level: 'Iniciante',
      desc: '3 jogadores na linha da frente, 2 na segunda — todos exceto o distribuidor participam. Forma histórica que dá nome à "W-formation" (FIVB, USAV IMPACT).',
      pros: ['Zonas reduzidas por jogador (~1,8 m de corredor)', 'Pouca comunicação necessária', 'Ideal para escola de voleibol e sub-13 / sub-15'],
      cons: ['Muitas zonas de sobreposição entre 5 jogadores', 'Recebedores fracos obrigados a participar', 'Desorganiza os atacantes (3 jogadores da frente em receção)'],
    },
    {
      name: 'Sistema em U — 3 recebedores',
      level: 'Padrão moderno',
      desc: 'Líbero na zona 6 (o alvo principal dos servidores), pontas nas zonas 5 e 1. Os 3 melhores recebedores assumem todas as bolas, todos os atacantes da frente saem.',
      pros: ['Comunicação simplificada a 3 jogadores', 'Os 3 melhores recebedores cobrem tudo', 'Atacantes da frente livres para a sua corrida de balanço'],
      cons: ['Zonas laterais mais largas a cobrir (~3 m por jogador)', 'Exige um líbero de alto nível', 'Vulnerável a serviços curtos para os cantos'],
      recommended: true,
    },
    {
      name: 'Receção a 2 — líbero + R4',
      level: 'Elite',
      desc: 'Apenas 2 recebedores (líbero + um R4 selecionado) cobrem toda a largura. Usado ao mais alto nível para libertar a 2ª R4 e mantê-la fresca para o ataque, sem desgaste de receção.',
      pros: ['Todos os atacantes disponíveis para a transição ofensiva', 'Melhor bloco/ataque porque os atacantes não estão desgastados pela receção', 'Sistema preferido pelas equipas profissionais (Polónia, França, Itália)'],
      cons: ['Exige 2 recebedores muito atléticos (~4,5 m de corredor cada)', 'Sem margem para erro — um serviço mal lido = ponto adversário', 'Inutilizável sem um líbero de nível internacional'],
    },
  ],
  5: [
    {
      name: 'Receção a 3 — disposição 2F-3B',
      level: 'Recomendado',
      desc: 'Os 3 jogadores da zona de defesa (P5, P6, P1) recebem. O distribuidor em P1 sai da receção e penetra no momento em que o servidor faz contacto, tal como no 5-1 em 6v6. Os 2 jogadores da frente (P4, P3) ficam livres para a corrida de balanço.',
      pros: ['Disposição mais próxima do 5-1 6v6 (pedagogicamente ideal)', 'Boa transição receção → ataque', '2 atacantes da frente + pipe da zona de defesa possível'],
      cons: ['3 recebedores em 9 m (~3 m por jogador)', 'O distribuidor tem de ler rápido e decidir penetrar em < 1 segundo', 'Buraco em P1 se o distribuidor sair cedo demais'],
      recommended: true,
    },
    {
      name: 'Receção a 4 — disposição 3F-2B',
      level: 'Padrão',
      desc: 'Os 2 jogadores da zona de defesa (P5, P1) + 2 da frente (tipicamente P4 e P3 — o distribuidor em P2 sai) recebem. O distribuidor fica no alvo: sem penetração, distribuição imediata.',
      pros: ['Zonas reduzidas (~2,25 m por jogador)', 'Ideal para equipas mistas ou iniciantes', 'Distribuidor já no alvo — sem transição'],
      cons: ['Apenas 2 atacantes disponíveis à frente (P4 + P3 ou P4 + central)', 'Os jogadores da frente que recebem têm depois de fazer a corrida de balanço', 'Bloco a 2 difícil porque o distribuidor sobe à rede'],
    },
    {
      name: 'Receção em pentágono — 4 ou 5 jogadores',
      level: 'Iniciante / recreativo',
      desc: '5 recebedores (equivalente do W de 5 jogadores). 1 jogador ao centro junto à rede (muitas vezes um distribuidor dedicado), as 2 pontas no meio, os 2 da zona de defesa na zona profunda. Todos participam a menos que o jogador central seja um distribuidor dedicado.',
      pros: ['Cobertura uniforme do campo', 'Exigência técnica muito baixa', 'Adequado a sessões introdutórias'],
      cons: ['Muitas sobreposições com 5 recebedores', 'Nenhum atacante é libertado', 'Ineficaz assim que o nível sobe'],
    },
  ],
  4: [
    {
      name: 'Diamante (3 recebedores)',
      level: 'Padrão 4v4',
      desc: 'Distribuidor ao centro da rede (P3, fora da receção). As 2 pontas (P4, P2) a meio-campo + o único jogador da zona de defesa (P1) na zona profunda recebem. Formação mais comum no voleibol indoor 4v4 (college intramurals).',
      pros: ['Distribuidor já no alvo — sem penetração', '3 zonas claras e simétricas', 'Ideal para intramurals, jogo recreativo, praia 4s'],
      cons: ['Cobrir 9 m de largura com 3 = ~3 m por jogador', 'O único jogador da zona de defesa tem de defender toda a zona profunda depois da receção', 'Apenas 2 atacantes à frente'],
      recommended: true,
    },
    {
      name: 'Linha 3-1 (3 recebedores)',
      level: 'Intermédio',
      desc: 'Distribuidor único em P1 (zona de defesa) que penetra no momento em que o serviço adversário é contactado, em direção à zona 2. Os 3 atacantes da frente (P4, P3, P2) recebem. Equivalente simplificado do 5-1 6v6.',
      pros: ['3 atacantes à frente em qualquer momento', 'Pedagogicamente útil para preparar o 5-1 6v6', 'O distribuidor também pode atacar depois de distribuir'],
      cons: ['Exige uma receção muito limpa (a penetração não perdoa)', 'Buraco em P1 se o distribuidor sair antes de a bola ser defendida', 'Todos os atacantes têm de saber receber'],
    },
    {
      name: 'Caixa 2-2 (4 recebedores)',
      level: 'Iniciante',
      desc: '2 jogadores da frente (P4, P2) + 2 da zona de defesa (P5, P1), sem distribuidor dedicado junto à rede. O jogador melhor posicionado faz o 2.º toque. Típico de sessões introdutórias ou sub-11 / sub-13.',
      pros: ['Cobre todo o campo (4 zonas de 2,25 m)', 'Sem exigência técnica sobre o distribuidor', 'Todos recebem — muito educativo'],
      cons: ['Sem distribuidor dedicado — distribuição aleatória', 'Nenhum atacante é libertado para a corrida de balanço', 'Ineficaz assim que o nível sobe'],
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
      title: 'Distribuidor na ZONA DE DEFESA (P1 / P6 / P5) — rotações P1, P6, P5 do 5-1',
      bullets: [
        'Sai da receção: nenhuma bola lhe é dirigida.',
        'Inicia numa posição especial (ex.: P1: ~7,5 m da rede, 1 m da linha lateral), escondido atrás de outro jogador (stack).',
        'Penetra em direção ao alvo (entre Z2 e Z3, ~1 m da rede, 3 m à direita do centro) NO MOMENTO EM QUE O ADVERSÁRIO BATE NO SERVIÇO — não antes (falta de overlap).',
        'P1: penetração mais curta; P6: penetração central; P5: penetração mais longa (diagonal).',
        '3 atacantes à frente disponíveis (R4 + central + oposto) + ataques da zona de defesa.',
      ],
    },
    {
      title: 'Distribuidor na FRENTE (P2 / P3 / P4) — rotações P2, P3, P4 do 5-1',
      bullets: [
        'Sai da receção: já está perto do alvo.',
        'Em P2: já no alvo — torna-se também bloco da linha contra o R4 adversário na Z4 (dupla carga defensiva).',
        'Em P3: troca lateral em direção ao alvo imediatamente após o contacto do serviço.',
        'Em P4: atravessa toda a rede para chegar ao alvo (o deslocamento mais longo da frente).',
        'Apenas 2 atacantes à frente (compensado por um pipe em P6 e um ataque da zona de defesa pelo oposto em P1).',
      ],
    },
  ],
  5: [
    {
      title: 'Distribuidor com PENETRAÇÃO (disposição 2F-3B, recomendado)',
      bullets: [
        'Inicia em P1, zona de defesa, sai da receção.',
        'Penetra em direção ao alvo (Z2/Z3, ~1 m da rede) NO MOMENTO em que o serviço adversário é contactado — idêntico ao 5-1 6v6.',
        'Os 3 jogadores da zona de defesa (P5 + P6 + P1 a sair) cobrem a receção a 3.',
        'Deve esperar que a bola seja defendida antes de sair (erro comum: saída antecipada → buraco em P1).',
      ],
      note: 'Disposição mais próxima do 6v6 — recomendada para preparar a transição.',
    },
    {
      title: 'Distribuidor FIXO na FRENTE (disposição 3F-2B ou pentágono)',
      bullets: [
        'Fica no alvo (P2 ou P3 conforme a disposição): sem penetração.',
        'Sai da receção: nenhuma bola lhe é dirigida.',
        'Distribuição imediata assim que o passe chega — sem transição.',
        'Em P2: torna-se também bloco da linha contra a ponta adversária (como no 5-1 6v6).',
      ],
    },
  ],
  4: [
    {
      title: 'Distribuidor na FRENTE em diamante (P3 ao centro da rede)',
      bullets: [
        'Fica no alvo (Z3, ~1 m da rede): sem penetração.',
        'Sai da receção: os outros 3 (2 pontas + 1 fundo) recebem.',
        'Distribuição rápida para Z4 ou Z2 conforme a qualidade do passe.',
        'A sua transição defesa → passe tem de ser executada em menos de 2 segundos (apenas 1 jogador na zona de defesa = muita cobertura).',
      ],
      note: 'Formação mais usada no voleibol indoor 4v4.',
    },
    {
      title: 'Distribuidor com PENETRAÇÃO em linha 3-1 (P1 zona de defesa)',
      bullets: [
        'Inicia em P1, zona de defesa, sai da receção.',
        'Penetra em direção à zona 2 no momento em que o serviço adversário é contactado.',
        'Os 3 atacantes da frente (P4, P3, P2) recebem.',
        'Exige uma receção muito limpa — caso contrário o distribuidor não chega ao alvo a tempo.',
      ],
    },
    {
      title: 'Sem distribuidor dedicado (caixa 2-2)',
      bullets: [
        'O jogador melhor posicionado depois do 1.º toque faz o 2.º toque.',
        'Todos recebem — 4 zonas de ~2,25 m.',
        'Distribuição aleatória para um dos outros 3 jogadores.',
        'Reservar para sessões introdutórias (sub-11 / sub-13, escola).',
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
    title: 'O líbero — peça central da receção em 6v6',
    text: 'Especialista defensivo com camisola de cor contrastante. Substitui sistematicamente os centrais quando estes rodam para a zona de defesa (substituições ilimitadas, não contabilizadas pela Regra 19 da FIVB). Joga 3 rotações consecutivas em Z5-Z6-Z1. Posição de receção preferida: Z6 (o alvo principal dos servidores) ou Z5. Restrições FIVB: sem bloco, sem ataque acima da rede, sem passe de cima à frente da linha dos 3 m se um companheiro atacar depois acima da rede.',
    accent: 'orange',
  },
  5: {
    title: 'Sem líbero oficial em 5v5',
    text: 'O voleibol indoor 5v5 não tem regulamentação FIVB. Na prática, nenhuma federação permite líbero neste formato. O melhor recebedor é colocado em P6 ou P5 e joga sistematicamente na zona de defesa — torna-se o "líbero de facto" sem a camisola contrastante nem as restrições. Pode portanto bloquear e atacar se necessário.',
    accent: 'teal',
  },
  4: {
    title: 'Sem líbero em 4v4',
    text: 'Não é permitido líbero ao abrigo das regras 4v4 (college intramurals, jogo educativo da FFVb, praia 4s). O único jogador da zona de defesa em diamante — ou o distribuidor com penetração em linha 3-1 — assume o papel de melhor recebedor/defensor. Com ~3 m de corredor por recebedor em diamante, a antecipação importa mais do que a técnica.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Por baixo', 'Postura normal, receber a bola alto'],
  ['Float apoiado', "Postura alta, avançar para receber cedo antes de a bola desviar"],
  ['Topspin', 'Postura baixa, pronto a recuar, manchete inclinada'],
  ['Jump float', 'Pode ser jogado de cima a 4 m da rede'],
  ['Jump topspin', 'Postura baixa, recuo antecipado, manchete passiva e rígida'],
  ['Serviço híbrido', 'Manchete pronta para ambos os cenários (float ou topspin)'],
];

const READING_CUES = [
  'Posição do servidor na linha → ângulo preferido',
  'Altura e colocação do lançamento: alto+atrás → topspin; baixo+à frente → float',
  "Comprimento da corrida: longa → jump topspin; curta → jump float",
  'Direção dos ombros do servidor no contacto → direção da bola',
];

const ERRORS_COMMON: [string, string][] = [
  ['Braços a oscilar', 'Causa n.º 1 — braços a oscilar no contacto, bola imprevisível. Solução: "a manchete é passiva, as pernas são ativas".'],
  ['Manchete partida', "Um antebraço mais alto do que o outro — bloquear os cotovelos e empurrar os polegares para baixo."],
  ['Braços juntos cedo demais', "Atrasa o movimento e impede a escolha tardia entre manchete e mãos. Juntar as mãos apenas à chegada."],
  ['Tronco demasiado direito', "A manchete passa por baixo da bola → a bola acaba longe da rede. Inclinar 30-45° para a frente."],
  ['Contacto acima do umbigo', 'Demasiado alto = controlo reduzido. Visar contacto à altura da cintura ou abaixo.'],
  ['Sem freeze', "Ainda em movimento no contacto = impossível controlar a direção. Parar completamente."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Líbero mal posicionado', 'Demasiado central perde serviços curtos para os cantos; demasiado lateral abandona o centro. Alvo de referência: Z6 alinhado com o servidor adversário.'],
    ['Overlap do distribuidor', 'O distribuidor sai da sua posição antes de o adversário contactar o serviço — falta n.º 1 no 5-1 (Regra 7.4 da FIVB). Os pés devem respeitar as relações frente/trás até ao contacto.'],
    ['Receção a 5 sem papéis claros', 'Num W, os 3 jogadores da frente interferem na zona central. Definir explicitamente quem fica com a bola entre P3 e P6 nos serviços pelo meio.'],
  ],
  5: [
    ['Distribuidor a sair cedo demais', 'Na disposição 2F-3B com distribuidor a penetrar, sair antes de a bola ser defendida = buraco em P1. Esperar pela confirmação.'],
    ['2 recebedores lado a lado', 'Na disposição 3F-2B, P5 e P1 têm de estar espaçados (um de cada lado). Centrados juntos = linhas laterais expostas.'],
    ['Recebedor da frente que esquece o ataque', 'Na disposição 3F-2B, o jogador da frente que recebe tem depois de fazer a corrida de balanço para atacar — reflexo a treinar especificamente.'],
    ['Sem líbero de facto definido', 'Sem um papel claro, os 3 jogadores da zona de defesa empurram a responsabilidade uns para os outros. Designar explicitamente o melhor recebedor como prioridade na zona central.'],
  ],
  4: [
    ['Distribuidor de diamante que recebe', 'Num diamante, o distribuidor em P3 tem de SAIR da receção — caso contrário é impossível distribuir depressa. Os outros 3 ficam com a bola.'],
    ['Único jogador de fundo sobrecarregado', 'Num diamante, o P1 da zona de defesa cobre sozinho ~3,5 m de campo profundo. Antecipação = competência n.º 1; passos laterais constantes e leitura precoce.'],
    ['Caixa 2-2 sem chamada no 2.º toque', 'Sem distribuidor dedicado, quem passa? Gritar "MINHA!" no 2.º toque assim que a receção acontece é inegociável.'],
    ['Pontas do diamante em linha reta', 'P4 e P2 a meio-campo ao mesmo nível que P1 → o ataque curto e diagonal cai entre eles. Escalonar as posições.'],
  ],
};

const VIDEOS = [
  { title: 'Como fazer manchete (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'O passe de antebraços (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Manchete controlada para o distribuidor', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Aprender receção alta e baixa (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Aquecimento individual de passe de antebraços', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionPt() {
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
        O passe de antebraços determina 60% do sucesso ofensivo de uma equipa. Sem boa receção, não há ataque rápido. A manchete é passiva — as pernas são ativas.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Formato de jogo</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          Os <strong>sistemas de receção</strong>, o <strong>papel do distribuidor</strong> e os <strong>erros comuns</strong> abaixo adaptam-se ao formato escolhido.
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
        <h2 style={S.section}>Posição base</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Pés ligeiramente mais afastados que os ombros, um pé um pouco à frente',
              "Joelhos fletidos para o interior dos pés, ancas baixas, tronco inclinado 30-45°",
              'Costas direitas, peso na base dos dedos dos pés (calcanhares ligeiramente aliviados mas não levantados)',
              'Braços SEPARADOS (não unidos), fletidos a 90-145°, à altura da cintura',
              'Olhos no servidor desde o momento do lançamento',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Erro principal: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>ter os braços já unidos em manchete antes de a bola chegar — atrasa o movimento e impede a escolha tardia entre manchete e mãos.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>A manchete</h2>
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
        <h2 style={S.section}>Execução — passos-chave</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>O freeze: </strong>
          "Pose para a fotografia" — ficar completamente imóvel durante 1-2 segundos após o contacto. A 50-90 km/h, um defensor em movimento não consegue ajustar o seu ângulo. Imóvel, pode mover-se em qualquer direção.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Deslocamentos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Manchete a um braço — emergência</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Recurso de último momento quando a bola está demasiado longe para os dois braços. Braço estendido, manchete plana no antebraço interno, sem balanço — apenas uma estocada para desviar a bola para cima. Variantes: one-arm stab (punho num remate potente), one-arm scoop (palma aberta virada para cima, bola baixa).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Sistemas de receção — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Formato não oficial FIVB</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "O voleibol indoor 5v5 não tem regulamentação dedicada da FIVB ou FFVb. Os sistemas abaixo são adaptações lógicas do 5-1 6v6 documentadas pela VolleyballXL, The Art of Coaching Volleyball e Volleyball Canada."
                : "O voleibol indoor 4v4 não tem regulamentação oficial FIVB. As formações abaixo vêm dos college intramurals (EUA), dos manuais educativos da FFVb / Volleyball Canada e da literatura de praia (Brandon Joyner, Better at Beach)."}
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
                <div style={S.labelTeal}>Vantagens</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Desvantagens</div>
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
        <h2 style={S.section}>Papel do distribuidor na receção — {teamSize}v{teamSize}</h2>
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
        <h2 style={S.section}>O líbero — receção especializada</h2>
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
        <h2 style={S.section}>Ler o serviço para se posicionar</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Tipo de serviço</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Ajuste do recebedor</th>
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
          <div style={S.labelTeal}>Sinais antes do contacto do servidor</div>
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
        <h2 style={S.section}>Erros comuns</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Erros técnicos (todos os formatos)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Erros específicos do {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

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
