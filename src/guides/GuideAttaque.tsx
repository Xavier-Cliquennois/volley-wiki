import { useState } from 'react';

function VideoLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
    >
      <span className="text-yellow-400">▶</span>
      <span className="flex-1">{title}</span>
      <span className="text-gray-600 text-xs">YT</span>
    </a>
  );
}

const PHASES = [
  ['Initiation', 'Lecture du set et décision de l\'approche'],
  ['Wind-up', 'Début de la course d\'élan'],
  ['Cocking', 'Coude au-dessus de l\'épaule, main derrière l\'oreille — position de puissance'],
  ['Accélération', 'Rotation séquentielle : hanches → tronc → épaule → coude → poignet'],
  ['Contact + suivi', 'Snap du poignet, la main "griffe" la balle par-dessus → topspin'],
];

const APPROACH_3 = [
  ['Pas 1 (gauche)', 'Pas court directionnel, orientation vers l\'attaque'],
  ['Pas 2 (droit)', 'Power step — long et bas, talon d\'abord, abaissement du centre de gravité'],
  ['Pas 3 (gauche)', 'Closing step — court, freine la translation horizontale et la convertit en vertical'],
];

const APPROACH_4 = [
  ['Pas 1 (droit)', 'Pas d\'observation, rythme lent'],
  ['Pas 2 (gauche)', 'Accélération'],
  ['Pas 3 (droit)', 'Power step — le plus important, long et bas'],
  ['Pas 4 (gauche)', 'Closing step parallèle au filet'],
];

const TIMING_TABLE: [string, string][] = [
  ['Haute ball (3e tempo)', 'Commencer TARD — quand la balle quitte les mains du passeur'],
  ['2e tempo (Hut/Go)', 'Commencer quand la passe arrive vers le passeur'],
  ['1er tempo (Quick)', 'Commencer TÔT — déjà en l\'air quand le passeur touche la balle'],
  ['Slide', 'Commencer au moment où le passeur reçoit la passe'],
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
    name: 'Attaque en zone 4 (Outside / OH)',
    position: 'Aile gauche',
    description: 'Base d\'apprentissage de l\'attaque. L\'attaquant aile (Outside Hitter) reçoit le plus grand volume de balles — c\'est l\'option "sécurité" du passeur. Approche à 45° depuis la gauche.',
    keyPoints: [
      'Approche 4 pas à ~45° par rapport au filet',
      'Appel à 30-50 cm du filet',
      'Set "Hut" (3e tempo haut) ou "Go" (2e tempo rapide)',
      'Sauter VERTICALEMENT — pas vers le filet',
      'Contact légèrement en avant de l\'épaule frappante',
    ],
    shots: ['Cross-court (diagonale)', 'Line shot (ligne latérale)', 'Cut shot (angle court <3 m)', 'Tip (feinte)', 'Roll shot (amortie topspin)'],
  },
  {
    id: 'middle',
    name: 'Attaque centrale (Quick / 1er tempo)',
    position: 'Avant centre',
    description: 'L\'attaque la plus rapide. Le central est en l\'air AVANT ou au moment où le passeur touche la balle. Set très bas (30-50 cm) et très court.',
    keyPoints: [
      'Déclencher l\'approche TÔT — déjà en l\'air au set du passeur',
      'Approche 2-3 pas, bras déjà armé en montant',
      'Concept "Ghost Middle" : même si la balle n\'arrive pas, courir le quick à fond pour fixer le bloc adverse → libère les ailiers',
      'Contact à 30-50 cm au-dessus du filet',
      'Transition rapide : contre → approche en 1-2 secondes',
    ],
    shots: ['Quick devant passeur ("1")', 'Back-1 derrière passeur', 'Slide (départ arrière le long du filet)', '31/Gap (décalé entre passeur et antenne)'],
  },
  {
    id: 'opposite',
    name: 'Attaque en zone 2 (Opposé / Pointu)',
    position: 'Aile droite',
    description: 'L\'opposé (pointu) attaque depuis la zone 2. Idéal pour les gauchers (épaule frappante côté antenne droite = fenêtre maximale). Pour droitier : rotation du tronc plus prononcée, se positionner plus loin de l\'antenne.',
    keyPoints: [
      'Approche symétrique à l\'Outside mais depuis la droite',
      'Finir avec pouce vers le bas pour le cut shot',
      'Solution "release" du passeur quand la réception est dégradée',
      'Attaque arrière depuis P1 (zone D) quand en back-row',
    ],
    shots: ['Cross-court', 'Line shot', 'Pipe/D depuis back-row', 'Cut shot diagonal vers zone 5'],
  },
  {
    id: 'backrow',
    name: 'Attaque arrière (Back-row / Pipe)',
    position: 'Arrière centre ou droit',
    description: 'Attaque depuis la zone arrière. Le plant DOIT se faire DERRIÈRE la ligne des 3 m. Permet d\'avoir 4 attaquants face à 3 contreurs.',
    keyPoints: [
      'Appel obligatoirement derrière la ligne des 3 m (sinon faute)',
      'Atterrissage dans la zone avant après saut légal = OK',
      'Pipe : depuis P6, set arrière du quick (BIC = juste au-dessus du quick)',
      'Zone D : depuis P1, souvent attaque-refuge de l\'opposé',
    ],
    shots: ['Pipe (arrière-centre)', 'Zone D (arrière-droit)', 'Zone A (arrière-gauche, rare)', 'Feinte sur mauvaise passe'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Feinte / Tip',
    level: 'Débutant → Intermédiaire',
    desc: 'Approche IDENTIQUE au smash (déguisement crucial), puis au contact ralentir le bras et placer la balle d\'un coup de doigts. Direction : zone vide repérée AVANT le saut.',
  },
  {
    name: 'Roll shot / Amortie topspin',
    level: 'Intermédiaire',
    desc: 'Frappe à vitesse réduite (~50-70%) avec fort topspin pour balle qui plonge court derrière le bloc. Plus rapide à lire que la feinte car plus rapide.',
  },
  {
    name: 'Cut shot / Angle court',
    level: 'Intermédiaire+',
    desc: 'Angle aigu vers zone 1 (depuis 4) ou zone 5 (depuis 2). Finir avec pouce vers le bas, main qui coupe latéralement à travers la balle. Frapper le côté du ballon, pas le dessus.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermédiaire+',
    desc: 'Faire sortir la balle volontairement par les mains du contre. Sur set serré au filet, sauter verticalement et pousser la balle latéralement en utilisant la main extérieure du contreur comme "rail".',
  },
];

