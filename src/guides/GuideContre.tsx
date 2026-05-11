import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: "Observez l'attaquant, pas le ballon",
    desc: "Regardez les épaules et le bras de l'attaquant pour anticiper le moment et la direction de la frappe.",
  },
  {
    title: "Sautez APRÈS l'attaquant",
    desc: "Attendez que l'attaquant soit dans sa phase d'impulsion. Si vous sautez en même temps ou avant, vous redescendrez trop tôt.",
  },
  {
    title: 'Le décalage idéal : 0,2 à 0,3 secondes',
    desc: `Comptez mentalement "UN" quand l'attaquant saute, puis sautez immédiatement après. Cette fraction de seconde est cruciale.`,
  },
  {
    title: 'Pénétrez au-dessus du filet',
    desc: "Au sommet de votre saut, poussez vos mains et bras vers l'avant et vers le bas — pas juste vers le haut.",
  },
];

const CONTRE_TYPES = [
  {
    name: 'Le contre offensif',
    objectif: 'Renvoyer le ballon directement dans le camp adverse',
    points: [
      ['Position', 'Mains écartées, doigts tendus et écartés'],
      ['Action', "Pénétrer au maximum au-dessus du filet, bras tendus vers l'avant"],
      ['Cible', 'Gainez vos poignets pour rabattre le ballon vers le sol adverse'],
      ['Quand', "Quand vous êtes bien placé et que vous avez lu l'attaque"],
    ],
  },
  {
    name: 'Le contre de couverture',
    objectif: 'Ralentir le ballon pour permettre à votre défense de récupérer',
    points: [
      ['Position', 'Mains rapprochées, paumes orientées vers vous'],
      ['Action', "Absorber l'impact plutôt que de pousser"],
      ['Résultat', 'Le ballon retombe doucement dans votre camp pour être joué'],
      ['Quand', 'Quand vous êtes en retard ou mal placé'],
    ],
  },
  {
    name: 'Le contre de fixation',
    objectif: "Empêcher certaines zones d'attaque",
    points: [
      ['Position', 'Bloquer une zone spécifique (ligne ou diagonale)'],
      ['Action', 'Orienter vos mains vers la zone à protéger'],
      ['Tactique', "Forcer l'attaquant à frapper dans une zone où vos défenseurs sont prêts"],
      ['Quand', 'En accord avec votre défense arrière'],
    ],
  },
  {
    name: 'Le contre à 2 ou 3 (block collectif)',
    objectif: 'Créer un mur impénétrable',
    points: [
      ['Coordination', 'Sauter ensemble au même moment'],
      ['Placement', 'Les contreurs extérieurs se placent en fonction du contreur central'],
      ['Mains', "Joindre vos mains avec celles de vos partenaires (pas d'espace)"],
      ['Communication', 'Un contreur annonce "ligne" ou "diagonale" pour coordonner'],
    ],
  },
];

const TIMING_TIPS = [
  ['Exercice du "un-deux"', `À l'entraînement, dites "UN" quand l'attaquant saute, "DEUX" quand vous sautez. Cela crée le décalage nécessaire.`],
  ['Regardez les épaules', "L'orientation des épaules de l'attaquant indique la direction de la frappe."],
  ['Analysez la passe', 'Une passe haute = plus de temps. Une passe tendue = réaction rapide.'],
  ['Positionnez-vous tôt', "Mieux vaut être en position d'attente que de courir au dernier moment."],
  ['Travaillez votre détente', "Plus vous sautez haut, plus vous avez de marge d'erreur sur le timing."],
];

const SAUT_POSITION = [
  'Pieds écartés à la largeur des épaules',
  "Poids sur l'avant des pieds",
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
  ['Sauter trop tôt', "Vous redescendez quand l'attaquant frappe — attendez plus longtemps !"],
  ['Regarder le ballon', "Vous perdez des informations sur l'attaquant — regardez le joueur !"],
  ['Mains trop molles', 'Le ballon rebondit dans votre camp — tendez et gainez vos doigts !'],
  ["Sauter vers l'avant", 'Vous touchez le filet — sautez verticalement !'],
  ['Baisser les bras trop tôt', "Gardez vos bras levés jusqu'à ce que vous retombiez."],
];

