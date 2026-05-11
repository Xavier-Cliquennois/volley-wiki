import { useState } from 'react';

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

const LEVEL_COLOR: Record<string, string> = {
  'Débutant': 'var(--mint)',
  'Débutant → Intermédiaire': 'var(--mint)',
  'Intermédiaire': 'var(--yellow)',
  'Intermédiaire+': 'var(--orange)',
  'Avancé': 'var(--orange)',
};

const PHASES = [
  ['Initiation', "Lecture du set et décision de l'approche"],
  ['Wind-up', "Début de la course d'élan"],
  ['Cocking', "Coude au-dessus de l'épaule, main derrière l'oreille — position de puissance"],
  ['Accélération', 'Rotation séquentielle : hanches → tronc → épaule → coude → poignet'],
  ['Contact + suivi', 'Snap du poignet, la main "griffe" la balle par-dessus → topspin'],
];

const APPROACH_3 = [
  ['Pas 1 (gauche)', "Pas court directionnel, orientation vers l'attaque"],
  ['Pas 2 (droit)', "Power step — long et bas, talon d'abord, abaissement du centre de gravité"],
  ['Pas 3 (gauche)', 'Closing step — court, freine la translation horizontale et la convertit en vertical'],
];

const APPROACH_4 = [
  ['Pas 1 (droit)', "Pas d'observation, rythme lent"],
  ['Pas 2 (gauche)', 'Accélération'],
  ['Pas 3 (droit)', 'Power step — le plus important, long et bas'],
  ['Pas 4 (gauche)', 'Closing step parallèle au filet'],
];

