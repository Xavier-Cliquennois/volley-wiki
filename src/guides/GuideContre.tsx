const TIMING_STEPS = [
  {
    title: 'Observez l\'attaquant, pas le ballon',
    desc: 'Regardez les épaules et le bras de l\'attaquant pour anticiper le moment et la direction de la frappe.',
  },
  {
    title: 'Sautez APRÈS l\'attaquant',
    desc: 'Attendez que l\'attaquant soit dans sa phase d\'impulsion. Si vous sautez en même temps ou avant, vous redescendrez trop tôt.',
  },
  {
    title: 'Le décalage idéal : 0,2 à 0,3 secondes',
    desc: 'Comptez mentalement "UN" quand l\'attaquant saute, puis sautez immédiatement après. Cette fraction de seconde est cruciale.',
  },
  {
    title: 'Pénétrez au-dessus du filet',
    desc: 'Au sommet de votre saut, poussez vos mains et bras vers l\'avant et vers le bas — pas juste vers le haut.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'Le contre offensif',
    objectif: 'Renvoyer le ballon directement dans le camp adverse',
    points: [
      ['Position', 'Mains écartées, doigts tendus et écartés'],
      ['Action', 'Pénétrer au maximum au-dessus du filet, bras tendus vers l\'avant'],
      ['Cible', 'Gainez vos poignets pour rabattre le ballon vers le sol adverse'],
      ['Quand', 'Quand vous êtes bien placé et que vous avez lu l\'attaque'],
    ],
  },
  {
    name: 'Le contre de couverture',
    objectif: 'Ralentir le ballon pour permettre à votre défense de récupérer',
    points: [
      ['Position', 'Mains rapprochées, paumes orientées vers vous'],
      ['Action', 'Absorber l\'impact plutôt que de pousser'],
      ['Résultat', 'Le ballon retombe doucement dans votre camp pour être joué'],
      ['Quand', 'Quand vous êtes en retard ou mal placé'],
    ],
  },
  {
    name: 'Le contre de fixation',
    objectif: 'Empêcher certaines zones d\'attaque',
    points: [
      ['Position', 'Bloquer une zone spécifique (ligne ou diagonale)'],
      ['Action', 'Orienter vos mains vers la zone à protéger'],
      ['Tactique', 'Forcer l\'attaquant à frapper dans une zone où vos défenseurs sont prêts'],
      ['Quand', 'En accord avec votre défense arrière'],
    ],
  },
  {
    name: 'Le contre à 2 ou 3 (block collectif)',
    objectif: 'Créer un mur impénétrable',
    points: [
      ['Coordination', 'Sauter ensemble au même moment'],
      ['Placement', 'Les contreurs extérieurs se placent en fonction du contreur central'],
      ['Mains', 'Joindre vos mains avec celles de vos partenaires (pas d\'espace)'],
      ['Communication', 'Un contreur annonce "ligne" ou "diagonale" pour coordonner'],
    ],
  },
];

const TIMING_TIPS = [
  ['Exercice du "un-deux"', 'À l\'entraînement, dites "UN" quand l\'attaquant saute, "DEUX" quand vous sautez. Cela crée le décalage nécessaire.'],
  ['Regardez les épaules', 'L\'orientation des épaules de l\'attaquant indique la direction de la frappe.'],
  ['Analysez la passe', 'Une passe haute = plus de temps. Une passe tendue = réaction rapide.'],
  ['Positionnez-vous tôt', 'Mieux vaut être en position d\'attente que de courir au dernier moment.'],
  ['Travaillez votre détente', 'Plus vous sautez haut, plus vous avez de marge d\'erreur sur le timing.'],
];

const SAUT_POSITION = [
  'Pieds écartés à la largeur des épaules',
  'Poids sur l\'avant des pieds',
  'Genoux légèrement fléchis',
  'Bras le long du corps ou légèrement devant',
  'Position à environ 30–50 cm du filet',
];

const SAUT_IMPULSION = [
  ['Pas chassé', 'Si vous devez vous déplacer, utilisez un pas chassé rapide'],
  ['Fléchissez', 'Fléchissez vos jambes rapidement (ne descendez pas trop bas)'],
  ['Balancier des bras', 'Lancez vos bras vers le haut de manière explosive'],
  ['Extension complète', 'Tendez complètement vos jambes pour maximiser la hauteur'],
];

const SAUT_EN_LAIR = [
  'Gardez vos bras tendus et serrés',
  'Mains écartées, doigts tendus et écartés',
  'Pénétrez au-dessus du filet (pas de touche de filet !)',
  'Gainez votre tronc pour rester stable',
];

