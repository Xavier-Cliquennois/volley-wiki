import { useState } from 'react';

const LEVEL_COLOR: Record<string, string> = {
  'Débutant': 'var(--mint)',
  'Intermédiaire': 'var(--yellow)',
  'Avancé': 'var(--orange)',
  'Compétition': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Compétition': '#fff',
};

function VideoLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px',
        border: '2px solid var(--ink)',
        background: 'var(--cream)',
        fontFamily: '"DM Mono", monospace',
        fontSize: 12,
        color: 'var(--ink)',
        textDecoration: 'none',
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
      <span style={{ flex: 1 }}>{title}</span>
      <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, opacity: 0.5 }}>YT</span>
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
    description: "Geste pendulaire du bras frappant sous la taille. Légal à tous les niveaux, recommandé aux débutants ou en cas de blessure d'épaule. Quasi inexistant au-dessus du niveau régional adulte.",
    biomechanics: [
      'Chaîne cinétique courte : bassin → épaule → bras → main',
      'Mouvement pendulaire sans rotation du tronc',
      'Transfert de poids : pied arrière → pied avant',
      'Contact : talon de la main ou poing fermé sous le centre du ballon',
    ],
    steps: [
      'Pied gauche en avant, poids sur la jambe arrière',
      "Main gauche tient le ballon à hauteur du bassin dans l'axe du bras",
      'Bras droit armé en arrière, paume ouverte ou poing fermé',
      'Relâcher le ballon juste avant le contact — ne pas lancer',
      "Balancier vers l'avant, frappe sous le centre du ballon",
      'Bras suit et pointe la cible, poids transféré sur le pied avant',
    ],
    errors: [
      ['Ballon tenu trop bas ou écarté', "Maintenir le ballon à hauteur du bassin, dans l'axe du bras frappant"],
      ['Frappe avec les doigts', 'Utiliser le talon de la main — surface plus large et stable'],
      ['Lancer trop haut', 'Simplement relâcher le ballon, ne pas le lancer en hauteur'],
      ['Poignet mou', 'Bloquer le bras au contact pour un impact net'],
    ],
    exercises: [
      'Bowling-cerceaux : viser des zones à 4 m du filet',
      "10 services à 4 m puis reculer d'1 m par série jusqu'à la ligne de fond",
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
    description: `Service sans rotation produisant une trajectoire imprévisible (effet "knuckleball"). À une vitesse critique (~12-13 m/s), des tourbillons asymétriques créent des forces de portance latérales aléatoires. C'est le service à maîtriser en priorité.`,
    biomechanics: [
      'Chaîne cinétique complète : jambes → bassin → tronc → épaule → coude → main',
      `Position "arc et flèche" : coude haut au-dessus de l'épaule, main derrière l'oreille`,
      "Poignet BLOQUÉ et ferme — condition absolue pour l'effet float",
      'Contact : talon de main au centre du ballon',
      `"Punch and freeze" : suivi COURT — la main s'arrête immédiatement après le contact`,
    ],
    steps: [
      "Corps à 45° par rapport au filet, pieds écartés largeur d'épaules",
      "Bras gauche tendu devant l'épaule, ballon à hauteur de la tête",
      `Lancer très court : "placer" le ballon 30-50 cm au-dessus de l'épaule — le ballon ne tourne pas`,
      'Pied gauche avance vers la cible juste après le placement du ballon',
      'Extension complète du bras au contact, main ferme et plate',
      'FREEZE : arrêt immédiat du geste après le contact — aucun suivi du bras',
    ],
    errors: [
      ['Suivi prolongé du bras', "Cause #1 d'échec : le suivi ajoute du spin qui tue le float — freeze immédiat"],
      ['Lancer trop haut', 'Le ballon tombe dans le filet — lancer court, 30-50 cm seulement'],
      ['Lancer qui tourne', 'Induit du spin sur le ballon — placer le ballon, ne pas le lancer'],
      ['Contact avec la paume seule', 'Utiliser le talon de main (bas de la paume) pour une surface plane'],
    ],
    exercises: [
      'Toss & Drop : marquer une zone au sol, lancer 20 fois sans frapper — objectif 18/20 sur la marque',
      `Mur "punch and freeze" à 3 m : travailler l'arrêt immédiat du geste`,
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
    description: "Float avec course d'élan courte et saut. Gagne en hauteur de contact, vitesse et angle de descente. Devenu le standard des élites féminines (86% des services en pro féminin selon les études récentes). Moins risqué que le jump topspin tout en étant plus déstabilisant que le float debout.",
    biomechanics: [
      "Course d'élan courte (2 à 4 pas)",
      'Bras en position arc-et-flèche pendant le saut — différent du smash où les bras propulsent',
      "L'élan apporte la vitesse-balle, pas le bras seul",
      'Contact en point haut légèrement devant la tête',
      'Poignet bloqué + freeze identique au float debout',
    ],
    steps: [
      'Position 2-3 m derrière la ligne, ballon dans la main gauche',
      "Pas 1 (droit) d'amorce, bras détendus",
      'Pas 2 (gauche) : lancer le ballon à ~1,5 m de hauteur, sans rotation',
      'Pas 3 + hop : appel sur les deux pieds derrière la ligne — bras montent en arc-et-flèche',
      "Saut vertical et légèrement vers l'avant, corps gainé",
      'Frappe bras tendu, talon de main au centre du ballon',
      'FREEZE immédiat — atterrissage dans le terrain',
    ],
    errors: [
      ['Lancer trop haut', 'Réflexe jump spin — garder le lancer court comme pour le float debout'],
      ["Bras qui swingent comme à l'attaque", 'Devient un smash avec spin — maintenir la position arc-et-flèche'],
      ['Suivi prolongé', 'Identique au float debout : freeze obligatoire'],
      ['Faute de pied au décollage', "Vérifier que l'appel se fait derrière la ligne de fond"],
    ],
    exercises: [
      "Maîtriser le float debout (freeze solide) avant d'ajouter l'élan",
      'Élan seul sans frapper : travailler le lancer stable à faible hauteur',
      'Jump float à vitesse contrôlée : la régularité avant la puissance',
    ],
    videos: [
      { title: "Service sauté flottant — INF'AUX ENTRAÎNEURS (Bretagne)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + smashé (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Service topspin en saut',
    level: 'Compétition',
    tagline: 'jump serve — smash depuis derrière la ligne',
    description: `"Smash depuis derrière la ligne" : ballon frappé à pleine vitesse avec topspin (50-60 mph en club fort). Plus haut potentiel d'ace mais aussi le plus haut taux d'erreur. Réservé à ceux ayant investi 1000+ répétitions à l'entraînement.`,
    biomechanics: [
      "Course d'élan 3-4 pas identique à un smash de back-row",
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
      "Pas 3 (droit) : power step long, centre de gravité qui s'abaisse",
      "Pas 4 (gauche) : appel, bras s'élancent vers le haut",
      'Saut explosif vertical-avant',
      'Frappe au sommet : main passe par-dessus le ballon (10h), paume puis doigts qui roulent',
      'Snap du poignet complet + suivi — atterrissage 1-2 m dans le terrain',
    ],
    errors: [
      ['Lancer trop bas ou derrière soi', 'Cause #1 du filet — le lancer doit être haut et devant'],
      ['Lancer trop en avant', 'Faute de pied — respecter les limites de la zone de service'],
      ['Manque de snap du poignet', 'Le ballon sort long sans spin descendant'],
      ['Utilisation en match sans préparation', "1000 répétitions à l'entraînement d'abord — règle d'or"],
    ],
    exercises: [
      "Règle d'or : 1000 répétitions à l'entraînement avant utilisation en match",
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
  ['Zone 4 — avant gauche court', "Force l'attaquant principal à passer ET attaquer"],
  ['Zone 5 — arrière gauche profond', "Diagonale longue, taux d'erreur élevé"],
  ['Zone 6 — arrière centre profond', 'Servir long contre les passeurs petits'],
];

const S: Record<string, React.CSSProperties> = {
  sectionTitle: {
    fontFamily: '"Bungee", sans-serif', fontSize: 18, letterSpacing: '0.03em',
    margin: '0 0 18px 0', paddingBottom: 10, borderBottom: '3px solid var(--ink)',
  },
  label: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 10 },
  labelTeal: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 },
  labelOrange: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 },
  card: { border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 },
  alert: { border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px' },
};

export default function GuideService() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Règle d'or */}
      <div style={S.alert}>
        <div style={{ ...S.label, color: 'var(--ink)' }}>★ RÈGLE D'OR</div>
        <p style={{ margin: 0, fontFamily: '"Bungee", sans-serif', fontSize: 14, lineHeight: 1.45 }}>
          80% des erreurs au service viennent du lancer (toss). Stabiliser le lancer en priorité avant de chercher la puissance.
        </p>
      </div>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>TYPES DE SERVICE</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SERVICE_TYPES.map(t => {
            const on = activeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  padding: '7px 16px',
                  fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.06em',
                  border: '2.5px solid var(--ink)',
                  background: on ? LEVEL_COLOR[t.level] : 'var(--cream)',
                  color: on && LEVEL_TEXT[t.level] ? LEVEL_TEXT[t.level] : 'var(--ink)',
                  cursor: 'pointer',
                  boxShadow: on ? 'var(--shadow-sm)' : 'none',
                  transform: on ? 'translate(-1px,-1px)' : 'none',
                  transition: 'all 0.08s',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <span style={{
          padding: '3px 12px',
          border: '2.5px solid var(--ink)',
          background: LEVEL_COLOR[current.level],
          fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.1em',
          display: 'inline-block',
          color: LEVEL_TEXT[current.level] || 'var(--ink)',
        }}>{current.level.toUpperCase()}</span>

        <div style={S.card}>
          <h3 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, margin: '0 0 4px 0' }}>{current.name}</h3>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6, marginBottom: 14 }}>{current.tagline}</div>
          <p style={{ margin: '0 0 18px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{current.description}</p>

          <div style={{ marginBottom: 18 }}>
            <div style={S.labelTeal}>BIOMÉCANIQUE CLÉ</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>ÉTAPES D'EXÉCUTION (DROITIER)</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{
                    background: 'var(--orange)', color: 'var(--ink)',
                    fontFamily: '"Bungee", sans-serif', fontSize: 11,
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div>
              <div style={S.labelOrange}>✗ ERREURS FRÉQUENTES</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.errors.map(([label, fix], i) => (
                  <li key={i} style={{ fontSize: 13 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                      <strong>{label}</strong>
                    </div>
                    <div style={{ paddingLeft: 20, marginTop: 3, fontSize: 12, opacity: 0.65 }}>{fix}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.labelTeal}>★ EXERCICES</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {current.exercises.map((e, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                    <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {current.videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...S.label, opacity: 0.6 }}>VIDÉOS — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>ZONES CIBLES & TACTIQUE</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>ZONE ADVERSE</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>EFFET TACTIQUE</th>
              </tr>
            </thead>
            <tbody>
              {ZONES_TABLE.map(([zone, effect], i) => (
                <tr key={i} style={{ borderBottom: i < ZONES_TABLE.length - 1 ? '2px solid var(--ink)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--orange)' }}>{zone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, opacity: 0.8 }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Les seams', "Viser l'espace entre deux réceptionneurs est plus efficace que viser un joueur — la communication adverse est mise à l'épreuve."],
            ['Alterner court/long', "Empêche le passeur de savoir quand reculer. Le float court (zones 2-3-4) derrière la ligne d'attaque gêne particulièrement."],
            ['Métrique FBSO%', "Un service qui réduit le First Ball Side Out adverse de 70% à 45% sans faire d'ace est un service très efficace."],
          ].map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
              <span><strong>{title} : </strong><span style={{ opacity: 0.8 }}>{text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section>
        <div style={{ border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow)', padding: 20 }}>
          <div style={{ ...S.label, marginBottom: 16 }}>★ HIÉRARCHIE D'APPRENTISSAGE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
            {SERVICE_TYPES.map(t => (
              <div key={t.id} style={{ border: '2px solid var(--ink)', background: 'var(--cream)', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: LEVEL_COLOR[t.level] === 'var(--yellow)' ? 'var(--ink)' : LEVEL_COLOR[t.level], marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.6 }}>{t.level}</div>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
            Maîtriser chaque niveau avant de passer au suivant. <strong>La régularité prime sur la puissance.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
