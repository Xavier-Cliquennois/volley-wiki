import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import DrillList from '../drills/DrillList';

// Short team-play guide focused on transitions, coverage and communication.
// The substance lives in the drills (pepper, wash, transition, queen of the
// court) — this guide provides the framing.

const PHASES: { phase: string; items: string[] }[] = [
  {
    phase: 'Phase 1 — Side-out (réception)',
    items: [
      'R-S-A : réception → passe → attaque, sans transition.',
      'Couverture immédiate de l\'attaquant par 3 joueurs en triangle.',
      "Objectif : marquer ou forcer une free ball adverse.",
    ],
  },
  {
    phase: 'Phase 2 — Défense / contre',
    items: [
      'Bloc + arrière : 2-3 blockers + 3 défenseurs en couverture des angles.',
      'Communication en continu : "ligne", "diag", "tip".',
      'Si défense propre → enchaîner attaque rapide en transition.',
    ],
  },
  {
    phase: 'Phase 3 — Transition',
    items: [
      'Phase la plus difficile : tous les joueurs sont déjà mobilisés ailleurs.',
      'Le passeur doit anticiper sa course vers le filet dès la défense.',
      'Les attaquants reprennent leur course d\'approche depuis n\'importe quelle position.',
    ],
  },
];

const COVERAGE: { label: string; text: string }[] = [
  { label: 'Triangle de couverture', text: '3 joueurs à 2 m de l\'attaquant : passeur côté ligne, libero/back-row côté diagonale, opposite (ou OH non-attaquant) derrière.' },
  { label: 'Distance', text: 'Trop près = le ballon survole, trop loin = pas le temps de défendre. 2 m est la zone d\'or.' },
  { label: 'Posture', text: 'Bas, plateforme prête. Le ballon couvert arrive vite et bas (rebond bloc).' },
  { label: 'Erreur classique', text: 'Joueurs qui regardent leur attaquant frapper — ils ne sont pas prêts pour la couverture. Yeux sur le bloc adverse.' },
];

const COMMUNICATION: { label: string; text: string }[] = [
  { label: 'Avant le service', text: 'Annonce du serveur ("zone 1", "zone 5"). Annonce des rôles défensifs ("je libère 2", "tu prends ligne").' },
  { label: 'Pendant la réception', text: '"Mine!" / "Yours!" — le premier à crier prend. Pas de double cri sur la même balle.' },
  { label: 'Sur l\'attaque adverse', text: '"Tip!" si feinte courte, "Out!" si balle sortante. Personne ne défend une out.' },
  { label: 'Après le point', text: 'Reset rapide — 1 phrase pour corriger ou féliciter. Pas de discussion longue qui casse le tempo.' },
];

export default function GuideJeuCollectif() {
  const { t: tD } = useTranslation('drills');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra="COUVERTURE À CHAQUE ATTAQUE — SANS EXCEPTION">
        Un attaquant qui sait que son équipe le couvre ose plus. Une équipe qui ne couvre pas perd 30% de ses attaques bloquées sur des balles récupérables.
      </GoldenRule>

      {/* 3 phases */}
      <section>
        <h2 style={S.section}>Les 3 phases du jeu</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          Tout point passe par 1, 2 ou 3 de ces phases. Le jeu collectif consiste à les enchaîner sans temps mort, en sachant où être quand.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {PHASES.map((p, idx) => (
            <div key={idx} style={S.card}>
              <div style={S.label}>{p.phase}</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                {p.items.map((it, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Couverture */}
      <section>
        <h2 style={S.section}>Couverture en triangle</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          Chaque attaque doit déclencher 3 joueurs en couverture. Le moment où le ballon est bloqué et revient dans ton camp est trop tard pour réagir.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {COVERAGE.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={S.labelTeal}>{c.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Communication */}
      <section>
        <h2 style={S.section}>Communication</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          Une équipe silencieuse perd des ballons sur des doubles cris (deux joueurs vont au même ballon) ou des "abandons" (personne n'y va). Parler n'est pas optionnel.
        </p>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COMMUNICATION.map((c, i) => (
            <div key={i} style={{ fontSize: 13.5 }}>
              <strong style={{ color: 'var(--ink)' }}>{c.label} : </strong>
              <span style={{ opacity: 0.85 }}>{c.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Drills */}
      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.team-play') })}</h2>
        <DrillList skill="team-play" />
      </section>
    </div>
  );
}