const ERREURS = [
  ['Sauter trop tôt', 'Vous redescendez quand l\'attaquant frappe — attendez plus longtemps !'],
  ['Regarder le ballon', 'Vous perdez des informations sur l\'attaquant — regardez le joueur !'],
  ['Mains trop molles', 'Le ballon rebondit dans votre camp — tendez et gainez vos doigts !'],
  ['Sauter vers l\'avant', 'Vous touchez le filet — sautez verticalement !'],
  ['Baisser les bras trop tôt', 'Gardez vos bras levés jusqu\'à ce que vous retombiez.'],
];

const EXERCICES = [
  {
    title: 'Timing avec partenaire',
    desc: 'Un partenaire fait semblant d\'attaquer (sans ballon). Vous travaillez uniquement le timing de votre saut. Répétez 20 fois.',
  },
  {
    title: 'Contre sur attaque fixe',
    desc: 'Un attaquant frappe depuis une position fixe. Concentrez-vous sur le timing et la technique. Augmentez progressivement la vitesse.',
  },
  {
    title: 'Lecture d\'épaules',
    desc: 'L\'attaquant varie ses frappes (ligne/diagonale). Essayez de lire ses épaules pour anticiper la direction.',
  },
  {
    title: 'Déplacements + contre',
    desc: 'Travaillez vos déplacements latéraux rapides suivis d\'un contre. Simule les situations de match.',
  },
];

const CONSEILS_PRO = [
  ['Patience', 'Le contre est une des techniques les plus difficiles. Soyez patient avec vous-même.'],
  ['Répétition', 'La mémoire musculaire se crée avec des centaines de répétitions.'],
  ['Vidéo', 'Filmez-vous pour analyser votre timing et votre technique.'],
  ['Observez les pros', 'Regardez comment les joueurs professionnels lisent le jeu et timent leurs sauts.'],
  ['Commencez simple', 'Maîtrisez le contre contre des attaques lentes avant de passer aux attaques rapides.'],
];

