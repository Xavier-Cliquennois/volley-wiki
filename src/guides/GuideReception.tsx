import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'La surface de contact idéale se situe entre 2,5 et 15 cm au-dessus des poignets.'],
  ['Cup and fold', "Technique recommandée : un poing fermé, l'autre main qui enveloppe par-dessus — pouces parallèles pointés vers le bas."],
  ['Pouces vers le bas', "Le fait de pointer les pouces vers le sol fait pivoter les avant-bras vers l'extérieur et resserre la plateforme."],
  ['Ne jamais entrelacer', 'Ne JAMAIS entrelacer les doigts sur un service puissant — risque de fracture.'],
  ["L'angle commande", '"Le ballon va où la plateforme regarde" — pour réception profonde : plateforme à 45° ; réception courte : plateforme plus parallèle au sol.'],
];

const STEPS = [
  'Lire le serveur : identifier le type de service avant le contact.',
  "Ready position bras dissociés (NON joints à l'avance).",
  'Lire la trajectoire dès la frappe adverse.',
  'Se déplacer (pas chassés), arriver DERRIÈRE le ballon avant que les bras se joignent.',
  'Build the platform early : joindre les mains quand le ballon arrive, pas trop tôt.',
  'FREEZE : se figer juste avant le contact, poids sur le pied avant — maintenir 1-2 secondes.',
  'Contact sur le sweet spot, épaules orientées vers le passeur cible.',
  'Suivi : bassin et épaules avancent vers la cible — pas de swing des bras.',
];

