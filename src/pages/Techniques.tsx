import { useState } from 'react';

type Level = 'Débutant' | 'Intermédiaire' | 'Avancé';

const LEVEL_STYLE: Record<Level, string> = {
  'Débutant': 'text-green-400 border-green-400/50',
  'Intermédiaire': 'text-yellow-400 border-yellow-400/50',
  'Avancé': 'text-orange-400 border-orange-400/50',
};

type Tag = 'Service' | 'Réception' | 'Passe' | 'Attaque' | 'Défense' | 'Débutant' | 'Intermédiaire' | 'Avancé';

const CATEGORY_TAGS: Tag[] = ['Service', 'Réception', 'Passe', 'Attaque', 'Défense'];
const LEVEL_TAGS: Tag[] = ['Débutant', 'Intermédiaire', 'Avancé'];

type Technique = {
  id: string;
  name: string;
  icon: string;
  level: Level;
  tags: Tag[];
  description: string;
  keyPoints: string[];
  errors: string[];
  videos: { title: string; url: string }[];
  when: string;
};

const TECHNIQUES: Technique[] = [
  {
    id: 'reception',
    name: 'Réception / Manchette',
    icon: '🤲',
    level: 'Débutant',
    tags: ['Réception', 'Défense', 'Débutant'],
    description: 'La manchette est le geste défensif universel. Les avant-bras joints forment une plateforme plate dirigeant le ballon vers le passeur. La plateforme est passive — les jambes font le travail de déplacement.',
    keyPoints: [
      'Plateforme : avant-bras joints, pouces parallèles vers le bas',
      'Sweet spot entre les poignets et les coudes (pas les poignets seuls)',
      '"Le ballon va où la plateforme regarde" — l\'angle commande la direction',
      'FREEZE au contact : s\'immobiliser avant que le ballon arrive',
      'Ne jamais swinger les bras — la plateforme est passive',
    ],
    errors: [
      'Swing des bras au contact (cause #1 — ballon imprévisible)',
      'Bras joints trop tôt avant le déplacement',
      'Plateforme cassée (un avant-bras plus haut que l\'autre)',
    ],
    videos: [
      { title: 'Faire une manchette (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
      { title: 'La manchette (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
    ],
    when: 'Réception de service, défense en fond de court, balle basse',
  },
  {
    id: 'set',
    name: 'Passe haute (Set)',
    icon: '🙌',
    level: 'Débutant',
    tags: ['Passe', 'Débutant'],
    description: 'Deuxième touche qui prépare l\'attaque. Les deux mains forment un triangle au-dessus du front. Le passeur est le chef d\'orchestre : sa précision et sa lecture du bloc adverse définissent l\'efficacité offensive.',
    keyPoints: [
      'Triangle pouce-index : "fenêtre" par laquelle on regarde la balle',
      'Contact : pulpe et 1ère phalange du pouce, index et majeur',
      'Pied droit légèrement avancé — "viseur" pointant la cible',
      'Pieds, hanches, épaules "squared up" vers la cible AVANT le contact',
      'Extension complète jambes-hanches-bras-poignets, suivi "Superman"',
    ],
    errors: [
      'Double touche visible (contact non simultané des deux mains)',
      'Épaules perpendiculaires au filet — balle trop loin',
      'Balle portée (lift) — contact trop lent',
    ],
    videos: [
      { title: 'Faire une passe à 10 doigts (Sikana)', url: 'https://www.youtube.com/watch?v=lEaaaxPJ1cQ' },
      { title: 'Exercice passe courte placée (Sikana)', url: 'https://www.youtube.com/watch?v=OERUFSUmFS4' },
    ],
    when: 'Deuxième touche pour préparer l\'attaque',
  },
  {
    id: 'spike',
    name: 'Attaque (Spike / Smash)',
    icon: '✊',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    description: 'Action ballistique la plus complexe : chaîne cinétique en série pieds → bassin → tronc → épaule → coude → poignet. Toute rupture dans cette chaîne brise le transfert d\'énergie.',
    keyPoints: [
      'Course d\'élan 3-4 pas : se terminer sur double appel gauche-droite',
      'Règle d\'or : les deux derniers pas sont les plus rapides (slow → fast)',
      'Contact légèrement en avant de l\'épaule — jamais derrière la tête',
      'Snap du poignet : la main "griffe" la balle par-dessus → topspin',
      'Sauter VERTICAL, pas vers le filet',
    ],
    errors: [
      'Timing d\'approche incorrect (trop tôt = re-saut sans puissance)',
      'Pas de snap du poignet — ballon plat sans topspin',
      'Atterrissage sur un seul pied (risque ACL)',
    ],
    videos: [
      { title: 'Comment attaquer — 3 étapes (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
      { title: 'Le smash au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
    ],
    when: 'Troisième touche pour terminer l\'échange',
  },
  {
    id: 'block',
    name: 'Contre (Block)',
    icon: '🛡️',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    description: 'Première ligne de défense face à l\'attaque. Le contact du bloc ne compte pas comme une touche d\'équipe. La clé : la séquence visuelle BALLON → PASSEUR → BALLON → ÉPAULE DU FRAPPEUR.',
    keyPoints: [
      'Position : 45-60 cm du filet, mains hautes (paumes face au filet)',
      'Saut APRÈS l\'attaquant : 0,2-0,3s pour une haute ball',
      'Pénétrer au maximum PAR-DESSUS le filet, pas juste vers le haut',
      'Doigts écartés, poignets rigides, pas de "trou" entre les mains',
      '"Sealing the net" : épaules, mains, bras devant les oreilles',
    ],
    errors: [
      'Sauter trop tôt (réagir au plant des pieds de l\'attaquant)',
      'Mains trop molles — ballon rebondit dans son propre camp',
      'Saut vers l\'avant → touche de filet',
    ],
    videos: [
      { title: 'Apprendre le contre (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
      { title: 'Le bloc (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
    ],
    when: 'En réponse à une attaque adverse au filet',
  },
  {
    id: 'serve',
    name: 'Service',
    icon: '🏐',
    level: 'Débutant',
    tags: ['Service', 'Débutant'],
    description: 'Seule action sans pression directe adverse. Quatre types existent selon le niveau. La règle d\'or : 80% des erreurs viennent du lancer (toss) — stabiliser le lancer avant de chercher la puissance.',
    keyPoints: [
      'Float debout : "punch and freeze" — arrêter le bras après contact pour aucun spin',
      'Jump float : même mécanique que float debout + élan court',
      'Jump topspin : snap complet du poignet, réservé après 1000+ reps',
      'Lancer (toss) stable = service stable — règle #1',
      'Viser les seams (espaces entre réceptionneurs) plus que les joueurs',
    ],
    errors: [
      'Float : suivi prolongé qui ajoute du spin (tue l\'effet flottant)',
      'Lancer instable ou trop haut',
      'Faute de pied sur la ligne de fond',
    ],
    videos: [
      { title: 'Servir flottant en 4 minutes', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Service : flottant + tennis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
    when: 'Début de chaque échange',
  },
  {
    id: 'defense',
    name: 'Défense (Dig)',
    icon: '🦅',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    description: 'La défense post-contre distingue les équipes intermédiaires des compétitives. Trois piliers : position basse, freeze au moment de la frappe adverse, lecture de l\'attaquant.',
    keyPoints: [
      'Position basse : pieds plus larges que les épaules, genoux à ~90°',
      '"Tête en avant des pieds, épaules en avant des genoux"',
      'FREEZE absolu au moment où l\'attaquant frappe',
      'Block shadow : si tu ne vois pas l\'attaquant, tu es derrière le bloc — repositionne-toi',
      'Sur smash dur : ne pas armer (la force du smash suffit) — absorber',
    ],
    errors: [
      'Encore en mouvement au contact — impossible de contrôler',
      'Se positionner dans le "shadow" du bloc (zone inutile)',
      'Plonger trop tôt alors qu\'un pas latéral suffisait',
    ],
    videos: [
      { title: 'Apprendre à défendre (Sikana)', url: 'https://www.youtube.com/watch?v=i0Io4-jeuyQ' },
      { title: 'Comment plonger au volleyball', url: 'https://www.youtube.com/watch?v=okxb3N03UWM' },
    ],
    when: 'Défense contre smash adverse, couverture du terrain arrière',
  },
];

export default function Techniques() {
  const [activeTags, setActiveTags] = useState<Tag[]>([]);

  const toggle = (tag: Tag) =>
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const filtered = activeTags.length === 0
    ? TECHNIQUES
    : TECHNIQUES.filter(t => activeTags.some(tag => t.tags.includes(tag)));

  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Techniques fondamentales</h1>
        <p className="text-gray-400">Les gestes clés du volleyball — descriptions, points clés, erreurs à éviter et ressources vidéo.</p>
      </div>

      {/* Filtres */}
      <div className="space-y-3">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="space-y-1.5">
            <div className="text-gray-600 text-xs uppercase tracking-widest">Catégorie</div>
            <div className="flex flex-wrap gap-1">
              {CATEGORY_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider border transition-colors ${
                    activeTags.includes(tag)
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-gray-600 text-xs uppercase tracking-widest">Niveau</div>
            <div className="flex flex-wrap gap-1">
              {LEVEL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider border transition-colors ${
                    activeTags.includes(tag)
                      ? `${LEVEL_STYLE[tag as Level]} bg-current/10`
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTags.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs">{filtered.length} technique{filtered.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => setActiveTags([])}
              className="text-xs text-gray-600 hover:text-yellow-400 transition-colors underline underline-offset-2"
            >
              Tout afficher
            </button>
          </div>
        )}
      </div>

      {/* Cartes */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-800" />
          <span className="text-gray-500 text-xs uppercase tracking-widest">Fiches techniques</span>
          <div className="h-px flex-1 bg-gray-800" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-12 border-2 border-gray-800">
            Aucune technique pour cette combinaison de filtres.
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="border-2 border-gray-700 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h2 className="text-white font-bold text-xl">{t.name}</h2>
                      <span className={`text-xs border px-2 py-0.5 ${LEVEL_STYLE[t.level]}`}>{t.level}</span>
                    </div>
                    <div className="text-yellow-400 text-xs uppercase tracking-wider">Quand : {t.when}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{t.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
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
                  <div>
                    <div className="text-red-400 text-xs uppercase tracking-wider mb-2">Erreurs à éviter</div>
                    <ul className="space-y-1">
                      {t.errors.map((err, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-red-400 mt-0.5">✗</span>
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {t.videos.length > 0 && (
                <div className="border-t border-gray-800 px-6 py-3 flex flex-wrap gap-2">
                  {t.videos.map((v, i) => (
                    <a
                      key={i}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors border border-gray-800 hover:border-yellow-400/50 px-2 py-1"
                    >
                      <span className="text-yellow-400">▶</span>
                      {v.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
