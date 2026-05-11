const S = {
  section: { fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 14, paddingBottom: 8, borderBottom: '2.5px solid var(--ink)' } as React.CSSProperties,
  label: { fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--orange)', marginBottom: 4 },
  labelTeal: { fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--teal)', marginBottom: 4 },
  card: { background: 'var(--paper)', border: '2.5px solid var(--ink)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' } as React.CSSProperties,
  alert: { background: 'var(--yellow)', border: '2.5px solid var(--ink)', padding: '14px 18px', boxShadow: 'var(--shadow-sm)' } as React.CSSProperties,
  bullet: { color: 'var(--teal)', marginTop: 2, flexShrink: 0 } as React.CSSProperties,
  bulletOrange: { color: 'var(--orange)', marginTop: 2, flexShrink: 0 } as React.CSSProperties,
  stepBadge: { background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 12, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as React.CSSProperties,
};

function VideoLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: '2px solid var(--ink)', padding: '8px 12px',
        fontFamily: '"DM Mono", monospace', fontSize: 12,
        color: 'var(--ink)', textDecoration: 'none',
        background: 'var(--cream)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink)'; }}
    >
      <span style={{ color: 'var(--orange)' }}>▶</span>
      <span style={{ flex: 1 }}>{title}</span>
      <span style={{ fontSize: 10, opacity: 0.5 }}>YT</span>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <div style={S.alert}>
        <div style={S.label}>Règle d'or</div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: 0 }}>
          La manchette détermine 60% du succès offensif d'une équipe. Sans bonne réception, pas d'attaque rapide. La plateforme est passive — les jambes sont actives.
        </p>
      </div>

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

      {/* Systems */}
      <section>
        <h2 style={S.section}>Systèmes de réception</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {SYSTEMS.map((s, i) => (
            <div key={i} style={{ ...S.card, borderColor: i === 1 ? 'var(--orange)' : 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 2 }}>{s.name}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: i === 1 ? 'var(--orange)' : 'var(--ink)', opacity: i === 1 ? 1 : 0.5 }}>{s.level}</span>
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

      {/* Errors */}
      <section>
        <h2 style={S.section}>Erreurs fréquentes</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>À éviter</div>
          {ERRORS.map(([label, text], i) => (
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