export default function GuideContre() {
  return (
    <div className="space-y-10">

      {/* Fondamentaux */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Les fondamentaux du contre</h2>
        <div className="border-2 border-gray-700 p-5">
          <p className="text-gray-300 text-sm leading-relaxed">
            Le contre (ou block) est un geste défensif crucial qui peut devenir une arme offensive.
            La clé réside dans le <span className="text-yellow-400 font-bold">timing parfait</span> et une bonne lecture du jeu.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Le timing : la clé du succès</h2>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-5">
          {TIMING_STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="bg-yellow-400 text-black text-sm font-bold w-7 h-7 flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-white text-sm font-bold">{step.title}</p>
                <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types de contres */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Les différents types de contres</h2>
        <div className="space-y-3">
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} className="border-2 border-gray-700 p-5 space-y-3">
              <h4 className="text-white font-bold">{i + 1}. {type.name}</h4>
              <div className="text-xs uppercase tracking-wider">
                <span className="text-gray-500">Objectif : </span>
                <span className="text-gray-300">{type.objectif}</span>
              </div>
              <ul className="space-y-1">
                {type.points.map(([label, text], j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    <span>
                      <strong className="text-white">{label} : </strong>
                      <span className="text-gray-400">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Astuces timing */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Astuces pour améliorer votre timing</h2>
        <div className="border-l-4 border-yellow-400 pl-5 py-1 space-y-3">
          {TIMING_TIPS.map(([label, text], i) => (
            <div key={i} className="text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Séquence visuelle élite */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Séquence visuelle élite</h2>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-4">
          <p className="text-gray-300 text-sm">Les meilleurs contreurs ne regardent pas le ballon — ils suivent une séquence précise :</p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
            {['BALLON', 'PASSEUR', 'BALLON', 'ÉPAULE DU FRAPPEUR'].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black px-2 py-1 text-xs">{step}</span>
                {i < 3 && <span className="text-yellow-400">→</span>}
              </div>
            ))}
          </div>
          <ul className="space-y-1">
            {[
              ['1. BALLON', 'Voir le ballon partir vers le passeur'],
              ['2. PASSEUR', 'Lire les mains du passeur au moment du contact — direction du set'],
              ['3. BALLON', 'Suivre brièvement le ballon pour confirmer la direction'],
              ['4. ÉPAULE DU FRAPPEUR', 'Verrouiller sur l\'épaule de l\'attaquant — donne la direction de frappe avant le contact'],
            ].map(([label, text], i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-400 mt-0.5">▸</span>
                <span><strong className="text-white">{label} : </strong><span className="text-gray-400">{text}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timing précis par type d'attaque */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Timing précis selon le type d'attaque</h2>
        <div className="border-2 border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Type d'attaque</th>
                <th className="px-4 py-2 text-left text-gray-500 text-xs uppercase tracking-wider">Timing du saut contreur</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1er tempo (central)', 'AVEC ou un poil avant le hitter (commit block)'],
                ['Tendue / 2e tempo ailier', '~0,1s après le hitter'],
                ['Haute ball ailier (3e tempo)', '0,2–0,3s après le hitter'],
                ['Set serré près du filet', 'AVEC le hitter'],
                ['Set éloigné du filet', '~0,5s après ou ne pas sauter'],
                ['Slide (central)', 'AVEC ou juste après — suivre latéralement'],
              ].map(([type, timing], i, arr) => (
                <tr key={i} className={`${i < arr.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-900/50`}>
                  <td className="px-4 py-3 text-yellow-400 font-bold text-sm">{type}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read vs Commit blocking */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Read blocking vs Commit blocking</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Read blocking — recommandé</h3>
            <p className="text-gray-400 text-sm">Le contreur attend la décision du passeur, lit le ballon et l\'attaquant, puis se déplace. Position "bunch read" (tous proches du centre, puis explosion vers le pin).</p>
            <ul className="space-y-1">
              {['Stable et présent sur la majorité des sets', 'Préserve les hanches et genoux', 'Adapté à tous les niveaux amateur'].map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-yellow-400 mt-0.5">▸</span>{pt}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-gray-600 p-4 space-y-3">
            <h3 className="text-gray-300 text-xs uppercase tracking-wider font-bold">Commit blocking — avancé/pro</h3>
            <p className="text-gray-400 text-sm">Le central décide AVANT le release du passeur de sauter avec le quick. Annule l\'attaque rapide adverse, mais si le passeur sette ailleurs, le central est complètement hors jeu.</p>
            <ul className="space-y-1">
              {['Efficace contre les centraux dominants', 'Risque élevé si le passeur adapte', 'Réservé aux joueurs avec excellente lecture'].map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-gray-600 mt-0.5">▸</span>{pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technique de saut */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">La technique de saut pour le contre</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Position de départ</h3>
            <ul className="space-y-1">
              {SAUT_POSITION.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-0.5">▸</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">L'impulsion</h3>
            <ul className="space-y-1">
              {SAUT_IMPULSION.map(([label, text], i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-400 mt-0.5">▸</span>
                  <span>
                    <strong className="text-white">{label} : </strong>
                    <span className="text-gray-400">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">En l'air</h3>
            <ul className="space-y-1">
              {SAUT_EN_LAIR.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-0.5">▸</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Erreurs fréquentes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Erreurs fréquentes à éviter</h2>
        <div className="border-l-4 border-red-500 pl-5 py-1 space-y-3">
          <div className="text-red-400 text-xs uppercase tracking-wider mb-2">Erreurs courantes</div>
          {ERREURS.map(([label, text], i) => (
            <div key={i} className="text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Exercices d'entraînement</h2>
        <div className="space-y-3">
          {EXERCICES.map((ex, i) => (
            <div key={i} className="border-2 border-gray-700 p-4 flex gap-4 items-start">
              <span className="text-yellow-400 text-xs uppercase tracking-wider flex-shrink-0 w-5 text-right">{i + 1}.</span>
              <div>
                <h3 className="text-white text-sm font-bold mb-1">{ex.title}</h3>
                <p className="text-gray-400 text-sm">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conseils de pro */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Conseils de pro</h2>
        <div className="border-l-4 border-yellow-400 pl-5 py-1 space-y-3">
          {CONSEILS_PRO.map(([label, text], i) => (
            <div key={i} className="text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Règle d'or */}
      <section>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-6 space-y-4">
          <h2 className="text-yellow-400 text-xs uppercase tracking-widest font-bold">La règle d'or</h2>
          <p className="text-white font-bold text-sm leading-relaxed tracking-wide">
            BALLON → PASSEUR → BALLON → ÉPAULE DU FRAPPEUR → SAUT → PÉNÉTRATION
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Avec de la pratique régulière et une attention particulière au timing, vous améliorerez considérablement
            vos contres. Mieux vaut un contre bien timé avec une détente moyenne qu'un saut très haut mais mal timé.
          </p>
        </div>
      </section>

      {/* Vidéos */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Ressources vidéo</h2>
        <div className="space-y-2">
          {[
            { title: 'Apprendre le contre (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'Le bloc au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Exercice : sauter pour contrer', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Exercice : contrer une attaque', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              <span className="text-yellow-400">▶</span>
              <span className="flex-1">{v.title}</span>
              <span className="text-gray-600 text-xs">YT</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