const EXERCICES = [
  {
    title: 'Timing avec partenaire',
    desc: "Un partenaire fait semblant d'attaquer (sans ballon). Vous travaillez uniquement le timing de votre saut. Répétez 20 fois.",
  },
  {
    title: 'Contre sur attaque fixe',
    desc: 'Un attaquant frappe depuis une position fixe. Concentrez-vous sur le timing et la technique. Augmentez progressivement la vitesse.',
  },
  {
    title: "Lecture d'épaules",
    desc: "L'attaquant varie ses frappes (ligne/diagonale). Essayez de lire ses épaules pour anticiper la direction.",
  },
  {
    title: 'Déplacements + contre',
    desc: "Travaillez vos déplacements latéraux rapides suivis d'un contre. Simule les situations de match.",
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="BALLON → PASSEUR → BALLON → ÉPAULE DU FRAPPEUR → SAUT → PÉNÉTRATION">
        Avec de la pratique régulière et une attention particulière au timing, vous améliorerez considérablement vos contres. Mieux vaut un contre bien timé avec une détente moyenne qu'un saut très haut mais mal timé.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>Les fondamentaux du contre</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Le contre (ou block) est un geste défensif crucial qui peut devenir une arme offensive.
            La clé réside dans le <strong style={{ color: 'var(--orange)' }}>timing parfait</strong> et une bonne lecture du jeu.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Le timing : la clé du succès</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {TIMING_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 4px 0' }}>{step.title}</p>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types de contres */}
      <section>
        <h2 style={S.section}>Les différents types de contres</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Objectif : </span>
                <span style={{ color: 'var(--teal)' }}>{type.objectif}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {type.points.map(([label, text], j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Astuces timing */}
      <section>
        <h2 style={S.section}>Astuces pour améliorer votre timing</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIMING_TIPS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Séquence visuelle élite */}
      <section>
        <h2 style={S.section}>Séquence visuelle élite</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>Les meilleurs contreurs ne regardent pas le ballon — ils suivent une séquence précise :</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['BALLON', 'PASSEUR', 'BALLON', 'ÉPAULE DU FRAPPEUR'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. BALLON', 'Voir le ballon partir vers le passeur'],
              ['2. PASSEUR', 'Lire les mains du passeur au moment du contact — direction du set'],
              ['3. BALLON', 'Suivre brièvement le ballon pour confirmer la direction'],
              ['4. ÉPAULE DU FRAPPEUR', "Verrouiller sur l'épaule de l'attaquant — donne la direction de frappe avant le contact"],
            ].map(([label, text], i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bulletOrange}>▸</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timing précis par type d'attaque */}
      <section>
        <h2 style={S.section}>Timing précis selon le type d'attaque</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Type d'attaque</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Timing du saut contreur</th>
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
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read vs Commit blocking */}
      <section>
        <h2 style={S.section}>Read blocking vs Commit blocking</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>Read blocking — recommandé</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>Le contreur attend la décision du passeur, lit le ballon et l'attaquant, puis se déplace. Position "bunch read" (tous proches du centre, puis explosion vers le pin).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Stable et présent sur la majorité des sets', 'Préserve les hanches et genoux', 'Adapté à tous les niveaux amateur'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — avancé/pro</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>Le central décide AVANT le release du passeur de sauter avec le quick. Annule l'attaque rapide adverse, mais si le passeur sette ailleurs, le central est complètement hors jeu.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Efficace contre les centraux dominants', 'Risque élevé si le passeur adapte', 'Réservé aux joueurs avec excellente lecture'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technique de saut */}
      <section>
        <h2 style={S.section}>La technique de saut pour le contre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Position de départ', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: "L'impulsion", items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: "En l'air", items: SAUT_EN_LAIR.map(p => ({ text: p })) },
          ] as Array<{ title: string; items: Array<{ label?: string; text: string }> }>).map((col, ci) => (
            <div key={ci} style={S.card}>
              <div style={S.label}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>
                      {'label' in item && item.label ? <><strong>{item.label} : </strong></> : null}
                      <span style={{ opacity: 0.8 }}>{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Erreurs fréquentes */}
      <section>
        <h2 style={S.section}>Erreurs fréquentes à éviter</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Erreurs courantes</div>
          {ERREURS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section>
        <h2 style={S.section}>Exercices d'entraînement</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--orange)', flexShrink: 0, width: 24, textAlign: 'right' }}>{i + 1}.</span>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{ex.title}</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conseils de pro */}
      <section>
        <h2 style={S.section}>Conseils de pro</h2>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONSEILS_PRO.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vidéos */}
      <section>
        <h2 style={S.section}>Ressources vidéo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Apprendre le contre (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'Le bloc au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Exercice : sauter pour contrer', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Exercice : contrer une attaque', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
