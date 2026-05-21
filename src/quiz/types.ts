import type { RoleCode, RotationId, SystemId, ZoneId } from '../systems/types';

export type QuizLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';
export type QuizCategory = 'Tactique' | 'Technique';

export type Option = {
  id: string;
  label: string;
};

type BaseQuestion = {
  id: string;
  prompt: string;
  explanation: string;
  // Always a string — the discriminated unions below narrow it to the matching
  // option id type (RotationId / ZoneId / string) for type-safe authoring.
  correctId: string;
};

// Plain QCM: any 3-4 textual options, one correct.
export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple-choice';
  options: Option[];
};

// Show a rotation diagram (no label) and ask the user to identify which
// rotation it is. The diagram is drawn from `systemId` + `rotationId`.
export type RotationQuestion = BaseQuestion & {
  type: 'rotation';
  systemId: SystemId;
  rotationId: RotationId;
  options: RotationId[];
  correctId: RotationId;
};

// Show the rotation with one role hidden, then propose 3-4 zones where the
// missing role might stand. The user picks the correct zone.
export type PlacementQuestion = BaseQuestion & {
  type: 'placement';
  systemId: SystemId;
  rotationId: RotationId;
  hiddenRole: RoleCode;
  options: ZoneId[];
  correctId: ZoneId;
};

// Show the rotation with a reception-quality indicator (a ball icon placed
// closer to or further from the setter target) and ask which attack option
// is the best call.
export type AttackQuestion = BaseQuestion & {
  type: 'attack';
  systemId: SystemId;
  rotationId: RotationId;
  receptionQuality: 'perfect' | 'medium' | 'poor';
  options: Option[];
};

export type Question =
  | MultipleChoiceQuestion
  | RotationQuestion
  | PlacementQuestion
  | AttackQuestion;

export type Quiz = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: QuizCategory;
  level: QuizLevel;
  // Approximate time to complete, shown on the hub card (e.g. "~3 min").
  estimatedTime: string;
  questions: Question[];
};

// Score record persisted in localStorage, keyed by quiz slug.
export type QuizScore = {
  bestScore: number;
  lastScore: number;
  total: number;
  lastPlayedAt: string;
  attempts: number;
};

export type QuizProgress = Record<string, QuizScore>;
