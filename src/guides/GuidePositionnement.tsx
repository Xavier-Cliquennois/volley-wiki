import { useState } from 'react';
import { Court, Player, Zone, Ball, ZoneLabel } from './CourtDiagram';
import { ROLE_COLORS } from '../constants/positions';

type ZoneTab = 'zone4' | 'zone3' | 'zone2';

function Zone4Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={15} y={38} />
        <Zone x={0} y={50} w={28} h={28} type="arriere" posNumber={5} />
        <Zone x={23} y={56} w={35} h={32} type="libero" posNumber={6} />
        <Zone x={58} y={62} w={42} h={38} type="arriere" posNumber={1} />
        <Zone x={70} y={50} w={30} h={24} type="avant" posNumber={2} />
        <ZoneLabel x={8} y={60} label="Zone 5" type="arriere" />
        <ZoneLabel x={38} y={68} label="Zone 6" type="libero" />
        <ZoneLabel x={72} y={80} label="Zone 1" type="arriere" />
        <ZoneLabel x={78} y={60} label="Zone 2" type="avant" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="am" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#eab308" />
            </marker>
            <marker id="aa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <line x1="15" y1="38" x2="75" y2="85" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="15" y1="38" x2="18" y2="65" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="38" x2="40" y2="75" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="38" x2="85" y2="60" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
        </svg>
        <Player x={20} y={53} label="4" sub="BLK" type="avant" />
        <Player x={40} y={53} label="3" sub="BLK" type="avant" />
        <Player x={85} y={75} label="2" sub="DÉF" type="avant" />
        <Player x={15} y={75} label="5" type="arriere" />
        <Player x={38} y={75} label="6" sub="LIB" type="libero" />
        <Player x={85} y={85} label="1" type="arriere" />
      </Court>
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Rôles par poste</div>
        <ul className="space-y-1">
          {[
            ['Postes 4 et 3 (avant)', 'Bloquent au filet pour fermer la diagonale'],
            ['Poste 2 (avant droit)', 'Recule et défend la ligne (attaque longue)'],
            ['Poste 5 (arrière gauche)', 'Avance légèrement, défend les balles courtes derrière le bloc'],
            ['Poste 6 (Libéro)', 'Se décale nettement vers la gauche, défend au centre-gauche'],
            ['Poste 1 (arrière droit)', 'Recule en fond de terrain, défend la diagonale longue'],
          ].map(([label, text], i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span><strong className="text-white">{label} : </strong><span className="text-gray-400">{text}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm space-y-1">
        <div className="text-yellow-400 text-xs uppercase tracking-wider">Quand s'avancer ?</div>
        <div className="text-gray-400">Poste 5 : Avancez légèrement (3–4m) car l'attaquant peut faire des feintes courtes.</div>
        <div className="text-gray-400">Postes 1 et 6 : Restez en retrait (5–7m) pour la défense en profondeur.</div>
        <div className="text-gray-400">Poste 2 : Reculez complètement en défense de ligne.</div>
      </div>
    </div>
  );
}

function Zone3Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={50} y={38} />
        <Zone x={0} y={50} w={33} h={50} type="arriere" posNumber={5} />
        <Zone x={33} y={68} w={34} h={32} type="libero" posNumber={6} />
        <Zone x={67} y={50} w={33} h={50} type="arriere" posNumber={1} />
        <ZoneLabel x={10} y={80} label="Zone 5" type="arriere" />
        <ZoneLabel x={45} y={82} label="Zone 6" type="libero" />
        <ZoneLabel x={78} y={80} label="Zone 1" type="arriere" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="am" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#eab308" />
            </marker>
            <marker id="aa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <line x1="50" y1="38" x2="22" y2="85" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="50" y1="38" x2="78" y2="85" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="50" y1="38" x2="50" y2="80" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
        </svg>
        <Player x={35} y={53} label="4" sub="BLK" type="avant" />
        <Player x={50} y={53} label="3" sub="BLK" type="avant" />
        <Player x={65} y={53} label="2" sub="BLK" type="avant" />
        <Player x={20} y={80} label="5" type="arriere" />
        <Player x={50} y={80} label="6" sub="LIB" type="libero" />
        <Player x={80} y={80} label="1" type="arriere" />
      </Court>
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Rôles par poste</div>
        <ul className="space-y-1">
          {[
            ['Postes 4, 3 et 2 (avants)', 'Forment un triple bloc au centre'],
            ['Postes 5 et 1 (arrières)', 'Reculent profondément dans les angles'],
            ['Poste 6 (Libéro)', 'Se positionne au centre, prêt à réagir dans toutes les directions'],
          ].map(([label, text], i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span><strong className="text-white">{label} : </strong><span className="text-gray-400">{text}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm space-y-1">
        <div className="text-yellow-400 text-xs uppercase tracking-wider">Quand s'avancer ?</div>
        <div className="text-gray-400">Tous les arrières restent profonds (6–7m) car l'attaque centrale est souvent puissante.</div>
        <div className="text-gray-400">Le Libéro peut avancer légèrement (5m) s'il anticipe une feinte.</div>
        <div className="text-gray-400">Attention : l'attaque centre est rapide, peu de temps pour ajuster.</div>
      </div>
    </div>
  );
}

function Zone2Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={85} y={38} />
        <Zone x={0} y={62} w={42} h={38} type="arriere" posNumber={5} />
        <Zone x={40} y={56} w={35} h={32} type="libero" posNumber={6} />
        <Zone x={72} y={50} w={28} h={28} type="arriere" posNumber={1} />
        <Zone x={0} y={50} w={30} h={24} type="avant" posNumber={4} />
        <ZoneLabel x={16} y={80} label="Zone 5" type="arriere" />
        <ZoneLabel x={55} y={68} label="Zone 6" type="libero" />
        <ZoneLabel x={80} y={60} label="Zone 1" type="arriere" />
        <ZoneLabel x={7} y={60} label="Zone 4" type="avant" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="am" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#eab308" />
            </marker>
            <marker id="aa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <line x1="85" y1="38" x2="25" y2="85" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="85" y1="38" x2="82" y2="65" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="85" y1="38" x2="58" y2="75" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="85" y1="38" x2="15" y2="60" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
        </svg>
        <Player x={60} y={53} label="3" sub="BLK" type="avant" />
        <Player x={80} y={53} label="2" sub="BLK" type="avant" />
        <Player x={15} y={75} label="4" sub="DÉF" type="avant" />
        <Player x={15} y={85} label="5" type="arriere" />
        <Player x={62} y={75} label="6" sub="LIB" type="libero" />
        <Player x={85} y={75} label="1" type="arriere" />
      </Court>
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Rôles par poste</div>
        <ul className="space-y-1">
          {[
            ['Postes 3 et 2 (avant)', 'Bloquent au filet pour fermer la diagonale'],
            ['Poste 4 (avant gauche)', 'Recule et défend la ligne gauche (attaque longue)'],
            ['Poste 1 (arrière droit)', 'Avance légèrement, défend les balles courtes derrière le bloc'],
            ['Poste 6 (Libéro)', 'Se décale nettement vers la droite, défend au centre-droit'],
            ['Poste 5 (arrière gauche)', 'Recule en fond de terrain, défend la diagonale longue'],
          ].map(([label, text], i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span><strong className="text-white">{label} : </strong><span className="text-gray-400">{text}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm space-y-1">
        <div className="text-yellow-400 text-xs uppercase tracking-wider">Quand s'avancer ?</div>
        <div className="text-gray-400">Poste 1 : Avancez légèrement (3–4m) pour les feintes et balles molles.</div>
        <div className="text-gray-400">Postes 5 et 6 : Restez profonds (5–7m) pour la diagonale puissante.</div>
        <div className="text-gray-400">Poste 4 : Reculez complètement en défense de ligne.</div>
      </div>
    </div>
  );
}

const INDICES_VISUELS = [
  {
    title: 'Attaquant loin du filet',
    action: 'AVANCE',
    points: [
      'Passe à 2–3m du filet',
      'Il ne peut pas smasher fort',
      'Risque élevé de feinte ou amortie',
      'Avance de 1–2 mètres',
    ],
    accent: 'border-yellow-400',
    titleColor: 'text-yellow-400',
  },
  {
    title: 'Attaquant près du filet',
    action: 'RECULE',
    points: [
      'Passe à moins de 1m du filet',
      'Peut smasher à pleine puissance',
      'Trajectoire descendante rapide',
      'Recule au maximum',
    ],
    accent: 'border-red-500',
    titleColor: 'text-red-400',
  },
  {
    title: "L'épaule de l'attaquant",
    action: 'Regarde son épaule qui frappe',
    points: [
      'Épaule haute et en arrière = smash puissant',
      'Épaule basse = feinte probable',
      "Rotation d'épaule = direction de la balle",
      'Ajuste-toi en 0,5s',
    ],
    accent: 'border-gray-500',
    titleColor: 'text-gray-300',
  },
  {
    title: "L'élan de l'attaquant",
    action: "Observe sa course d'approche",
    points: [
      'Course longue et rapide = smash fort',
      'Petit élan ou arrêt = feinte',
      "Angle d'approche = zone visée",
      'Anticipe la puissance',
    ],
    accent: 'border-gray-600',
    titleColor: 'text-gray-400',
  },
];

const EXERCICES = [
  {
    title: 'Lecture de situation',
    level: 'Débutant',
    duration: '10 min',
    materiel: '1 coach ou partenaire avec balles',
    objectif: "Apprendre à identifier rapidement la zone d'attaque",
    steps: [
      "Le coach se place de l'autre côté du filet en zone 4, 3 ou 2",
      'Tu pars du centre du terrain',
      'Le coach annonce la zone et lance la balle',
      'Tu dois te placer dans ta zone défensive en 2–3 secondes',
      'Répète 20 fois en variant les zones',
    ],
  },
  {
    title: 'Avancer/Reculer selon la passe',
    level: 'Intermédiaire',
    duration: '15 min',
    materiel: '1 passeur, 1 attaquant, plusieurs défenseurs',
    objectif: 'Ajuster ta position selon la qualité de la passe',
    steps: [
      "Le passeur fait des passes de qualité variable à l'attaquant",
      'Passe proche du filet → Tu recules (smash puissant attendu)',
      'Passe loin du filet → Tu avances (feinte probable)',
      "L'attaquant frappe et tu défends",
      'Le coach corrige ta position après chaque balle',
    ],
  },
  {
    title: 'Communication défensive',
    level: 'Tous niveaux',
    duration: '10 min',
    materiel: 'Équipe complète',
    objectif: 'Développer la communication automatique',
    steps: [
      'Jeu à 6 contre 6, mais en CRIANT tous les appels',
      'Pénalité : -1 point si un joueur ne crie pas "Moi !" sur sa balle',
      "Bonus : +1 point si toute l'équipe communique sur un échange",
      "Chaque joueur doit annoncer la zone d'attaque adverse",
    ],
  },
  {
    title: 'Défense contre feintes',
    level: 'Intermédiaire',
    duration: '15 min',
    materiel: '1 attaquant, 3 défenseurs arrière',
    objectif: 'Améliorer la défense des balles courtes',
    steps: [
      "L'attaquant ne fait QUE des feintes et amorties",
      'Les défenseurs doivent tous avancer (3–4m)',
      'Objectif : récupérer 8 balles sur 10',
      "Puis alterner : 5 feintes, 5 smashes pour travailler l'adaptation",
    ],
  },
  {
    title: 'Transitions rapides',
    level: 'Avancé',
    duration: '20 min',
    materiel: 'Équipe complète',
    objectif: 'Maîtriser les changements attaque-défense',
    steps: [
      'Jeu normal mais le coach chronomètre les transitions',
      'Objectif : être en position défensive en moins de 3 secondes',
      "Si trop lent, l'équipe fait 5 pompes et recommence",
      'Augmente progressivement le rythme des échanges',
    ],
  },
  {
    title: "Lire l'attaquant",
    level: 'Avancé',
    duration: '15 min',
    materiel: '1 attaquant, défenseurs',
    objectif: 'Anticiper selon le langage corporel',
    steps: [
      "L'attaquant alterne smash, feinte, pointe sans prévenir",
      `Avant qu'il frappe, le défenseur crie sa prédiction : "Smash !" ou "Feinte !"`,
      'Point si la prédiction est correcte ET la balle défendue',
      'Focus sur : épaule, élan, position par rapport au filet',
    ],
  },
];

const COMMANDEMENTS = [
  ['Regarde le passeur', "Puis l'attaquant, pas la balle"],
  ['Même côté = Avance', 'Côté opposé = Recule'],
  ['Mauvaise passe adverse', '→ Avance de 1–2m (feinte probable)'],
  ['Jamais au milieu', 'Choisis : avancé OU reculé'],
  ['Communique TOUJOURS', '"Moi !" sur chaque balle que tu prends'],
  ['Bouge après le service', 'Position de service ≠ Position défensive'],
  ["Lis l'épaule", 'Épaule haute = smash, basse = feinte'],
  ['Position basse', 'Jambes fléchies, bras prêts'],
  ['Transitions rapides', '3 secondes max pour te replacer'],
  ['Défends ta zone', 'Chaque joueur a sa responsabilité'],
];

export default function GuidePositionnement() {
  const [zone, setZone] = useState<ZoneTab>('zone4');

  return (
    <div className="space-y-12">

      {/* Principe de base */}
      <div className="border-2 border-gray-700 bg-gray-900 p-5 space-y-2">
        <div className="text-yellow-400 text-xs uppercase tracking-wider">Principe de base de la défense</div>
        <p className="text-gray-300 text-sm">Le positionnement défensif dépend de 3 facteurs principaux :</p>
        <ul className="space-y-1">
          {['Votre poste (avant ou arrière)', "La zone d'attaque adverse (zone 4, 3, 2)", "Le type d'attaque (smash puissant, feinte, pointe)"].map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span className="text-gray-300">{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Les Postes et Zones */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">1. Les postes et zones</h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider text-center">Numérotation des zones</p>
          <div className="relative w-full max-w-[440px] mx-auto bg-gray-800 border border-gray-600 aspect-square">
            <div className="absolute left-0 right-0 bg-yellow-400" style={{ top: '50%', height: '3px', transform: 'translateY(-50%)' }} />
            {/* Notre côté — arrière */}
            <div className="absolute text-lg font-bold" style={{ left: '10%', top: '82%', color: ROLE_COLORS.P5 }}>5</div>
            <div className="absolute text-lg font-bold" style={{ left: '50%', top: '82%', transform: 'translateX(-50%)', color: ROLE_COLORS.P6 }}>6</div>
            <div className="absolute text-lg font-bold" style={{ right: '10%', top: '82%', color: ROLE_COLORS.P1 }}>1</div>
            {/* Notre côté — avant */}
            <div className="absolute text-lg font-bold" style={{ left: '10%', top: '62%', color: ROLE_COLORS.P4 }}>4</div>
            <div className="absolute text-lg font-bold" style={{ left: '50%', top: '62%', transform: 'translateX(-50%)', color: ROLE_COLORS.P3 }}>3</div>
            <div className="absolute text-lg font-bold" style={{ right: '10%', top: '62%', color: ROLE_COLORS.P2 }}>2</div>
            {/* Adversaires — avant */}
            <div className="absolute text-sm text-gray-700" style={{ left: '10%', top: '35%' }}>4</div>
            <div className="absolute text-sm text-gray-700" style={{ left: '50%', top: '35%', transform: 'translateX(-50%)' }}>3</div>
            <div className="absolute text-sm text-gray-700" style={{ right: '10%', top: '35%' }}>2</div>
            {/* Adversaires — arrière */}
            <div className="absolute text-sm text-gray-700" style={{ left: '10%', top: '15%' }}>5</div>
            <div className="absolute text-sm text-gray-700" style={{ left: '50%', top: '15%', transform: 'translateX(-50%)' }}>6</div>
            <div className="absolute text-sm text-gray-700" style={{ right: '10%', top: '15%' }}>1</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notre côté</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-wider">Adversaires</div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap text-xs">
            {([['P4', '4 Outside'], ['P3', '3 Central'], ['P2', '2 Passeur'], ['P5', '5 Outside'], ['P6', '6 Central'], ['P1', '1 Opposé']] as const).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="w-3 h-3 inline-block" style={{ backgroundColor: ROLE_COLORS[key] }} />
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-l-4 border-gray-600 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Règle importante : </strong>
          Les joueurs arrière (5, 6, 1) ne peuvent PAS bloquer au filet. Ils doivent défendre en fond de terrain.
        </div>
      </section>

      {/* 2. Positionnement par zone */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">2. Positionnement selon la zone d'attaque adverse</h2>
        <div className="flex gap-1 flex-wrap">
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                zone === z
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              {z === 'zone4' ? 'Attaque Zone 4' : z === 'zone3' ? 'Attaque Zone 3' : 'Attaque Zone 2'}
            </button>
          ))}
        </div>
        <div className="border-2 border-gray-700 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider text-center mb-4">
            {zone === 'zone4' ? 'Défense contre attaque en Zone 4 (aile gauche adverse)' :
             zone === 'zone3' ? 'Défense contre attaque en Zone 3 (centre)' :
             'Défense contre attaque en Zone 2 (aile droite adverse)'}
          </p>
          {zone === 'zone4' && <Zone4Tab />}
          {zone === 'zone3' && <Zone3Tab />}
          {zone === 'zone2' && <Zone2Tab />}
        </div>
        <div className="text-xs text-gray-600 flex gap-4 flex-wrap">
          <span><span className="text-yellow-400">■</span> Zone de responsabilité</span>
          <span><span className="text-yellow-400">——</span> Trajectoire principale</span>
          <span><span className="text-gray-500">- -</span> Trajectoires alternatives</span>
        </div>
      </section>

      {/* Jouer à 4 ou à 5 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">3. Jouer à 4 ou à 5 joueurs</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Quand on joue en effectif réduit (entraînement, UNSS, loisir), il faut adapter les zones de responsabilité.
          La règle d'or : <strong className="text-white">moins on est, plus chaque joueur couvre une grande zone et plus la communication est cruciale.</strong>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Jouer à 5 (5v5)</h3>
            <div className="text-gray-400 text-xs">Système 5-1 simplifié : 2 avant + 3 arrière OU 3 avant + 2 arrière selon la rotation.</div>
            <ul className="space-y-1">
              {[
                ['Bloc à 2 reste la norme', 'Garder la même logique qu\'en 6v6.'],
                ['Off-blocker côté opposé', 'Recule sur les 3 m comme en 6v6.'],
                ['Seulement 2 défenseurs en fond', 'Un libéro en grande diagonale, un autre arrière sur la ligne.'],
                ['Lecture indispensable', 'Chaque défenseur couvre ~30 m² (vs 20 m² en 6v6).'],
                ['Couverture d\'attaque à 4', 'Plus serrée — 3 proches + 1 lointain.'],
              ].map(([t, d], i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-400 mt-0.5">▸</span>
                  <span><strong className="text-white">{t} : </strong><span className="text-gray-400">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-gray-600 p-4 space-y-3">
            <h3 className="text-gray-300 text-xs uppercase tracking-wider font-bold">Jouer à 4 (4v4)</h3>
            <div className="text-gray-400 text-xs">Configuration losange ou carré : pas de libéro, chaque joueur défend une zone large.</div>
            <ul className="space-y-1">
              {[
                ['Bloc à 1', 'Le central seul saute. Libère 3 défenseurs au sol.'],
                ['Bloc à 2 occasionnel', 'Réservé aux gros attaquants — laisse 2 défenseurs au sol seulement.'],
                ['Losange (1-2-1)', 'Passeur P3 caché, 2 ailes sur les 3m, 1 arrière au fond. Couverture homogène.'],
                ['Carré (2-2)', '2 contreurs avant + 2 défenseurs arrière. Bloc à 2 possible mais arrière vulnérable.'],
                ['Anticipation = compétence n°1', 'Avec 4 joueurs, les zones font 30-40 m² par défenseur.'],
              ].map(([t, d], i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-300 mt-0.5">▸</span>
                  <span><strong className="text-white">{t} : </strong><span className="text-gray-400">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400 space-y-1">
          <div className="text-yellow-400 text-xs uppercase tracking-wider">Recommandations transverses</div>
          <div><strong className="text-white">5v5 : </strong>conserver le 5-1 du 6v6 en retirant un arrière non-passeur. Le libéro reste en P5 ou P6.</div>
          <div><strong className="text-white">4v4 : </strong>privilégier le losange (formation la plus utilisée). Pas de libéro autorisé en UNSS.</div>
          <div><strong className="text-white">Communication : </strong>annoncer chaque balle est encore plus important — 3 joueurs disponibles pour la défense seulement.</div>
        </div>
        <div className="text-xs text-gray-500">
          Voir les scénarios <code className="text-gray-300">5v5 · Défense Z4</code> et <code className="text-gray-300">4v4 · Défense bloc à 1</code> dans la section Scénarios pour visualiser ces formations en 3D.
        </div>
      </section>

      {/* 6. Principes généraux */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">6. Principes généraux de positionnement</h2>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Zones de responsabilité</div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              title: 'Joueurs avant',
              points: ['Priorité : Bloquer au filet', 'Si pas au bloc : Défendre la ligne opposée', 'Distance : Au filet ou fond de terrain'],
            },
            {
              title: 'Libéro (Poste 6)',
              points: ['Position : Centre, adaptable', 'Distance : 5–6m du filet', 'Rôle : Pilier de la défense, couvre le centre'],
            },
            {
              title: 'Arrières latéraux (5 et 1)',
              points: ['Rôle variable : Avancent ou reculent', 'Côté attaqué : Avancent (3–4m)', 'Côté opposé : Reculent (6–7m)'],
            },
          ].map((card, i) => (
            <div key={i} className="border-2 border-gray-700 p-4 space-y-2">
              <h4 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">{card.title}</h4>
              <ul className="space-y-1">
                {card.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Lire l'attaquant */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">4. Lire l'attaquant : les indices visuels</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Ton positionnement doit s'ajuster en fonction de ce que tu vois. Voici les indices clés :
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {INDICES_VISUELS.map((card, i) => (
            <div key={i} className={`border-l-4 ${card.accent} border-2 border-gray-700 p-4 space-y-2`}>
              <h4 className={`text-sm font-bold ${card.titleColor}`}>{card.title}</h4>
              <div className="text-yellow-400 text-xs font-bold">{card.action}</div>
              <ul className="space-y-1">
                {card.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Astuce pro : </strong>
          Dans les 2 premières secondes après le service adverse, concentre ton regard sur le passeur, puis IMMÉDIATEMENT sur l'attaquant qui va frapper.
        </div>
      </section>

      {/* 5. Quand avancer/reculer */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">5. Quand s'avancer ou reculer ?</h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Arbre de décision rapide</div>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-400 pl-4 space-y-1">
              <div className="text-yellow-400 text-xs uppercase tracking-wider font-bold">S'avancer (3–4m du filet) quand :</div>
              {[
                "Vous êtes du même côté que l'attaquant (ex: attaque zone 4, vous êtes poste 5)",
                "L'attaquant est loin du filet (mauvaise passe)",
                'Vous anticipez une feinte ou amortie',
                'Le bloc est solide (3 joueurs) — moins de balles puissantes passent',
                "L'attaquant est petit ou pas très puissant",
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-yellow-400 mt-0.5">▸</span>{pt}
                </div>
              ))}
            </div>
            <div className="border-l-4 border-gray-600 pl-4 space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Reculer (6–7m du filet) quand :</div>
              {[
                "Vous êtes du côté opposé à l'attaquant (ex: attaque zone 4, vous êtes poste 1)",
                "L'attaquant a une bonne passe près du filet",
                "L'attaquant est puissant ou grand",
                'Le bloc est faible (1 seul bloqueur)',
                'Vous défendez la diagonale (trajectoire la plus longue)',
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-500 mt-0.5">▸</span>{pt}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Astuce pro : </strong>
          Regardez la qualité de la passe adverse ! Si la passe est mauvaise, AVANCEZ (feinte probable). Si la passe est parfaite, RECULEZ (il peut frapper fort).
        </div>
      </section>

      {/* 7. Erreurs courantes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">7. Erreurs courantes à éviter</h2>
        <div className="space-y-2">
          {[
            ['Rester au milieu du terrain', "Beaucoup de débutants restent à 4–5m du filet, dans «no man's land». C'est la zone où vous ne pouvez défendre ni les balles courtes ni les balles longues. Choisissez : avancé OU reculé !"],
            ['Ne pas regarder le bloc', 'La position du bloc détermine où la balle peut passer. Si le bloc ferme bien la ligne, défendez plus la diagonale.'],
            ['Ne pas bouger après le service', "Votre position de service n'est JAMAIS votre position de défense. Dès que le service part, repositionnez-vous selon l'attaque adverse."],
            ['Défendre la même zone que votre coéquipier', 'Communiquez ! Si deux joueurs vont au même endroit, un espace se crée ailleurs.'],
          ].map(([label, text], i) => (
            <div key={i} className="border-l-4 border-red-500 pl-4 py-2 text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Positionnement au service */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">8. Positionnement au service</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          <strong className="text-white">Ton placement au service est DIFFÉRENT de ta position défensive. </strong>
          Dès que le service part, tu dois te repositionner.
        </div>
        <div className="border-2 border-gray-700 p-4 space-y-3">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Transition service → défense</div>
          <ol className="space-y-2">
            {[
              ['Ton équipe sert', 'Tu es en position de rotation'],
              ['Le serveur frappe', 'Tu regardes le passeur adverse'],
              ['Le passeur touche la balle', 'Tu te déplaces vers ta zone défensive'],
              ["L'attaquant saute", 'Tu es en position finale, prêt à réagir'],
            ].map(([step, detail], i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. Communication */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">9. Communication défensive</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Une défense silencieuse est une défense inefficace.
        </div>
        <div className="space-y-3">
          {[
            {
              moment: "Avant l'attaque adverse",
              calls: [
                ['"Numéro 4 !"', "Annonce la zone d'où vient l'attaque"],
                ['"Deux au bloc !"', 'Indique combien de bloqueurs'],
                ['"Ligne libre !"', 'Si le bloc ne couvre pas la ligne'],
                [`"J'avance !" / "Je recule !"`, 'Annonce ton mouvement'],
              ],
            },
            {
              moment: "Pendant l'action",
              calls: [
                [`"Moi !" / "J'ai !"`, 'Tu prends la balle (le PLUS important)'],
                ['"Toi !" / "À toi !"', 'Tu laisses la balle à un coéquipier'],
                ['"Dehors !"', 'La balle va sortir, ne la touche pas'],
                ['"Bloquée !"', 'Si tu bloques, annonce-le'],
              ],
            },
            {
              moment: "Après l'action",
              calls: [
                ['"Couvrez !"', "Demande la couverture d'attaque"],
                ['"Libre !"', 'Balle libre, replacez-vous'],
                ['"On reste !"', 'On garde la défense en place'],
              ],
            },
          ].map((group, i) => (
            <div key={i} className="border-2 border-gray-700 p-4 space-y-2">
              <div className="text-yellow-400 text-xs uppercase tracking-wider">{group.moment}</div>
              <ul className="space-y-1">
                {group.calls.map(([call, desc], j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    <span><strong className="text-white">{call} </strong><span className="text-gray-500">—</span><span className="text-gray-400"> {desc}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Règle d'or : </strong>
          En cas de doute entre deux joueurs, c'est TOUJOURS le joueur le plus avancé qui prend la balle.
        </div>
      </section>

      {/* 10. Systèmes défensifs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">10. Les systèmes défensifs : avancé vs reculé</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Il existe deux philosophies défensives principales. Ton équipe peut choisir de jouer avec une défense avancée ou reculée.
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold text-center">Défense avancée</h3>
            <div className="text-gray-500 text-xs">Principe : Les arrières se positionnent à 3–4m du filet</div>
            <div className="space-y-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider">Avantages</div>
              <ul className="space-y-1">
                {['Excellente contre les feintes', 'Récupère les balles molles', 'Couvre bien les amorties', 'Transition rapide attaque-défense'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-yellow-400">▸</span>{pt}</li>
                ))}
              </ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">Inconvénients</div>
              <ul className="space-y-1">
                {['Vulnérable aux smashes puissants', 'Diagonales longues difficiles', 'Nécessite des blocs solides'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-gray-600">▸</span>{pt}</li>
                ))}
              </ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">À utiliser quand</div>
              <ul className="space-y-1">
                {["L'équipe adverse fait beaucoup de feintes", 'Vous avez un bon triple bloc', 'Les attaquants adverses sont peu puissants'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-yellow-400">▸</span>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-2 border-gray-600 p-4 space-y-3">
            <h3 className="text-gray-300 text-xs uppercase tracking-wider font-bold text-center">Défense reculée</h3>
            <div className="text-gray-500 text-xs">Principe : Les arrières se positionnent à 6–7m du filet</div>
            <div className="space-y-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider">Avantages</div>
              <ul className="space-y-1">
                {['Excellente contre les smashes puissants', 'Plus de temps de réaction', 'Couvre toute la profondeur', 'Diagonales bien défendues'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-gray-300">▸</span>{pt}</li>
                ))}
              </ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">Inconvénients</div>
              <ul className="space-y-1">
                {['Vulnérable aux feintes courtes', 'Zone morte derrière le bloc', 'Difficile de remonter les amorties'].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-gray-600">▸</span>{pt}</li>
                ))}
              </ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">À utiliser quand</div>
              <ul className="space-y-1">
                {['Face à des attaquants puissants', 'Votre bloc est faible (1–2 joueurs)', "L'équipe adverse privilégie la force"].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-gray-300">▸</span>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Niveau avancé : </strong>
          Les meilleures équipes utilisent une défense mixte — le joueur du même côté que l'attaque avance (3–4m), tandis que les deux autres reculent (6–7m).
        </div>
      </section>

      {/* 11. Transitions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">11. Transitions attaque ↔ défense</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Le volleyball est un jeu de transitions rapides. Tu passes constamment de l'attaque à la défense et vice-versa.
        </div>
        <div className="space-y-3">
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <div className="text-yellow-400 text-xs uppercase tracking-wider">Transition attaque → défense</div>
            <p className="text-gray-500 text-xs">Situation : Ton équipe vient d'attaquer, l'adversaire contre-attaque</p>
            <ol className="space-y-2">
              {[
                ['Ton coéquipier attaque', 'Prépare-toi mentalement à défendre'],
                ['La balle est renvoyée', 'Identifie immédiatement qui va attaquer'],
                ['Course rapide', 'Va vers ta zone défensive (2–3 secondes max)'],
                ['Position basse', 'Fléchis les jambes, prêt à plonger'],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
                </li>
              ))}
            </ol>
            <div className="border-l-4 border-red-500 pl-3 text-sm text-gray-400">
              <strong className="text-red-400">Erreur fréquente : </strong>
              Rester à regarder l'attaque de ton équipe. Dès que la balle traverse le filet, BOUGE !
            </div>
          </div>
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <div className="text-yellow-400 text-xs uppercase tracking-wider">Transition défense → attaque</div>
            <p className="text-gray-500 text-xs">Situation : Tu viens de défendre, ton équipe va attaquer</p>
            <ol className="space-y-2">
              {[
                ['Tu défends la balle', 'Passe précise vers le passeur'],
                ['Si tu es AVANT', 'Cours au filet pour attaquer ou bloquer'],
                ['Si tu es ARRIÈRE', "Recule légèrement, prêt à couvrir l'attaque"],
                ["Couverture d'attaque", 'Entoure ton attaquant (en demi-cercle à 2–3m)'],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
                </li>
              ))}
            </ol>
            <div className="border-l-4 border-yellow-400 pl-3 text-sm text-gray-400">
              <strong className="text-white">Astuce : </strong>
              Après une défense, les arrières forment un "filet de sécurité" autour de l'attaquant pour rattraper un éventuel contre.
            </div>
          </div>
        </div>
      </section>

      {/* 12. Exercices */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">12. Exercices pour progresser</h2>
        <div className="space-y-3">
          {EXERCICES.map((ex, i) => (
            <div key={i} className="border-2 border-gray-700 p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-white font-bold text-sm">{i + 1}. {ex.title}</h4>
                <span className="text-yellow-400 text-xs border border-yellow-400/50 px-2 py-0.5 flex-shrink-0">{ex.level}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-600">
                <span>Durée : {ex.duration}</span>
                <span>Matériel : {ex.materiel}</span>
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Objectif : <span className="text-gray-300 normal-case">{ex.objectif}</span></div>
              <ol className="space-y-1">
                {ex.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 items-start text-sm">
                    <span className="text-yellow-400 text-xs flex-shrink-0 w-4 text-right mt-0.5">{j + 1}.</span>
                    <span className="text-gray-400">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm space-y-1">
          <div className="text-yellow-400 text-xs uppercase tracking-wider">Programme suggéré</div>
          {[
            ['Semaine 1–2', 'Exercices 1 et 3 (bases et communication)'],
            ['Semaine 3–4', 'Exercices 2 et 4 (lecture de jeu)'],
            ['Semaine 5+', 'Exercices 5 et 6 (niveau avancé)'],
          ].map(([w, desc], i) => (
            <div key={i} className="text-gray-400"><strong className="text-white">{w} : </strong>{desc}</div>
          ))}
        </div>
      </section>

      {/* 13. Récapitulatif */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">13. Récapitulatif rapide</h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <div className="text-gray-500 text-xs uppercase tracking-wider text-center">Les 10 commandements du défenseur</div>
          <div className="grid md:grid-cols-2 gap-2">
            {COMMANDEMENTS.map(([title, sub], i) => (
              <div key={i} className="border border-gray-700 p-3 flex gap-3 items-start">
                <span className="text-yellow-400 font-bold text-sm flex-shrink-0 w-5">{i + 1}.</span>
                <div>
                  <div className="text-white text-sm font-bold">{title}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 text-center">
              <div className="text-yellow-400 font-bold text-sm">Même côté que l'attaquant</div>
              <div className="text-yellow-400 text-lg font-bold mt-1">→ AVANCER (3–4m)</div>
              <div className="text-gray-500 text-xs mt-1">Défendre feintes et amorties</div>
            </div>
            <div className="border-2 border-gray-600 p-4 text-center">
              <div className="text-gray-300 font-bold text-sm">Côté opposé à l'attaquant</div>
              <div className="text-gray-300 text-lg font-bold mt-1">→ RECULER (6–7m)</div>
              <div className="text-gray-500 text-xs mt-1">Défendre diagonales longues</div>
            </div>
          </div>
          <div className="border border-gray-700 p-3 text-sm text-gray-400">
            <strong className="text-white">Exception : </strong>
            Le Libéro (poste 6) se décale vers le côté de l'attaque mais reste à mi-distance (5–6m), sauf contre attaque centrale où il reste au centre.
          </div>
        </div>
      </section>

      {/* 14. Préparation mentale */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">14. Préparation mentale et attitude</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          La défense est 50% physique, 50% mental. Ton état d'esprit est aussi important que ta technique.
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-2">
            <div className="text-yellow-400 text-xs uppercase tracking-wider font-bold">La bonne mentalité</div>
            <ul className="space-y-2">
              {[
                ['"Chaque balle est récupérable"', 'Ne lâche jamais, même sur les smashes impossibles'],
                [`"C'est MON terrain"`, 'Défends ta zone avec agressivité'],
                ['"Je lis, je réagis, je défends"', 'Processus automatique'],
                [`"L'erreur fait partie du jeu"`, 'Oublie la dernière balle manquée'],
                [`"Je suis prêt avant qu'il saute"`, 'Anticipation constante'],
              ].map(([quote, detail], i) => (
                <li key={i} className="text-sm">
                  <div className="text-white font-bold">{quote}</div>
                  <div className="text-gray-400">{detail}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-gray-700 p-4 space-y-2">
            <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Les pièges à éviter</div>
            <ul className="space-y-2">
              {[
                ['"Cette balle est pour lui"', 'Résultat : personne ne bouge'],
                [`"J'ai peur de me tromper"`, "L'hésitation tue la défense"],
                ['"Je regarde juste la balle"', 'Tu arrives toujours en retard'],
                [`"C'était trop fort"`, "État d'esprit défaitiste"],
                [`"Je reste ici, c'est ma position"`, 'Le volleyball est mouvement'],
              ].map(([quote, detail], i) => (
                <li key={i} className="text-sm">
                  <div className="text-red-400 font-bold">{quote}</div>
                  <div className="text-gray-500">{detail}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-2 border-gray-700 p-4 space-y-3">
          <div className="text-yellow-400 text-xs uppercase tracking-wider">Routine de préparation avant chaque échange</div>
          <ol className="space-y-2">
            {[
              ['Respiration profonde', 'Oxygène le cerveau'],
              ['Position athlétique', "Jambes écartées, poids sur l'avant des pieds"],
              ['Yeux sur le passeur', 'Concentration maximale'],
              ['Rappel mental', '"Même côté = avance, opposé = recule"'],
              ['Confiance', '"Je vais défendre cette balle"'],
            ].map(([step, detail], i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400 italic">
          "Les attaquants gagnent les points, mais les défenseurs gagnent les matchs."
        </div>
      </section>

      {/* 15. Checklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">15. Checklist avant le match</h2>
        <div className="space-y-3">
          {[
            {
              moment: 'Avant le match',
              items: ["J'ai revu les zones de responsabilité", 'Je connais ma règle : même côté/opposé', "J'ai échauffé mes jambes (squat, fentes)", "J'ai visualisé 3–4 situations défensives"],
            },
            {
              moment: "Pendant l'échauffement",
              items: ["J'observe les attaquants adverses (gauchers/droitiers)", 'Je repère leurs tendances (ligne/diagonale/feinte)', 'Je teste mes déplacements rapides', 'Je communique avec mes coéquipiers'],
            },
            {
              moment: 'Pendant le match',
              items: ['Je crie sur CHAQUE balle que je prends', 'Je me replace après chaque échange', "Je m'adapte si un attaquant me surprend", "Je reste positif même après une erreur"],
            },
            {
              moment: 'Après le match',
              items: ["J'analyse mes placements (vidéo si possible)", 'Je note les situations difficiles', 'Je demande des retours à mon coach', 'Je planifie mes exercices pour la semaine'],
            },
          ].map((section, i) => (
            <div key={i} className="border-2 border-gray-700 p-4 space-y-2">
              <div className="text-yellow-400 text-xs uppercase tracking-wider">{section.moment}</div>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-6 space-y-4">
          <h2 className="text-yellow-400 text-xs uppercase tracking-widest font-bold">Conclusion</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Le positionnement défensif s'apprend avec la pratique et l'expérience. Ne te décourage pas si tu fais
            des erreurs au début — même les professionnels ajustent constamment leur placement.
          </p>
          <p className="text-white font-bold text-sm">
            La clé : Applique la règle de base (même côté = avance, opposé = recule), observe l'attaquant,
            communique avec tes coéquipiers, et n'aie jamais peur de plonger pour une balle.
          </p>
          <p className="text-yellow-400 font-bold tracking-wide">La défense gagne les matchs.</p>
        </div>
      </section>

    </div>
  );
}
