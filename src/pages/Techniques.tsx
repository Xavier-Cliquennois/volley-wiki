const TECHNIQUES = [
  {
    id: 'bump',
    name: 'Manchette (Bump)',
    icon: '🤲',
    description: 'La manchette est le geste de réception de base. Les avant-bras sont joints, formant une plateforme plate pour renvoyer le ballon vers le haut.',
    keyPoints: [
      'Avant-bras parallèles et joints',
      'Genoux fléchis, poids vers l\'avant',
      'Frapper avec la partie plate des avant-bras',
      'Ne pas lever les bras — laisser le ballon rebondir',
    ],
    when: 'Réception de service, défense en fond de court',
  },
  {
    id: 'set',
    name: 'Passe en touche (Set)',
    icon: '🙌',
    description: 'La passe en touche propulse le ballon vers l\'attaquant. Les deux mains forment un triangle au-dessus du front pour un contact précis.',
    keyPoints: [
      'Mains en triangle au-dessus du front',
      'Pousser avec les doigts, pas les paumes',
      'Genoux déplier au moment du contact',
      'Orienter les épaules vers la cible',
    ],
    when: 'Deuxième touche pour préparer l\'attaque',
  },
  {
    id: 'spike',
    name: 'Attaque (Spike)',
    icon: '✊',
    description: 'L\'attaque par frappe descendante est le geste offensif principal. L\'attaquant saute et frappe le ballon avec force vers le terrain adverse.',
    keyPoints: [
      'Course d\'élan de 3 à 4 pas',
      'Double impulsion pieds : gauche-droite pour droitier',
      'Bras armé en arrière (épaule)',
      'Fouetté du bras avec snap du poignet',
    ],
    when: 'Troisième touche pour marquer le point',
  },
  {
    id: 'block',
    name: 'Contre (Block)',
    icon: '🛡️',
    description: 'Le contre est la première ligne de défense face à l\'attaque adverse. Un ou plusieurs joueurs sautent au filet pour intercepter le ballon.',
    keyPoints: [
      'Rester face au filet, proche de celui-ci',
      'Sauter juste après l\'attaquant adverse',
      'Pénétrer les mains au-dessus du filet',
      'Orienter les mains vers le terrain adverse',
    ],
    when: 'En réponse à une attaque adverse au filet',
  },
  {
    id: 'serve',
    name: 'Service',
    icon: '🏐',
    description: 'Le service met le ballon en jeu. Il existe plusieurs variantes : service par en-dessous (débutant), flottant (efficace), et sauté (élite).',
    keyPoints: [
      'Lancer le ballon régulièrement',
      'Service flottant : pas de rotation = trajectoire imprévisible',
      'Service sauté : similaire à l\'attaque',
      'Viser les zones difficiles pour les récepteurs',
    ],
    when: 'Début de chaque échange',
  },
];

export default function Techniques() {
  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Techniques fondamentales</h1>
        <p className="text-gray-400">Les gestes clés du volleyball, de la réception à l'attaque.</p>
      </div>

      {/* Technique cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-800" />
          <span className="text-gray-500 text-xs uppercase tracking-widest">Fiches techniques</span>
          <div className="h-px flex-1 bg-gray-800" />
        </div>

        {TECHNIQUES.map(t => (
          <div key={t.id} className="border-2 border-gray-700 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <h2 className="text-white font-bold text-xl mb-1">{t.name}</h2>
                <div className="text-yellow-400 text-xs uppercase tracking-wider">Quand : {t.when}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.description}</p>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Points clés</div>
              <ul className="space-y-1">
                {t.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
