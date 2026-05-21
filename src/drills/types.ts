import type { Level } from '../userLevel/useUserLevel';

export type DrillSkill =
  | 'reception'
  | 'set'
  | 'attack'
  | 'defense'
  | 'serve'
  | 'block'
  | 'team-play';

export type TeamSize = 4 | 5 | 6;

export type DrillVariant = {
  level: Level;
  description: string;
};

export type DrillSetup = {
  duration: string;
  minPlayers: number;
  equipment: string[];
  teamSizes: TeamSize[];
};

export type Drill = {
  id: string;
  skill: DrillSkill;
  title: string;
  goal: string;
  setup: DrillSetup;
  variants: DrillVariant[];
  successCriteria: string[];
  coachingCues?: string[];
  sources?: string[];
};

export const SKILL_LABEL: Record<DrillSkill, string> = {
  reception: 'Réception',
  set: 'Passe (passeur)',
  attack: 'Attaque',
  defense: 'Défense',
  serve: 'Service',
  block: 'Contre',
  'team-play': 'Jeu collectif',
};

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

export const LEVEL_SHORT: Record<Level, string> = {
  beginner: 'DÉB',
  intermediate: 'INT',
  advanced: 'AVA',
};