const DISPLACEMENTS = [
  {
    name: 'Latéral (pas chassés)',
    desc: 'Pied du côté du ballon part en premier. Pas chassés sans croiser, hanches basses. Arriver derrière la balle, se réorienter vers la cible, freeze + plateforme au dernier moment. Pour grandes distances : pas croisés puis pivot.',
  },
  {
    name: 'Avant (balle courte)',
    desc: 'Pour services courts ou tips. Se termine souvent par une fente avant (lunge) : genou collapse vers le sol, plateforme placée en avant du genou avant.',
  },
  {
    name: 'Arrière (drop step)',
    desc: "Pivoter le pied puis pas chassés arrière. JAMAIS courir en marche arrière (perte d'équilibre). Si trop tard pour reculer : pivoter et créer une plateforme sur le côté.",
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
      name: 'Système W — 5 réceptionneurs',
      level: 'Débutant',
      desc: '3 joueurs en première ligne, 2 en seconde — tout le monde sauf le passeur participe. Forme historique d\'où vient le nom « W-formation » (FIVB, USAV IMPACT).',
      pros: ['Zones réduites par joueur (~1,8 m de couloir)', 'Peu de communication requise', 'Idéal école de volley et U13-U15'],
      cons: ['Nombreuses zones de chevauchement entre 5 joueurs', 'Mauvais réceptionneurs forcés à participer', 'Désorganise les attaquants (3 avants en réception)'],
    },
    {
      name: 'Système U — 3 réceptionneurs',
      level: 'Standard moderne',
      desc: 'Libéro en zone 6 (cible principale des serveurs), ailiers en zones 5 et 1. Les 3 meilleurs réceptionneurs prennent toutes les balles, tous les attaquants front-row sortent.',
      pros: ['Communication simplifiée à 3', 'Les 3 meilleurs réceptionneurs couvrent tout', 'Attaquants front-row libres pour leur course d\'élan'],
      cons: ['Zones latérales plus larges à couvrir (~3 m par joueur)', 'Nécessite un libéro performant', 'Vulnérable aux services courts dans les angles'],
      recommended: true,
    },
    {
      name: 'Réception à 2 — libéro + R4',
      level: 'Élite',
      desc: 'Seulement 2 réceptionneurs (libéro + un R4 sélectionné) couvrent toute la largeur. Utilisé en haut niveau pour libérer le 2ᵉ R4 et le préparer à l\'attaque sans fatigue de réception.',
      pros: ['Tous les attaquants disponibles pour la transition offensive', 'Bloc/attaque plus performants car les attaquants ne sont pas usés par la réception', 'Système privilégié par les équipes pros (Pologne, France, Italie)'],
      cons: ['Demande 2 réceptionneurs très athlétiques (~4,5 m de couloir chacun)', 'Aucune marge d\'erreur — un service mal lu = point adverse', 'Inutilisable sans libéro de niveau international'],
    },
  ],
  5: [
    {
      name: 'Réception à 3 — config 2F-3B',
      level: 'Recommandé',
      desc: 'Les 3 arrières (P5, P6, P1) réceptionnent. Le passeur en P1 sort de la réception et pénètre dès le contact du serveur, comme en 5-1 du 6v6. Les 2 avants (P4, P3) sont libres pour leur approche.',
      pros: ['Configuration la plus proche du 5-1 6v6 (pédagogiquement idéale)', 'Bonne transition réception → attaque', '2 attaquants devant + pipe back-row possible'],
      cons: ['3 réceptionneurs sur 9 m (~3 m par joueur)', 'Le passeur doit lire vite et décider de pénétrer en < 1 seconde', 'Trou en P1 si le passeur part trop tôt'],
      recommended: true,
    },
    {
      name: 'Réception à 4 — config 3F-2B',
      level: 'Standard',
      desc: 'Les 2 arrières (P5, P1) + 2 avants (typiquement P4 et P3 — le passeur en P2 sort) réceptionnent. Le passeur reste à la cible : pas de pénétration, distribution immédiate.',
      pros: ['Zones réduites (~2,25 m par joueur)', 'Idéal équipes mixtes ou débutantes', 'Passeur déjà à la cible — aucune transition'],
      cons: ['Seulement 2 attaquants disponibles devant (P4 + P3 ou P4 + central)', 'Les avants qui réceptionnent doivent ensuite courir leur approche', 'Bloc à 2 difficile car le passeur monte au filet'],
    },
    {
      name: 'Réception en pentagone — 4 ou 5 joueurs',
      level: 'Débutant / loisir',
      desc: '5 réceptionneurs (équivalent du W à 5 joueurs). 1 joueur au filet centre (souvent passeur fixe), les 2 ailes au milieu, les 2 arrière au fond. Tout le monde participe sauf si le joueur centre est passeur dédié.',
      pros: ['Couverture régulière du terrain', 'Très peu d\'exigence technique', 'Adapté aux séances pédagogiques de découverte'],
      cons: ['Beaucoup de chevauchements à 5', 'Aucun attaquant n\'est libéré', 'Inefficace dès qu\'on monte en niveau'],
    },
  ],
  4: [
    {
      name: 'Diamant (3 réceptionneurs)',
      level: 'Standard 4v4',
      desc: 'Passeur au filet centre (P3, sort de la réception). Les 2 ailes (P4, P2) en milieu de terrain + l\'arrière unique (P1) en fond reçoivent. Formation la plus utilisée en 4v4 indoor (intramurals universitaires).',
      pros: ['Passeur déjà à la cible — aucune pénétration', '3 zones claires et symétriques', 'Idéal intramurals, loisir, beach 4s'],
      cons: ['Couvrir 9 m de largeur à 3 = ~3 m par joueur', 'L\'arrière unique doit défendre tout le fond après la réception', 'Seulement 2 attaquants devant'],
      recommended: true,
    },
    {
      name: 'Ligne 3-1 (3 réceptionneurs)',
      level: 'Intermédiaire',
      desc: 'Passeur unique en P1 (arrière) qui pénètre dès le contact du service adverse vers la zone 2. Les 3 attaquants devant (P4, P3, P2) reçoivent. Équivalent simplifié du 5-1 6v6.',
      pros: ['3 attaquants devant en permanence', 'Pédagogique pour préparer le 5-1 6v6', 'Le passeur peut aussi attaquer après distribution'],
      cons: ['Demande une réception très propre (la pénétration ne pardonne pas)', 'Trou en P1 si le passeur part avant que la balle soit défendue', 'Tous les attaquants doivent savoir réceptionner'],
    },
    {
      name: 'Box 2-2 (4 réceptionneurs)',
      level: 'Débutant',
      desc: '2 avants (P4, P2) + 2 arrières (P5, P1), sans passeur dédié au filet. Le joueur le mieux placé fait la 2ᵉ touche. Typique des séances de découverte ou des U11-U13.',
      pros: ['Couvre tout le terrain (4 zones de 2,25 m)', 'Aucune exigence technique sur le passeur', 'Tout le monde réceptionne — très pédagogique'],
      cons: ['Pas de passeur dédié — distribution aléatoire', 'Aucun attaquant n\'est libéré pour son approche', 'Inefficace dès qu\'on monte en niveau'],
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
      title: 'Passeur ARRIÈRE (P1 / P6 / P5) — rotations P1, P6, P5 du 5-1',
      bullets: [
        'Sort de la réception : aucune balle ne lui est destinée.',
        'Démarre en position spéciale (ex. P1 : ~7,5 m du filet, 1 m de la ligne droite), camouflé derrière un autre joueur (stack).',
        'Pénètre vers la cible (entre Z2 et Z3, ~1 m du filet, 3 m à droite du centre) DÈS LE CONTACT du service adverse — pas avant (faute de chevauchement).',
        'P1 : pénétration la plus courte ; P6 : pénétration centrale ; P5 : pénétration la plus longue (en diagonale).',
        '3 attaquants devant disponibles (R4 + central + pointu) + back-row attacks.',
      ],
    },
    {
      title: 'Passeur AVANT (P2 / P3 / P4) — rotations P2, P3, P4 du 5-1',
      bullets: [
        'Sort de la réception : il est déjà à proximité de la cible.',
        'En P2 : déjà à la cible — devient aussi contreur ligne face au R4 adverse de Z4 (double charge défensive).',
        'En P3 : switch latéral vers la cible immédiatement après le contact du service.',
        'En P4 : traverse tout le filet pour atteindre la cible (le plus long déplacement avant).',
        'Seulement 2 attaquants devant (compensé par pipe en P6 et attaque back-row par le pointu en P1).',
      ],
    },
  ],
  5: [
    {
      title: 'Passeur PÉNÉTRANT (config 2F-3B, recommandé)',
      bullets: [
        'Démarre en P1 arrière, sort de la réception.',
        'Pénètre vers la cible (Z2/Z3, ~1 m du filet) DÈS le contact du service adverse — identique au 5-1 6v6.',
        'Les 3 arrières (P5 + P6 + P1 partant) couvrent la réception à 3.',
        'Doit attendre que la balle soit défendue avant de partir (erreur fréquente : départ prématuré → trou en P1).',
      ],
      note: 'Configuration la plus proche du 6v6 — recommandée pour préparer la transition.',
    },
    {
      title: 'Passeur AVANT FIXE (config 3F-2B ou pentagone)',
      bullets: [
        'Reste à la cible (P2 ou P3 selon la config) : pas de pénétration.',
        'Sort de la réception : aucune balle ne lui est destinée.',
        'Distribution immédiate dès la passe — pas de transition.',
        'En P2 : devient aussi contreur ligne face à l\'aile gauche adverse (comme en 5-1 6v6).',
      ],
    },
  ],
  4: [
    {
      title: 'Passeur AVANT en diamant (P3 centre filet)',
      bullets: [
        'Reste à la cible (Z3, ~1 m du filet) : pas de pénétration.',
        'Sort de la réception : les 3 autres (2 ailes + 1 arrière) reçoivent.',
        'Distribution rapide vers Z4 ou Z2 selon la qualité de la passe.',
        'Sa transition défense → passe doit être exécutée en moins de 2 secondes (1 seul arrière = beaucoup de couverture).',
      ],
      note: 'Formation la plus utilisée en 4v4 indoor.',
    },
    {
      title: 'Passeur PÉNÉTRANT en ligne 3-1 (P1 arrière)',
      bullets: [
        'Démarre en P1 arrière, sort de la réception.',
        'Pénètre vers la zone 2 dès le contact du service adverse.',
        'Les 3 attaquants devant (P4, P3, P2) reçoivent.',
        'Exige une réception très propre — sinon le passeur ne peut pas atteindre la cible à temps.',
      ],
    },
    {
      title: 'Pas de passeur dédié (box 2-2)',
      bullets: [
        'Le joueur le mieux placé après la 1ʳᵉ touche fait la 2ᵉ touche.',
        'Tout le monde réceptionne — 4 zones de ~2,25 m.',
        'Distribution aléatoire vers l\'un des 3 autres joueurs.',
        'À réserver aux séances de découverte (U11-U13, scolaire).',
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
    title: 'Le libéro — pièce maîtresse de la réception en 6v6',
    text: 'Spécialiste défensif en maillot contrastant. Remplace systématiquement les centraux quand ils passent en rotation arrière (substitutions illimitées, non comptées par la Règle FIVB 19). Joue 3 rotations consécutives en Z5-Z6-Z1. Position de réception privilégiée : Z6 (cible principale des serveurs) ou Z5. Restrictions FIVB : pas de contre, pas d\'attaque au-dessus du filet, pas de passe haute (mains) devant la ligne des 3 m si un coéquipier attaque ensuite au-dessus du filet.',
    accent: 'orange',
  },
  5: {
    title: 'Pas de libéro officiel en 5v5',
    text: 'Le 5v5 indoor n\'a pas de règlement FIVB. En pratique, aucune fédération n\'autorise le libéro dans ce format. Le meilleur réceptionneur est placé en P6 ou P5 et joue systématiquement arrière — il devient le « libéro de fait » sans le maillot contrastant ni les restrictions. Il peut donc bloquer et attaquer si nécessaire.',
    accent: 'teal',
  },
  4: {
    title: 'Pas de libéro en 4v4',
    text: 'Aucun libéro autorisé dans les règlements 4v4 (intramurals universitaires, FFVb pédagogique, beach 4s). L\'arrière unique en diamant — ou le passeur pénétrant en ligne 3-1 — assume le rôle de meilleur réceptionneur/défenseur. Avec ~3 m de couloir par réceptionneur en diamant, l\'anticipation prime sur la technique.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Cuillère / underhand', 'Position normale, prendre le ballon haut'],
  ['Float debout', "Position haute, avancer pour le prendre tôt avant qu'il dévie"],
  ['Topspin', 'Position basse, prêt à reculer, plateforme angulée'],
  ['Jump float', 'Peut se traiter en passe haute (overhand) à 4 m du filet'],
  ['Jump topspin', 'Position basse, recul anticipé, plateforme rigide passive'],
  ['Service hybride', 'Plateforme prête pour les deux scénarios (float ou topspin)'],
];

const READING_CUES = [
  'Position du serveur sur la ligne → angle préféré',
  'Hauteur et placement du lancer : haut+arrière → topspin ; bas+devant → float',
  "Longueur de la course d'élan : longue → jump topspin ; courte → jump float",
  'Direction des épaules du serveur au contact → direction de la balle',
];

const ERRORS_COMMON: [string, string][] = [
  ['Swinging arms', 'Cause #1 — bras qui balaient au contact, ballon imprévisible. Correctif : "la plateforme est passive, les jambes sont actives".'],
  ['Plateforme cassée', "Un avant-bras plus haut que l'autre — verrouiller les coudes et pousser les pouces vers le bas."],
  ['Bras joints trop tôt', "Ralentit le déplacement et empêche le choix tardif manchette/mains. Joindre les mains uniquement à l'arrivée."],
  ['Tronc trop droit', "La plateforme passe sous le ballon → balle trop loin du filet. S'incliner à 30-45° vers l'avant."],
  ['Contact au-dessus du nombril', 'Trop haut = contrôle réduit. Viser le contact à hauteur de la taille ou plus bas.'],
  ['Pas de freeze', "Encore en mouvement au contact = direction impossible à contrôler. S'immobiliser complètement."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Libéro mal placé', 'Trop centré il manque les services courts dans les angles ; trop latéral il abandonne le centre. Cible de référence : Z6 axé sur le serveur adverse.'],
    ['Chevauchement passeur', 'Le passeur quitte sa position avant le contact du serveur adverse — faute n°1 en 5-1 (Règle 7.4 FIVB). Ses pieds doivent respecter les relations front/back jusqu\'au contact.'],
    ['Réception à 5 sans rôle clair', 'En W, les 3 avants se gênent dans la zone centrale. Définir explicitement qui prend la balle entre P3 et P6 sur les services axes.'],
  ],
  5: [
    ['Passeur qui part trop tôt', 'En config 2F-3B avec passeur pénétrant, départ avant que la balle soit défendue = trou en P1. Attendre la confirmation.'],
    ['2 réceptionneurs côte à côte', 'En config 3F-2B, P5 et P1 doivent être espacés (un par côté). Centrés ensemble = lignes à découvert.'],
    ['Avant réceptionneur qui oublie d\'attaquer', 'En config 3F-2B, l\'avant qui réceptionne doit ensuite courir son approche d\'attaque — réflexe à drill spécifiquement.'],
    ['Pas de libéro de fait défini', 'Sans rôle clair, les 3 arrières se renvoient la responsabilité. Désigner explicitement le meilleur réceptionneur comme prioritaire en zone centrale.'],
  ],
  4: [
    ['Passeur diamant qui réceptionne', 'En diamant, le passeur en P3 doit SORTIR de la réception — sinon impossible de distribuer rapidement. Les 3 autres prennent.'],
    ['Arrière unique débordé', 'En diamant, l\'arrière P1 couvre ~3,5 m de fond seul. Anticipation = compétence n°1 ; pas chassés constants et lecture précoce.'],
    ['Box 2-2 sans appel sur 2ᵉ touche', 'Sans passeur dédié, qui passe ? Crier "MOI !" sur la 2ᵉ touche dès la réception est non-négociable.'],
    ['Ailes diamant en ligne droite', 'P4 et P2 en milieu de terrain au même niveau que P1 → le cut shot court tombe entre eux. Étager les positions.'],
  ],
};

const VIDEOS = [
  { title: 'Faire une manchette (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'La manchette (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Manchette contrôlée vers le passeur', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Apprendre la réception haute et basse (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Échauffement individuel manchette', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReception() {
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

      {/* Règle d'or */}
      <GoldenRule>
        La manchette détermine 60% du succès offensif d'une équipe. Sans bonne réception, pas d'attaque rapide. La plateforme est passive — les jambes sont actives.
      </GoldenRule>

      {/* Team size selector */}
      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Format de jeu</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          Les <strong>systèmes de réception</strong>, le <strong>rôle du passeur</strong> et les <strong>erreurs fréquentes</strong> ci-dessous s'adaptent au format choisi.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {([6, 5, 4] as const).map(size => (
            <button key={size} onClick={() => setTeamSize(size)} style={teamSize === size ? btnActive : btnBase}>
              {size}v{size}
            </button>
          ))}
        </div>
      </section>

      {/* Ready position */}
      <section>
        <h2 style={S.section}>Position de base (ready position)</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Pieds légèrement plus larges que les épaules, un pied légèrement avancé',
              "Genoux fléchis vers l'intérieur des pieds, hanches basses, tronc incliné à 30-45°",
              'Dos droit, poids sur la plante des pieds (talons légèrement allégés mais pas décollés)',
              'Bras DISSOCIÉS (non joints), fléchis à 90-145°, à hauteur de la taille',
              'Regard sur le serveur dès le lancer du ballon',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Erreur principale : </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>avoir les bras déjà joints en plateau avant que le ballon n'arrive — cela ralentit le déplacement et empêche le choix tardif manchette/mains.</span>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section>
        <h2 style={S.section}>La plateforme</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PLATFORM_TIPS.map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14 }}>
              <span style={S.bullet}>▸</span>
              <span>
                <strong style={{ color: 'var(--ink)', fontFamily: '"DM Sans", sans-serif' }}>{title} : </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Execution steps */}
      <section>
        <h2 style={S.section}>Exécution — étapes clés</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>Le freeze : </strong>
          "Pose for a picture" — se figer complètement 1-2 secondes après le contact. À 50-90 km/h, un défenseur en mouvement ne peut pas ajuster son angle. Immobile, il peut partir dans n'importe quelle direction.
        </div>
      </section>

      {/* Displacements */}
      <section>
        <h2 style={S.section}>Déplacements</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Manchette à une main — urgence</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Geste de dernier recours quand le ballon est trop loin pour deux bras. Bras tendu, plateforme plate sur l'avant-bras intérieur, pas de swing — juste un piqué (stab) pour dévier vers le haut. Variante : one-arm stab (poing sur smash puissant), one-arm scoop (paume ouverte vers le haut, ballon bas).
            </p>
          </div>
        </div>
      </section>

      {/* Systems — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>Systèmes de réception — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Format non officiel FIVB</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "Le 5v5 indoor n'a pas de règlement FIVB ou FFVb dédié. Les systèmes ci-dessous sont des adaptations logiques du 5-1 6v6 documentées par VolleyballXL, The Art of Coaching Volleyball et Volleyball Canada."
                : "Le 4v4 indoor n'a pas de règlement FIVB officiel. Les formations ci-dessous proviennent des intramurals universitaires (USA), des manuels pédagogiques FFVb / Volleyball Canada et de la littérature beach (Brandon Joyner, Better at Beach)."}
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
                <div style={S.labelTeal}>Avantages</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Inconvénients</div>
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

      {/* Passeur role — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>Rôle du passeur en réception — {teamSize}v{teamSize}</h2>
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
                  <strong style={{ color: 'var(--teal)' }}>Note : </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Libero / receiver specialist — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>Le libéro — réception spécialisée</h2>
        <div style={{ ...S.card, borderLeft: `5px solid ${accentColor(liberoNote.accent)}` }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: accentColor(liberoNote.accent), marginBottom: 8 }}>
            {liberoNote.title}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0, lineHeight: 1.65 }}>
            {liberoNote.text}
          </p>
        </div>
      </section>

      {/* Reading the serve */}
      <section>
        <h2 style={S.section}>Lire le service pour se placer</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Type de service</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Adaptation du réceptionneur</th>
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
          <div style={S.labelTeal}>Indices avant le contact du serveur</div>
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

      {/* Errors — common + team-size aware */}
      <section>
        <h2 style={S.section}>Erreurs fréquentes</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Erreurs techniques (tous formats)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Erreurs spécifiques au {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section>
        <h2 style={S.section}>Ressources vidéo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
