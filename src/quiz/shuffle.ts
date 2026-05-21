import type { Question } from './types';

// Fisher-Yates shuffle. Returns a new array — caller's input is not mutated.
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Re-orders a question's options so a replay never shows the same answer
// in the same slot. The `correctId` is preserved — only positions shift.
// Each case stays separate so the union narrows correctly on the spread.
export function shuffleQuestionOptions(question: Question): Question {
  switch (question.type) {
    case 'multiple-choice':
      return { ...question, options: shuffle(question.options) };
    case 'attack':
      return { ...question, options: shuffle(question.options) };
    case 'rotation':
      return { ...question, options: shuffle(question.options) };
    case 'placement':
      return { ...question, options: shuffle(question.options) };
  }
}

// Builds a fresh per-session question list: questions reordered + options
// of each question reshuffled. Called once at mount and again on replay.
export function shuffleQuiz(questions: readonly Question[]): Question[] {
  return shuffle(questions).map(shuffleQuestionOptions);
}
