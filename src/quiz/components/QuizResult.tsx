import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const percent = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isPersonalBest = previousBest !== undefined && score > previousBest;
  const verdict = t(`quiz.verdict.${verdictKey(percent)}`);

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
          {isPerfect ? t('quiz.flawless') : t('quiz.result')}
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
            {t('quiz.newBest', { previous: previousBest, score })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" onClick={onReplay} style={Q.cta}>
          {t('quiz.replay')}
        </button>
        <button type="button" onClick={onBackToHub} style={Q.ctaSecondary}>
          {t('quiz.close')}
        </button>
      </div>
    </div>
  );
}

// Key of the verdict in the `quiz.verdict` common namespace.
function verdictKey(percent: number): 'perfect' | 'high' | 'good' | 'mid' | 'low' {
  if (percent === 100) return 'perfect';
  if (percent >= 80) return 'high';
  if (percent >= 60) return 'good';
  if (percent >= 40) return 'mid';
  return 'low';
}

export type { QuizScore };
