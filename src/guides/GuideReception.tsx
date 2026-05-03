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

const SYSTEMS = [
  {
    name: 'Système W — 5 réceptionneurs',
    level: 'Débutant',
    desc: '3 joueurs en première ligne, 2 en seconde, tout le monde sauf le passeur participe.',
    pros: ['Zones réduites', 'Peu de communication requise', 'Idéal école de volley et U13-U15'],
    cons: ['Nombreuses zones de chevauchement', 'Mauvais réceptionneurs forcés à participer', 'Désorganise les attaquants'],
  },
  {
    name: 'Système U — 3 réceptionneurs',
    level: 'Standard moderne',
    desc: 'Libéro en zone 6, ailiers en zones 5 et 1. Les 3 meilleurs réceptionneurs prennent toutes les balles.',
    pros: ['Communication simplifiée', 'Les 3 meilleurs réceptionneurs couvrent tout', 'Attaquants front-row libres pour leur approche'],
    cons: ['Zones latérales plus larges à couvrir', 'Nécessite un libéro performant'],
  },
];

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

const ERRORS = [
  ['Swinging arms', 'Cause #1 — bras qui balaient au contact, ballon imprévisible. Correctif : "la plateforme est passive, les jambes sont actives".'],
  ['Plateforme cassée', "Un avant-bras plus haut que l'autre — verrouiller les coudes et pousser les pouces vers le bas."],
  ['Bras joints trop tôt', "Ralentit le déplacement et empêche le choix tardif manchette/mains. Joindre les mains uniquement à l'arrivée."],
  ['Tronc trop droit', "La plateforme passe sous le ballon → balle trop loin du filet. S'incliner à 30-45° vers l'avant."],
  ['Contact au-dessus du nombril', 'Trop haut = contrôle réduit. Viser le contact à hauteur de la taille ou plus bas.'],
  ['Pas de freeze', "Encore en mouvement au contact = direction impossible à contrôler. S'immobiliser complètement."],
];

const VIDEOS = [
  { title: 'Faire une manchette (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'La manchette (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Manchette contrôlée vers le passeur', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Apprendre la réception haute et basse (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Échauffement individuel manchette', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReception() {
  return (
    <div className="space-y-10">

      {/* Règle d'or */}
      <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5">
        <div className="text-yellow-400 text-xs uppercase tracking-wider mb-1">Règle d'or</div>
        <p className="text-white font-bold text-sm">La manchette détermine 60% du succès offensif d'une équipe. Sans bonne réception, pas d'attaque rapide. La plateforme est passive — les jambes sont actives.</p>
      </div>

      {/* Ready position */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Position de base (ready position)</h2>
        <div className="border-2 border-gray-700 p-5 space-y-3">
          <ul className="space-y-2">
            {[
              'Pieds légèrement plus larges que les épaules, un pied légèrement avancé',
              "Genoux fléchis vers l'intérieur des pieds, hanches basses, tronc incliné à 30-45°",
              'Dos droit, poids sur la plante des pieds (talons légèrement allégés mais pas décollés)',
              'Bras DISSOCIÉS (non joints), fléchis à 90-145°, à hauteur de la taille',
              'Regard sur le serveur dès le lancer du ballon',
            ].map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-yellow-400 mt-0.5">▸</span>{pt}
              </li>
            ))}
          </ul>
          <div className="border-l-4 border-red-500 pl-3 text-sm">
            <strong className="text-red-400">Erreur principale : </strong>
            <span className="text-gray-400">avoir les bras déjà joints en plateau avant que le ballon n'arrive — cela ralentit le déplacement et empêche le choix tardif manchette/mains.</span>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">La plateforme</h2>
        <div className="space-y-2">
          {PLATFORM_TIPS.map(([title, text], i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-yellow-400 mt-0.5 flex-shrink-0">▸</span>
              <span><strong className="text-white">{title} : </strong><span className="text-gray-400">{text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Execution steps */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Exécution — étapes clés</h2>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="bg-yellow-400 text-black text-sm font-bold w-6 h-6 flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <p className="text-gray-300 text-sm">{step}</p>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Le freeze : </strong>
          "Pose for a picture" — se figer complètement 1-2 secondes après le contact. À 50-90 km/h, un défenseur en mouvement ne peut pas ajuster son angle. Immobile, il peut partir dans n'importe quelle direction.
        </div>
      </section>

      {/* Displacements */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Déplacements</h2>
        <div className="space-y-3">
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} className="border-2 border-gray-700 p-4">
              <h3 className="text-white font-bold text-sm mb-2">{d.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
        <div className="border-2 border-gray-700 p-4">
          <div className="text-yellow-400 text-xs uppercase tracking-wider mb-2">Manchette à une main — urgence</div>
          <p className="text-gray-400 text-sm leading-relaxed">Geste de dernier recours quand le ballon est trop loin pour deux bras. Bras tendu, plateforme plate sur l'avant-bras intérieur, pas de swing — juste un piqué (stab) pour dévier vers le haut. Variante : one-arm stab (poing sur smash puissant), one-arm scoop (paume ouverte vers le haut, ballon bas).</p>
        </div>
      </section>

      {/* Systems */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Systèmes de réception</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {SYSTEMS.map((s, i) => (
            <div key={i} className={`border-2 p-5 space-y-3 ${i === 1 ? 'border-yellow-400 bg-yellow-400/5' : 'border-gray-700'}`}>
              <div>
                <h3 className="text-white font-bold text-sm">{s.name}</h3>
                <span className={`text-xs ${i === 1 ? 'text-yellow-400' : 'text-gray-500'}`}>{s.level}</span>
              </div>
              <p className="text-gray-400 text-sm">{s.desc}</p>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avantages</div>
                <ul className="space-y-1">
                  {s.pros.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-yellow-400 mt-0.5">▸</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Inconvénients</div>
                <ul className="space-y-1">
                  {s.cons.map((c, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-gray-600 mt-0.5">▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading the serve */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Lire le service pour se placer</h2>
        <div className="border-2 border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Type de service</th>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Adaptation du réceptionneur</th>
              </tr>
            </thead>
            <tbody>
              {READING_TABLE.map(([type, adapt], i) => (
                <tr key={i} className={`${i < READING_TABLE.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-900/50`}>
                  <td className="px-4 py-3 text-yellow-400 font-bold text-sm">{type}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{adapt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Indices avant le contact du serveur</div>
          <ul className="space-y-1">
            {READING_CUES.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-yellow-400 mt-0.5">▸</span>{cue}
              </li>
            ))}
          </ul>
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

    </div>
  );
}