const ERRORS = [
  ['Timing d\'approche', 'Trop tôt : re-saut sans puissance. Trop tard : bras tendu en arrière au contact.'],
  ['Mauvais ordre de pieds', 'Terminer toujours sur gauche-droite (droitier) — les deux pieds quasi simultanés.'],
  ['Pas de topspin', 'Main plate = pas de snap = ballon trop long. "Griffer" la balle par-dessus.'],
  ['Faute de filet', 'Saut vers l\'avant sur set serré. Sauter VERTICAL, pas avant.'],
  ['Faute de back-row', 'Pied sur ou devant la ligne des 3 m au décollage.'],
  ['Atterrissage un pied', 'Sauf pour le slide : atterrir sur les deux pieds pour protéger le genou (risque ACL).'],
];

const VIDEOS = [
  { title: 'Comment attaquer — 3 étapes (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'Le smash au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Course d\'attaque détaillée', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'La Séquence de Seb — tout sur le smash', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Sauter pour attaquer (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Attaquer placé (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaque() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div className="space-y-10">

      {/* Biomécanique */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Les 5 phases du smash</h2>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-3">
          {PHASES.map(([phase, desc], i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="bg-yellow-400 text-black text-sm font-bold w-6 h-6 flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <div>
                <strong className="text-white text-sm">{phase} : </strong>
                <span className="text-gray-400 text-sm">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Contact idéal : </strong>
          Légèrement en avant de l\'épaule frappante, jamais derrière la tête (perte de puissance + risque blessure). Distance au filet à l\'impulsion : 30-50 cm minimum.
        </div>
      </section>

      {/* Approach */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Course d'approche</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">3 pas — Débutant</h3>
            <p className="text-gray-500 text-xs">Gauche-droite-gauche (droitier)</p>
            <ul className="space-y-2">
              {APPROACH_3.map(([label, text], i) => (
                <li key={i} className="text-sm">
                  <strong className="text-white">{label} : </strong>
                  <span className="text-gray-400">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">4 pas — Standard compétition</h3>
            <p className="text-gray-500 text-xs">Droite-gauche-droite-gauche (droitier)</p>
            <ul className="space-y-2">
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} className="text-sm">
                  <strong className="text-white">{label} : </strong>
                  <span className="text-gray-400">{text}</span>
                </li>
              ))}
            </ul>
            <div className="border-l-4 border-yellow-400 pl-3 text-xs text-yellow-400">
              Règle d'or : les deux derniers pas sont les plus rapides — slow → fast.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Timing selon le type de passe</h2>
        <div className="border-2 border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Type de passe</th>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Quand commencer l'approche</th>
              </tr>
            </thead>
            <tbody>
              {TIMING_TABLE.map(([type, timing], i) => (
                <tr key={i} className={`${i < TIMING_TABLE.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-900/50`}>
                  <td className="px-4 py-3 text-yellow-400 font-bold text-sm">{type}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attack types */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Types d'attaque par poste</h2>
        <div className="flex flex-wrap gap-1">
          {ATTACK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAttack(t.id)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                activeAttack === t.id
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {t.position}
            </button>
          ))}
        </div>
        <div className="border-2 border-gray-700 p-5 space-y-4">
          <div>
            <h3 className="text-white font-bold text-lg">{current.name}</h3>
            <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">{current.position}</div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{current.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Points clés</div>
              <ul className="space-y-1">
                {current.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400 mt-0.5">▸</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Choix de tirs</div>
              <ul className="space-y-1">
                {current.shots.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special shots */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Attaques spéciales</h2>
        <div className="space-y-3">
          {SPECIAL_SHOTS.map((s, i) => (
            <div key={i} className="border-2 border-gray-700 p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-white font-bold text-sm">{s.name}</h3>
                <span className="text-yellow-400 text-xs border border-yellow-400/50 px-2 py-0.5 flex-shrink-0">{s.level}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Errors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Erreurs fréquentes</h2>
        <div className="border-l-4 border-red-500 pl-5 py-1 space-y-3">
          <div className="text-red-400 text-xs uppercase tracking-wider mb-2">À éviter</div>
          {ERRORS.map(([label, text], i) => (
            <div key={i} className="text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Ressources vidéo</h2>
        <div className="space-y-2">
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

      {/* Rule d'or */}
      <section>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-6">
          <div className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-3">Règle d'or</div>
          <p className="text-white font-bold text-sm leading-relaxed tracking-wide">
            APPROCHE LENTE → RAPIDE → POWER STEP → CLOSING → SAUT VERTICAL → BRAS TENDU EN AVANT → SNAP DU POIGNET
          </p>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            La puissance vient de la chaîne cinétique complète, pas du bras seul. Une approche rythmée avec les deux derniers pas rapides génère 70% de la puissance finale.
          </p>
        </div>
      </section>

    </div>
  );
}
