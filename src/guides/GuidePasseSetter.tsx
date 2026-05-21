import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import DrillList from '../drills/DrillList';

// Short setter guide — content is embedded in FR for this iteration. The
// long-form sections (philosophy, hand mechanics, footwork, distribution
// decisions) are intentionally compact; the bulk of the pedagogical value
// lives in the DrillList that follows.

const HAND_CUES: { label: string; text: string }[] = [
  { label: 'Triangle', text: "Pouces et index forment une fenêtre triangulaire juste au-dessus du front. La balle entre par cette fenêtre — pas par les paumes." },
  { label: 'Doigts écartés', text: 'Les pads (coussinets) des 10 doigts touchent le ballon, pas la paume. Tension légère, comme si tu tenais un ballon de basket-ball.' },
  { label: 'Coudes ouverts', text: "Coudes vers l'extérieur et vers le haut. Si tes coudes pointent vers l'avant, ton set sera court." },
  { label: 'Finition', text: 'Bras tendus en finale, pouces qui pointent vers la cible. La balle quitte les mains au-dessus du front, pas devant.' },
];

const FOOTWORK_STEPS: string[] = [
  'Pas 1 — gauche : avance dynamique vers la zone d\'arrivée prévue du ballon.',
  'Pas 2 — droit : ajustement, le pied droit arrive sous le ballon.',
  'Finition sur pied droit : le poids transfère du gauche au droit pendant le contact, jamais l\'inverse.',
  'Nez sous le ballon avant le contact — si tu vois ton triangle, le ballon est trop devant.',
];

const DECISIONS: { label: string; text: string }[] = [
  { label: 'Passe parfaite (à 3 m du filet)', text: '3 options actives : quick (MB), 2e tempo (OH), arrière (OPP). Choisir selon le bloc adverse.' },
  { label: 'Passe correcte (3-5 m)', text: '2 options : OH en zone 4 (set haut) ou OPP en zone 2. Le quick n\'est plus jouable.' },
  { label: 'Passe difficile (> 5 m ou hors zone)', text: 'Set sécurité — zone 4 haut. L\'objectif n\'est plus de surprendre, c\'est de garder l\'attaque.' },
  { label: 'Sur réception au filet', text: 'Saut-set ou bump-set (manchette). Pas de set debout — tu serais en faute de filet.' },
];

export default function GuidePasseSetter() {
  const { t: tD } = useTranslation('drills');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra="LE BLOC ADVERSE LIT TES PIEDS — PAS TES MAINS">
        Un passeur qui ajuste ses pieds AVANT le contact distribue à 3 options sans donner d'indice au bloc. Un passeur qui tourne le buste en l'air est lisible et bloqué.
      </GoldenRule>

      {/* Triangle des mains */}
      <section>
        <h2 style={S.section}>Mains et triangle</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          La forme des mains détermine la précision. 4 points à drilller au mur avant tout entraînement collectif.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {HAND_CUES.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{c.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footwork */}
      <section>
        <h2 style={S.section}>Footwork — pas du passeur</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          Pieds tournent en premier, mains en second. Le geste idéal finit sur le pied droit (droitier) avec le poids transféré vers la cible.
        </p>
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FOOTWORK_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Décisions */}
      <section>
        <h2 style={S.section}>Décisions de distribution</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          La qualité de réception conditionne tes options. Plus la passe est précise, plus tu peux varier les tempos.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DECISIONS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={S.labelTeal}>{d.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Drills */}
      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.set') })}</h2>
        <DrillList skill="set" />
      </section>
    </div>
  );
}