const TIMING_TABLE: [string, string][] = [
  ['Haute ball (3e tempo)', 'Commencer TARD — quand la balle quitte les mains du passeur'],
  ['2e tempo (Hut/Go)', 'Commencer quand la passe arrive vers le passeur'],
  ['1er tempo (Quick)', "Commencer TÔT — déjà en l'air quand le passeur touche la balle"],
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
    description: `Base d'apprentissage de l'attaque. L'attaquant aile (Outside Hitter) reçoit le plus grand volume de balles — c'est l'option "sécurité" du passeur. Approche à 45° depuis la gauche.`,
    keyPoints: [
      'Approche 4 pas à ~45° par rapport au filet',
      'Appel à 30-50 cm du filet',
      'Set "Hut" (3e tempo haut) ou "Go" (2e tempo rapide)',
      'Sauter VERTICALEMENT — pas vers le filet',
      "Contact légèrement en avant de l'épaule frappante",
    ],
    shots: ['Cross-court (diagonale)', 'Line shot (ligne latérale)', 'Cut shot (angle court <3 m)', 'Tip (feinte)', 'Roll shot (amortie topspin)'],
  },
  {
    id: 'middle',
    name: 'Attaque centrale (Quick / 1er tempo)',
    position: 'Avant centre',
    description: "L'attaque la plus rapide. Le central est en l'air AVANT ou au moment où le passeur touche la balle. Set très bas (30-50 cm) et très court.",
    keyPoints: [
      "Déclencher l'approche TÔT — déjà en l'air au set du passeur",
      'Approche 2-3 pas, bras déjà armé en montant',
      `Concept "Ghost Middle" : même si la balle n'arrive pas, courir le quick à fond pour fixer le bloc adverse → libère les ailiers`,
      'Contact à 30-50 cm au-dessus du filet',
      'Transition rapide : contre → approche en 1-2 secondes',
    ],
    shots: ['Quick devant passeur ("1")', 'Back-1 derrière passeur', 'Slide (départ arrière le long du filet)', '31/Gap (décalé entre passeur et antenne)'],
  },
  {
    id: 'opposite',
    name: 'Attaque en zone 2 (Opposé / Pointu)',
    position: 'Aile droite',
    description: "L'opposé (pointu) attaque depuis la zone 2. Idéal pour les gauchers (épaule frappante côté antenne droite = fenêtre maximale). Pour droitier : rotation du tronc plus prononcée, se positionner plus loin de l'antenne.",
    keyPoints: [
      "Approche symétrique à l'Outside mais depuis la droite",
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
    description: "Attaque depuis la zone arrière. Le plant DOIT se faire DERRIÈRE la ligne des 3 m. Permet d'avoir 4 attaquants face à 3 contreurs.",
    keyPoints: [
      'Appel obligatoirement derrière la ligne des 3 m (sinon faute)',
      'Atterrissage dans la zone avant après saut légal = OK',
      'Pipe : depuis P6, set arrière du quick (BIC = juste au-dessus du quick)',
      "Zone D : depuis P1, souvent attaque-refuge de l'opposé",
    ],
    shots: ['Pipe (arrière-centre)', 'Zone D (arrière-droit)', 'Zone A (arrière-gauche, rare)', 'Feinte sur mauvaise passe'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Feinte / Tip',
    level: 'Débutant → Intermédiaire',
    desc: "Approche IDENTIQUE au smash (déguisement crucial), puis au contact ralentir le bras et placer la balle d'un coup de doigts. Direction : zone vide repérée AVANT le saut.",
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
  ["Timing d'approche", 'Trop tôt : re-saut sans puissance. Trop tard : bras tendu en arrière au contact.'],
  ['Mauvais ordre de pieds', 'Terminer toujours sur gauche-droite (droitier) — les deux pieds quasi simultanés.'],
  ['Pas de topspin', 'Main plate = pas de snap = ballon trop long. "Griffer" la balle par-dessus.'],
  ['Faute de filet', "Saut vers l'avant sur set serré. Sauter VERTICAL, pas avant."],
  ['Faute de back-row', 'Pied sur ou devant la ligne des 3 m au décollage.'],
  ['Atterrissage un pied', 'Sauf pour le slide : atterrir sur les deux pieds pour protéger le genou (risque ACL).'],
];

const VIDEOS = [
  { title: 'Comment attaquer — 3 étapes (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'Le smash au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: "Course d'attaque détaillée", url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'La Séquence de Seb — tout sur le smash', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Sauter pour attaquer (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Attaquer placé (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaque() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>Les 5 phases du smash</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PHASES.map(([phase, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{phase} : </strong>
                <span style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14 }}>
          <strong style={{ color: 'var(--ink)' }}>Contact idéal : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Légèrement en avant de l'épaule frappante, jamais derrière la tête (perte de puissance + risque blessure). Distance au filet à l'impulsion : 30-50 cm minimum.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Course d'approche</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 pas — Débutant</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Gauche-droite-gauche (droitier)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_3.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>4 pas — Standard compétition</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Droite-gauche-droite-gauche (droitier)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Règle d'or : les deux derniers pas sont les plus rapides — slow → fast.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing selon le type de passe</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Type de passe</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Quand commencer l'approche</th>
              </tr>
            </thead>
            <tbody>
              {TIMING_TABLE.map(([type, timing], i) => (
                <tr key={i} style={{ borderBottom: i < TIMING_TABLE.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attack types */}
      <section>
        <h2 style={S.section}>Types d'attaque par poste</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {ATTACK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAttack(t.id)}
              style={{
                padding: '6px 14px',
                fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
                border: '2.5px solid var(--ink)',
                background: activeAttack === t.id ? 'var(--orange)' : 'var(--cream)',
                color: activeAttack === t.id ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                boxShadow: activeAttack === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.position}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{current.name}</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.position}</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6, marginBottom: 16 }}>{current.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <div style={S.labelTeal}>Points clés</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.keyPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.label}>Choix de tirs</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.shots.map((s, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special shots */}
      <section>
        <h2 style={S.section}>Attaques spéciales</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPECIAL_SHOTS.map((s, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{s.name}</div>
                <span style={{
                  fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 10px',
                  border: '1.5px solid var(--ink)',
                  background: LEVEL_COLOR[s.level] || 'var(--paper)',
                  color: 'var(--ink)', flexShrink: 0,
                }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
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

      {/* Règle d'or */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Règle d'or</div>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.04em', color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
            APPROCHE LENTE → RAPIDE → POWER STEP → CLOSING → SAUT VERTICAL → BRAS TENDU EN AVANT → SNAP DU POIGNET
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
            La puissance vient de la chaîne cinétique complète, pas du bras seul. Une approche rythmée avec les deux derniers pas rapides génère 70% de la puissance finale.
          </p>
        </div>
      </section>

    </div>
  );
}
