import { useState } from 'react';
import type { Quiz, Question, QuizScore } from '../types';
import { readStoredProgress, useQuizProgress } from '../useQuizProgress';
import { shuffleQuiz } from '../shuffle';
import { Q } from './styles';
import { OptionList } from './OptionList';
import { AnswerFeedback } from './AnswerFeedback';
import { QuestionRotation } from './QuestionRotation';
import { QuestionPlacement } from './QuestionPlacement';
import { QuestionAttack } from './QuestionAttack';
import { QuizResult } from './QuizResult';

type Props = {
  quiz: Quiz;
  // Whether to persist the score to localStorage. The random-mode quiz uses
  // false so we don't pollute progress with reshuffled runs.
  persistProgress: boolean;
  onBackToHub: () => void;
};

// Top-level state machine for one quiz playthrough. Tracks the current
// question index, the selected option (null before answering), and the
// running score. When the user advances past the last question, we show
// the result screen and (if persistProgress) save the score.
export function QuizPlayer({ quiz, persistProgress, onBackToHub }: Props) {
  const [, recordScore] = useQuizProgress();
  // Per-session shuffle of both the question order and the options inside
  // each question. Replayed via `setQuestions(shuffleQuiz(...))` so a second
  // attempt never reproduces the exact same layout.
  const [questions, setQuestions] = useState<Question[]>(() => shuffleQuiz(quiz.questions));
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // Snapshot of the best score *at the start* of this run, so the result
  // screen can announce a personal best even after we've written the new one.
  // Read straight from localStorage rather than `useQuizProgress` state — the
  // hook hydrates inside useEffect, so its first-render value is always {}.
  const [snapshotBest] = useState<number | undefined>(() => {
    const stored: Record<string, QuizScore> = readStoredProgress();
    return stored[quiz.slug]?.bestScore;
  });

  const total = questions.length;
  const question = questions[index];
  const isLast = index === total - 1;
  const isAnswered = selectedId !== null;
  const correctId = question?.correctId;

  if (finished) {
    return (
      <QuizResult
        score={score}
        total={total}
        previousBest={snapshotBest}
        onReplay={() => {
          setQuestions(shuffleQuiz(quiz.questions));
          setIndex(0);
          setSelectedId(null);
          setScore(0);
          setFinished(false);
        }}
        onBackToHub={onBackToHub}
      />
    );
  }

  if (!question) {
    return (
      <p style={{ color: 'var(--orange)' }}>
        Aucune question disponible dans ce quiz.
      </p>
    );
  }

  const handleSelect = (id: string) => {
    if (selectedId !== null) return;
    setSelectedId(id);
    if (id === correctId) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      if (persistProgress) recordScore(quiz.slug, score, total);
      setFinished(true);
      return;
    }
    setIndex(i => i + 1);
    setSelectedId(null);
  };

  const progressPercent = ((index + (isAnswered ? 1 : 0)) / total) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
            letterSpacing: '0.08em',
            marginBottom: 6,
            color: 'var(--ink)',
            opacity: 0.75,
          }}
        >
          <span>QUESTION {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span>SCORE : {score}</span>
        </div>
        <div style={Q.progressTrack}>
          <div style={{ ...Q.progressFill, width: `${progressPercent}%` }} />
        </div>
      </div>

      <div style={Q.card}>
        <h2
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 18,
            letterSpacing: '0.02em',
            margin: '0 0 18px 0',
            lineHeight: 1.4,
          }}
        >
          {question.prompt}
        </h2>

        <RenderQuestion
          question={question}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {isAnswered && (
        <AnswerFeedback
          isCorrect={selectedId === correctId}
          explanation={question.explanation}
          isLast={isLast}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

function RenderQuestion({
  question,
  selectedId,
  onSelect,
}: {
  question: Question;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <OptionList
          options={question.options}
          selectedId={selectedId}
          correctId={question.correctId}
          onSelect={onSelect}
        />
      );
    case 'rotation':
      return (
        <QuestionRotation
          question={question}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      );
    case 'placement':
      return (
        <QuestionPlacement
          question={question}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      );
    case 'attack':
      return (
        <QuestionAttack
          question={question}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      );
  }
}

