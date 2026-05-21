import { useState } from 'react';
import { getQuizBySlug } from '../data';
import { QuizPlayer } from './QuizPlayer';

type Props = {
  // Slug of the quiz to embed (must match an entry in QUIZZES).
  slug: string;
};

// Drop-in quiz block intended for the bottom of a related page (guide,
// system, etc.). Renders a sticker header + a "START" button on first
// view, then unfurls the QuizPlayer once the user opts in. The opt-in
// step keeps the parent page scannable for users who only want to read.
export function QuizEmbed({ slug }: Props) {
  const [started, setStarted] = useState(false);
  const quiz = getQuizBySlug(slug);

  if (!quiz) return null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--orange)',
            whiteSpace: 'nowrap',
          }}
        >
          ★ TESTE-TOI
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      {!started ? (
        <div
          style={{
            border: '3px solid var(--ink)',
            background: 'var(--cream)',
            boxShadow: 'var(--shadow)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '2px 10px',
                border: '2.5px solid var(--ink)',
                background: 'var(--teal)',
                fontFamily: '"Bungee", sans-serif',
                fontSize: 9,
                letterSpacing: '0.1em',
                color: 'var(--cream)',
              }}
            >
              QUIZ
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>
              {quiz.level}
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.4 }}>·</span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>
              {quiz.estimatedTime} · {quiz.questions.length} questions
            </span>
          </div>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: 0, letterSpacing: '0.03em' }}>
            {quiz.title}
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.55 }}>{quiz.subtitle}</p>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.55, lineHeight: 1.5 }}>{quiz.description}</p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            style={{
              alignSelf: 'flex-start',
              marginTop: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--orange)',
              color: 'var(--cream)',
              border: '2.5px solid var(--ink)',
              padding: '12px 22px',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 13,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            COMMENCER LE QUIZ →
          </button>
        </div>
      ) : (
        <QuizPlayer
          quiz={quiz}
          persistProgress
          onBackToHub={() => setStarted(false)}
        />
      )}
    </section>
  );
}
