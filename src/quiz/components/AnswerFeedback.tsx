import { Q } from './styles';

type Props = {
  isCorrect: boolean;
  explanation: string;
  isLast: boolean;
  onNext: () => void;
};

// Banner shown under the options once the user has answered. Uses teal for
// correct, yellow (S.alert pattern) for incorrect. Includes the next-question
// CTA so the player can advance from here without scrolling further.
export function AnswerFeedback({ isCorrect, explanation, isLast, onNext }: Props) {
  return (
    <div style={isCorrect ? Q.feedbackCorrect : Q.feedbackIncorrect}>
      <div
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 12,
          letterSpacing: '0.14em',
          marginBottom: 8,
        }}
      >
        {isCorrect ? '✓ BIEN VU' : '✗ PAS TOUT À FAIT'}
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{explanation}</p>
      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={onNext}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 var(--ink)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = '';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
          }}
          style={Q.cta}
        >
          {isLast ? 'VOIR LE RÉSULTAT →' : 'QUESTION SUIVANTE →'}
        </button>
      </div>
    </div>
  );
}
