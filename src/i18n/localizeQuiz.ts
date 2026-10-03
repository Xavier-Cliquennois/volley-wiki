import { useTranslation } from 'react-i18next';
import type { Question, Quiz } from '../quiz/types';

type LocalizedQuestion = {
  prompt?: string;
  explanation?: string;
  // Option label by option id (multiple-choice and attack questions only;
  // rotation and placement options are built from ids by their components).
  options?: Record<string, string>;
};

type LocalizedQuiz = {
  title?: string;
  subtitle?: string;
  description?: string;
  questions?: Record<string, LocalizedQuestion>;
};

// The bundle holds one entry per quiz slug. Question and option ids are the
// keys, so the French source (and the progress saved against it) never moves.
type QuizContentBundle = Record<string, unknown>;

function applyQuestion(question: Question, overlay: LocalizedQuestion | undefined): Question {
  if (!overlay) return question;
  const base = {
    prompt: overlay.prompt ?? question.prompt,
    explanation: overlay.explanation ?? question.explanation,
  };
  // Each case stays separate so the union narrows correctly on the spread.
  switch (question.type) {
    case 'multiple-choice':
      return {
        ...question,
        ...base,
        options: question.options.map(o => ({ ...o, label: overlay.options?.[o.id] ?? o.label })),
      };
    case 'attack':
      return {
        ...question,
        ...base,
        options: question.options.map(o => ({ ...o, label: overlay.options?.[o.id] ?? o.label })),
      };
    case 'rotation':
      return { ...question, ...base };
    case 'placement':
      return { ...question, ...base };
  }
}

export type QuizLocalizer = {
  // Header texts (title, subtitle, description) and level of a quiz.
  quiz: (quiz: Quiz) => Quiz;
  // One question, translated just before rendering so the per-session
  // shuffle of the source questions stays valid when the language changes.
  question: (quizSlug: string, question: Question) => Question;
};

// Overlay the translated texts of the current language on the quizzes authored
// in French under `src/quiz`. A language without a `quizContent` bundle (or
// without an entry for a quiz, question or option) keeps the French source.
export function useQuizLocalizer(): QuizLocalizer {
  const { i18n } = useTranslation();
  const bundle = i18n.getResourceBundle(i18n.language, 'quizContent') as
    | QuizContentBundle
    | undefined;

  return {
    quiz: quiz => {
      const overlay = bundle?.[quiz.slug] as LocalizedQuiz | undefined;
      if (!overlay) return quiz;
      return {
        ...quiz,
        title: overlay.title ?? quiz.title,
        subtitle: overlay.subtitle ?? quiz.subtitle,
        description: overlay.description ?? quiz.description,
      };
    },
    question: (quizSlug, question) => {
      const overlay = (bundle?.[quizSlug] as LocalizedQuiz | undefined)?.questions?.[question.id];
      return applyQuestion(question, overlay);
    },
  };
}
