import { useState } from 'react';

type Level = 'Débutant' | 'Intermédiaire' | 'Avancé';

const LEVEL_COLOR: Record<Level, string> = {
  'Débutant': 'var(--mint)',
  'Intermédiaire': 'var(--yellow)',
  'Avancé': 'var(--orange)',
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
      `"Le ballon va où la plateforme regarde" — l'angle commande la direction`,
      "FREEZE au contact : s'immobiliser avant que le ballon arrive",
      'Ne jamais swinger les bras — la plateforme est passive',
    ],
    errors: [
      'Swing des bras au contact (cause #1 — ballon imprévisible)',
      'Bras joints trop tôt avant le déplacement',
      "Plateforme cassée (un avant-bras plus haut que l'autre)",
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
    description: "Deuxième touche qui prépare l'attaque. Les deux mains forment un triangle au-dessus du front. Le passeur est le chef d'orchestre : sa précision et sa lecture du bloc adverse définissent l'efficacité offensive.",
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
    when: "Deuxième touche pour préparer l'attaque",
  },
  {
    id: 'spike',
    name: 'Attaque (Spike / Smash)',
    icon: '✊',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    description: "Action ballistique la plus complexe : chaîne cinétique en série pieds → bassin → tronc → épaule → coude → poignet. Toute rupture dans cette chaîne brise le transfert d'énergie.",
    keyPoints: [
      "Course d'élan 3-4 pas : se terminer sur double appel gauche-droite",
      "Règle d'or : les deux derniers pas sont les plus rapides (slow → fast)",
      "Contact légèrement en avant de l'épaule — jamais derrière la tête",
      'Snap du poignet : la main "griffe" la balle par-dessus → topspin',
      'Sauter VERTICAL, pas vers le filet',
    ],
    errors: [
      "Timing d'approche incorrect (trop tôt = re-saut sans puissance)",
      'Pas de snap du poignet — ballon plat sans topspin',
      'Atterrissage sur un seul pied (risque ACL)',
    ],
    videos: [
      { title: 'Comment attaquer — 3 étapes (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
      { title: 'Le smash au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
    ],
    when: "Troisième touche pour terminer l'échange",
  },
  {
    id: 'block',
    name: 'Contre (Block)',
    icon: '🛡️',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    description: "Première ligne de défense face à l'attaque. Le contact du bloc ne compte pas comme une touche d'équipe. La clé : la séquence visuelle BALLON → PASSEUR → BALLON → ÉPAULE DU FRAPPEUR.",
    keyPoints: [
      'Position : 45-60 cm du filet, mains hautes (paumes face au filet)',
      "Saut APRÈS l'attaquant : 0,2-0,3s pour une haute ball",
      'Pénétrer au maximum PAR-DESSUS le filet, pas juste vers le haut',
      'Doigts écartés, poignets rigides, pas de "trou" entre les mains',
      '"Sealing the net" : épaules, mains, bras devant les oreilles',
    ],
    errors: [
      "Sauter trop tôt (réagir au plant des pieds de l'attaquant)",
      'Mains trop molles — ballon rebondit dans son propre camp',
      "Saut vers l'avant → touche de filet",
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
    description: "Seule action sans pression directe adverse. Quatre types existent selon le niveau. La règle d'or : 80% des erreurs viennent du lancer (toss) — stabiliser le lancer avant de chercher la puissance.",
    keyPoints: [
      'Float debout : "punch and freeze" — arrêter le bras après contact pour aucun spin',
      'Jump float : même mécanique que float debout + élan court',
      'Jump topspin : snap complet du poignet, réservé après 1000+ reps',
      'Lancer (toss) stable = service stable — règle #1',
      'Viser les seams (espaces entre réceptionneurs) plus que les joueurs',
    ],
    errors: [
      "Float : suivi prolongé qui ajoute du spin (tue l'effet flottant)",
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
    description: "La défense post-contre distingue les équipes intermédiaires des compétitives. Trois piliers : position basse, freeze au moment de la frappe adverse, lecture de l'attaquant.",
    keyPoints: [
      'Position basse : pieds plus larges que les épaules, genoux à ~90°',
      '"Tête en avant des pieds, épaules en avant des genoux"',
      "FREEZE absolu au moment où l'attaquant frappe",
      "Block shadow : si tu ne vois pas l'attaquant, tu es derrière le bloc — repositionne-toi",
      'Sur smash dur : ne pas armer (la force du smash suffit) — absorber',
    ],
    errors: [
      'Encore en mouvement au contact — impossible de contrôler',
      'Se positionner dans le "shadow" du bloc (zone inutile)',
      "Plonger trop tôt alors qu'un pas latéral suffisait",
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ DOCUMENTATION
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          TECHNIQUES FONDAMENTALES
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          Les gestes clés du volleyball — descriptions, points clés, erreurs à éviter et ressources vidéo.
        </p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 8, opacity: 0.6 }}>CATÉGORIE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORY_TAGS.map(tag => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    style={{
                      padding: '6px 14px',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      border: '2.5px solid var(--ink)',
                      background: on ? 'var(--orange)' : 'var(--cream)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      boxShadow: on ? 'var(--shadow-sm)' : 'none',
                      transform: on ? 'translate(-1px,-1px)' : 'none',
                      transition: 'all 0.08s',
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 8, opacity: 0.6 }}>NIVEAU</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {LEVEL_TAGS.map(tag => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    style={{
                      padding: '6px 14px',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      border: '2.5px solid var(--ink)',
                      background: on ? LEVEL_COLOR[tag as Level] : 'var(--cream)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      boxShadow: on ? 'var(--shadow-sm)' : 'none',
                      transform: on ? 'translate(-1px,-1px)' : 'none',
                      transition: 'all 0.08s',
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, opacity: 0.6 }}>{filtered.length} technique{filtered.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => setActiveTags([])}
              style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.08em', color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              TOUT AFFICHER
            </button>
          </div>
        )}
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>★ FICHES TECHNIQUES</span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.length === 0 ? (
          <div style={{ border: '3px dashed var(--ink)', padding: '32px 20px', textAlign: 'center', background: 'var(--paper)' }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, opacity: 0.6 }}>AUCUNE TECHNIQUE POUR CETTE COMBINAISON</div>
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--ink)', background: 'var(--paper)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 30 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: 0, letterSpacing: '0.03em' }}>{t.name}</h2>
                    <span style={{
                      padding: '2px 10px',
                      border: '2.5px solid var(--ink)',
                      background: LEVEL_COLOR[t.level],
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                    }}>{t.level.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, letterSpacing: '0.08em', color: 'var(--teal)' }}>
                    QUAND : {t.when}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{t.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                  {/* Key points */}
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>
                      ★ POINTS CLÉS
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {t.keyPoints.map((pt, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45 }}>
                          <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Errors */}
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 }}>
                      ✗ ERREURS À ÉVITER
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {t.errors.map((err, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45 }}>
                          <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Videos */}
              {t.videos.length > 0 && (
                <div style={{ borderTop: '2px dashed rgba(26,24,18,0.18)', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {t.videos.map((v, i) => (
                    <a
                      key={i}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px',
                        border: '2px solid var(--ink)',
                        fontFamily: '"DM Mono", monospace',
                        fontSize: 11,
                        color: 'var(--ink)',
                        textDecoration: 'none',
                        background: 'var(--cream)',
                        transition: 'all 0.08s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--teal)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--cream)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--cream)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
                      }}
                    >
                      <span style={{ color: 'var(--orange)', fontSize: 10 }}>▶</span>
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
