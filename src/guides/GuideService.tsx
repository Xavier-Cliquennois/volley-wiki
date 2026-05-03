import { useState } from 'react';

const LEVEL_STYLE: Record<string, string> = {
  'Débutant': 'text-green-400 border-green-400/50',
  'Intermédiaire': 'text-yellow-400 border-yellow-400/50',
  'Avancé': 'text-orange-400 border-orange-400/50',
  'Compétition': 'text-red-400 border-red-400/50',
};

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
    name: 'Service cuillère',
    level: 'Débutant',
    tagline: 'underhand — balancier sous la taille',
    description: 'Geste pendulaire du bras frappant sous la taille. Légal à tous les niveaux, recommandé aux débutants ou en cas de blessure d\'épaule. Quasi inexistant au-dessus du niveau régional adulte.',
    biomechanics: [
      'Chaîne cinétique courte : bassin → épaule → bras → main',
      'Mouvement pendulaire sans rotation du tronc',
      'Transfert de poids : pied arrière → pied avant',
      'Contact : talon de la main ou poing fermé sous le centre du ballon',
    ],
    steps: [
      'Pied gauche en avant, poids sur la jambe arrière',
      'Main gauche tient le ballon à hauteur du bassin dans l\'axe du bras',
      'Bras droit armé en arrière, paume ouverte ou poing fermé',
      'Relâcher le ballon juste avant le contact — ne pas lancer',
      'Balancier vers l\'avant, frappe sous le centre du ballon',
      'Bras suit et pointe la cible, poids transféré sur le pied avant',
    ],
    errors: [
      ['Ballon tenu trop bas ou écarté', 'Maintenir le ballon à hauteur du bassin, dans l\'axe du bras frappant'],
      ['Frappe avec les doigts', 'Utiliser le talon de la main — surface plus large et stable'],
      ['Lancer trop haut', 'Simplement relâcher le ballon, ne pas le lancer en hauteur'],
      ['Poignet mou', 'Bloquer le bras au contact pour un impact net'],
    ],
    exercises: [
      'Bowling-cerceaux : viser des zones à 4 m du filet',
      '10 services à 4 m puis reculer d\'1 m par série jusqu\'à la ligne de fond',
      'Cibles 4×3 m au sol — objectif 50% de précision',
    ],
    videos: [
      { title: 'Service cuillère + service tennis (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Comment servir par en dessous', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Service flottant debout',
    level: 'Intermédiaire',
    tagline: 'standing float — service par défaut de 90% des amateurs',
    description: 'Service sans rotation produisant une trajectoire imprévisible (effet "knuckleball"). À une vitesse critique (~12-13 m/s), des tourbillons asymétriques créent des forces de portance latérales aléatoires. C\'est le service à maîtriser en priorité.',
    biomechanics: [
      'Chaîne cinétique complète : jambes → bassin → tronc → épaule → coude → main',
      'Position "arc et flèche" : coude haut au-dessus de l\'épaule, main derrière l\'oreille',
      'Poignet BLOQUÉ et ferme — condition absolue pour l\'effet float',
      'Contact : talon de main au centre du ballon',
      '"Punch and freeze" : suivi COURT — la main s\'arrête immédiatement après le contact',
    ],
    steps: [
      'Corps à 45° par rapport au filet, pieds écartés largeur d\'épaules',
      'Bras gauche tendu devant l\'épaule, ballon à hauteur de la tête',
      'Lancer très court : "placer" le ballon 30-50 cm au-dessus de l\'épaule — le ballon ne tourne pas',
      'Pied gauche avance vers la cible juste après le placement du ballon',
      'Extension complète du bras au contact, main ferme et plate',
      'FREEZE : arrêt immédiat du geste après le contact — aucun suivi du bras',
    ],
    errors: [
      ['Suivi prolongé du bras', 'Cause #1 d\'échec : le suivi ajoute du spin qui tue le float — freeze immédiat'],
      ['Lancer trop haut', 'Le ballon tombe dans le filet — lancer court, 30-50 cm seulement'],
      ['Lancer qui tourne', 'Induit du spin sur le ballon — placer le ballon, ne pas le lancer'],
      ['Contact avec la paume seule', 'Utiliser le talon de main (bas de la paume) pour une surface plane'],
    ],
    exercises: [
      'Toss & Drop : marquer une zone au sol, lancer 20 fois sans frapper — objectif 18/20 sur la marque',
      'Mur "punch and freeze" à 3 m : travailler l\'arrêt immédiat du geste',
      '5 services consécutifs sans rotation validés visuellement par un partenaire',
    ],
    videos: [
      { title: 'Servir flottant en 4 minutes', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Améliorer son service flottant', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Service : flottant + tennis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Service flottant en saut',
    level: 'Avancé',
    tagline: 'jump float — standard des élites féminines',
    description: 'Float avec course d\'élan courte et saut. Gagne en hauteur de contact, vitesse et angle de descente. Devenu le standard des élites féminines (86% des services en pro féminin selon les études récentes). Moins risqué que le jump topspin tout en étant plus déstabilisant que le float debout.',
    biomechanics: [
      'Course d\'élan courte (2 à 4 pas)',
      'Bras en position arc-et-flèche pendant le saut — différent du smash où les bras propulsent',
      'L\'élan apporte la vitesse-balle, pas le bras seul',
      'Contact en point haut légèrement devant la tête',
      'Poignet bloqué + freeze identique au float debout',
    ],
    steps: [
      'Position 2-3 m derrière la ligne, ballon dans la main gauche',
      'Pas 1 (droit) d\'amorce, bras détendus',
      'Pas 2 (gauche) : lancer le ballon à ~1,5 m de hauteur, sans rotation',
      'Pas 3 + hop : appel sur les deux pieds derrière la ligne — bras montent en arc-et-flèche',
      'Saut vertical et légèrement vers l\'avant, corps gainé',
      'Frappe bras tendu, talon de main au centre du ballon',
      'FREEZE immédiat — atterrissage dans le terrain',
    ],
    errors: [
      ['Lancer trop haut', 'Réflexe jump spin — garder le lancer court comme pour le float debout'],
      ['Bras qui swingent comme à l\'attaque', 'Devient un smash avec spin — maintenir la position arc-et-flèche'],
      ['Suivi prolongé', 'Identique au float debout : freeze obligatoire'],
      ['Faute de pied au décollage', 'Vérifier que l\'appel se fait derrière la ligne de fond'],
    ],
    exercises: [
      'Maîtriser le float debout (freeze solide) avant d\'ajouter l\'élan',
      'Élan seul sans frapper : travailler le lancer stable à faible hauteur',
      'Jump float à vitesse contrôlée : la régularité avant la puissance',
    ],
    videos: [
      { title: 'Service sauté flottant — INF\'AUX ENTRAÎNEURS (Bretagne)', url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + smashé (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Service topspin en saut',
    level: 'Compétition',
    tagline: 'jump serve — smash depuis derrière la ligne',
    description: '"Smash depuis derrière la ligne" : ballon frappé à pleine vitesse avec topspin (50-60 mph en club fort). Plus haut potentiel d\'ace mais aussi le plus haut taux d\'erreur. Réservé à ceux ayant investi 1000+ répétitions à l\'entraînement.',
    biomechanics: [
      'Course d\'élan 3-4 pas identique à un smash de back-row',
      'Lancer haut (1-1,5 m devant soi) avec léger spin avant induit',
      'Rotation séquentielle : bassin → tronc → épaule → coude → poignet',
      'Contact zone 10-11h sur le ballon',
      'Snap complet du poignet pour le topspin (~30 rotations/s en élite)',
      'Suivi complet — opposé du float',
    ],
    steps: [
      'Position 3-4 m derrière la ligne, ballon dans la main frappante',
      'Pas 1 (droit) + lancer haut avec léger topspin induit',
      'Pas 2 (gauche) : accélération',
      'Pas 3 (droit) : power step long, centre de gravité qui s\'abaisse',
      'Pas 4 (gauche) : appel, bras s\'élancent vers le haut',
      'Saut explosif vertical-avant',
      'Frappe au sommet : main passe par-dessus le ballon (10h), paume puis doigts qui roulent',
      'Snap du poignet complet + suivi — atterrissage 1-2 m dans le terrain',
    ],
    errors: [
      ['Lancer trop bas ou derrière soi', 'Cause #1 du filet — le lancer doit être haut et devant'],
      ['Lancer trop en avant', 'Faute de pied — respecter les limites de la zone de service'],
      ['Manque de snap du poignet', 'Le ballon sort long sans spin descendant'],
      ['Utilisation en match sans préparation', '1000 répétitions à l\'entraînement d\'abord — règle d\'or'],
    ],
    exercises: [
      'Règle d\'or : 1000 répétitions à l\'entraînement avant utilisation en match',
      'Jump spin "control" : lancer plus bas, vitesse réduite pour viser des zones précises',
      'Filmer son lancer : 80% des erreurs viennent du placement du toss',
    ],
    videos: [
      { title: 'Service smashé puissant + flottant (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Zone 1 — arrière droit', 'Bloque la sortie du passeur en système 5-1'],
  ['Zone 2 — avant droit court', 'Casse le départ côté droit, exclut le libéro'],
  ['Zone 3 — avant centre court', 'Bloque le central, casse les attaques rapides'],
  ['Zone 4 — avant gauche court', 'Force l\'attaquant principal à passer ET attaquer'],
  ['Zone 5 — arrière gauche profond', 'Diagonale longue, taux d\'erreur élevé'],
  ['Zone 6 — arrière centre profond', 'Servir long contre les passeurs petits'],
];

export default function GuideService() {
  const [activeId, setActiveId] = useState('float');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div className="space-y-10">

      {/* Règle d'or */}
      <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5">
        <div className="text-yellow-400 text-xs uppercase tracking-wider mb-1">Règle d'or</div>
        <p className="text-white font-bold text-sm">80% des erreurs au service viennent du lancer (toss). Stabiliser le lancer en priorité avant de chercher la puissance.</p>
      </div>

      {/* Selector */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Types de service</h2>
        <div className="flex flex-wrap gap-1">
          {SERVICE_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                activeId === t.id
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <span className={`inline-block text-xs border px-2 py-1 ${LEVEL_STYLE[current.level]}`}>{current.level}</span>

        <div className="border-2 border-gray-700 p-5 space-y-5">
          <div>
            <h3 className="text-white font-bold text-lg">{current.name}</h3>
            <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">{current.tagline}</div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{current.description}</p>

          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Biomécanique clé</div>
            <ul className="space-y-1">
              {current.biomechanics.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-0.5">▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Étapes d'exécution (droitier)</div>
            <ol className="space-y-2">
              {current.steps.map((s, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-gray-300">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-red-400 text-xs uppercase tracking-wider mb-2">Erreurs fréquentes</div>
              <ul className="space-y-3">
                {current.errors.map(([label, fix], i) => (
                  <li key={i} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                      <strong className="text-white">{label}</strong>
                    </div>
                    <div className="text-gray-500 text-xs pl-4 mt-0.5">{fix}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Exercices</div>
              <ul className="space-y-1">
                {current.exercises.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {current.videos.length > 0 && (
          <div className="space-y-2">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Vidéos — {current.name}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Zones cibles et tactique</h2>
        <div className="border-2 border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Zone adverse</th>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Effet tactique</th>
              </tr>
            </thead>
            <tbody>
              {ZONES_TABLE.map(([zone, effect], i) => (
                <tr key={i} className={`${i < ZONES_TABLE.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-900/50`}>
                  <td className="px-4 py-3 text-yellow-400 font-bold text-sm">{zone}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          {[
            ['Les seams', 'Viser l\'espace entre deux réceptionneurs est plus efficace que viser un joueur — la communication adverse est mise à l\'épreuve.'],
            ['Alterner court/long', 'Empêche le passeur de savoir quand reculer. Le float court (zones 2-3-4) derrière la ligne d\'attaque gêne particulièrement.'],
            ['Métrique FBSO%', 'Un service qui réduit le First Ball Side Out adverse de 70% à 45% sans faire d\'ace est un service très efficace.'],
          ].map(([title, text], i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span><strong className="text-white">{title} : </strong><span className="text-gray-400">{text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-3">
          <div className="text-yellow-400 text-xs uppercase tracking-wider">Hiérarchie d'apprentissage</div>
          <div className="grid md:grid-cols-4 gap-2">
            {SERVICE_TYPES.map(t => (
              <div key={t.id} className="border border-gray-700 p-3 text-center text-xs">
                <div className={`font-bold mb-1 ${LEVEL_STYLE[t.level].split(' ')[0]}`}>{t.name}</div>
                <div className="text-gray-600">{t.level}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">Maîtriser chaque niveau avant de passer au suivant. <strong className="text-white">La régularité prime sur la puissance.</strong></p>
        </div>
      </section>

    </div>
  );
}
