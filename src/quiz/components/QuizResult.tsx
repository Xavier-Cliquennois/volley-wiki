import type { QuizScore } from '../types';
import { Q } from './styles';

type Props = {
  score: number;
  total: number;
  previousBest?: number;
  onReplay: () => void;
  onBackToHub: () => void;
};

// Final screen shown after the last question. Highlights the score, whether
// it beats the previous best, and offers Replay + Back to hub.
export function QuizResult({ score, total, previousBest, onReplay, onBackToHub }: Props) {
  const percent = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isPersonalBest = previousBest !== undefined && score > previousBest;
  const verdict = verdictFor(percent);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          ...Q.card,
          background: isPerfect ? 'var(--teal)' : 'var(--paper)',
          color: isPerfect ? 'var(--cream)' : 'var(--ink)',
          textAlign: 'center',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            opacity: 0.7,
            marginBottom: 12,
          }}
        >
          {isPerfect ? '★ SANS FAUTE' : '★ RÉSULTAT'}
        </div>
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 'clamp(48px, 8vw, 72px)',
            letterSpacing: '0.04em',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {score} / {total}
        </div>
        <div
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 13,
            letterSpacing: '0.08em',
            opacity: 0.85,
          }}
        >
          {percent}% · {verdict}
        </div>
        {isPersonalBest && previousBest !== undefined && (
          <div
            style={{
              marginTop: 14,
              display: 'inline-block',
              padding: '4px 12px',
              background: 'var(--orange)',
              color: 'var(--cream)',
              border: '2.5px solid var(--ink)',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 11,
              letterSpacing: '0.1em',
            }}
          >
            ★ NOUVEAU MEILLEUR SCORE ({previousBest} → {score})
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" onClick={onReplay} style={Q.cta}>
          REJOUER →
        </button>
        <button type="button" onClick={onBackToHub} style={Q.ctaSecondary}>
          ← FERMER LE QUIZ
        </button>
      </div>
    </div>
  );
}

function verdictFor(percent: number): string {
  if (percent === 100) return 'Maîtrise totale';
  if (percent >= 80) return 'Bien dominé';
  if (percent >= 60) return 'Bon départ — revois les justifications';
  if (percent >= 40) return 'Encore du chemin — relis les guides liés';
  return 'À retravailler avec les guides';
}

export type { QuizScore };
