// Catalog of high-level "bricks" the editor exposes — each brick expands at
// compile time into a sequence of low-level TimelineActions (move/pose).
//
// Bricks are persisted in EditorStep.actions[] and live alongside the snapshot.
// They are the canonical way to express a smash, a block, a serve — anything
// involving a vertical (jump) or composite gesture that would be a pain to
// hand-author as separate moves and poses.

import type { PlayerRole } from '../../scenarios/types';

// Common kinds of bricks. Stable identifiers — used as discriminators and
// stored in saved scenarios, so renaming one is a breaking change.
export type BrickKind =
  // Attack
  | 'SMASH'
  | 'BIDOUILLE'
  | 'FEINTE'
  | 'JUMP_SERVE'
  | 'FLOAT_SERVE'
  // Distribution / second touch
  | 'PASSE_HAUTE'
  | 'PASSE_TENDUE'
  // Defense
  | 'BLOC'
  | 'MANCHETTE'
  | 'DEFENSE_PLONGEE'
  // Movement-only
  | 'COURSE_ELAN'
  | 'PENETRATION'
  | 'RECUL_3M';

// Bricks sit in one of these UX buckets — used by the "add brick" panel
// to organize the toolbar.
export type BrickCategory = 'attack' | 'distribution' | 'defense' | 'movement';

// Fine-grained discriminated union — each kind owns its own params shape.
// All bricks share: a stable id, a player target, and an optional description.

type BrickBase = {
  id: string;
  playerId: string;
  description?: string;
};

export type SmashBrick = BrickBase & {
  kind: 'SMASH';
  // Where the player hits the ball (at jump apex). z near 0 = at the net.
  impact: [number, number, number];
  // Peak jump height in metres. ~1.6 = textbook 6v6 attack.
  jumpHeight?: number;
  // Where the player lands. Defaults to (impact.x, 0, impact.z + 0.4).
  landing?: [number, number, number];
};

export type BidouilleBrick = BrickBase & {
  kind: 'BIDOUILLE';
  impact: [number, number, number];
};

export type FeinteBrick = BrickBase & {
  kind: 'FEINTE';
  impact: [number, number, number];
  jumpHeight?: number;
  landing?: [number, number, number];
};

export type JumpServeBrick = BrickBase & {
  kind: 'JUMP_SERVE';
  impact: [number, number, number];
  jumpHeight?: number;
  landing?: [number, number, number];
};

export type FloatServeBrick = BrickBase & {
  kind: 'FLOAT_SERVE';
  // No jump. Player just stands and strikes from `impact` (their position).
  impact: [number, number, number];
};

export type PasseHauteBrick = BrickBase & {
  kind: 'PASSE_HAUTE';
  impact: [number, number, number];
};

export type PasseTendueBrick = BrickBase & {
  kind: 'PASSE_TENDUE';
  impact: [number, number, number];
};

export type BlocBrick = BrickBase & {
  kind: 'BLOC';
  // Where the blocker reaches up. Defaults to (player.x, 0, -0.4) i.e. at the net.
  impact: [number, number, number];
  jumpHeight?: number;
  landing?: [number, number, number];
};

export type ManchetteBrick = BrickBase & {
  kind: 'MANCHETTE';
  impact: [number, number, number];
};

export type DefensePlongeeBrick = BrickBase & {
  kind: 'DEFENSE_PLONGEE';
  // Where the player ends up on the ground (after the dive).
  impact: [number, number, number];
};

export type CourseElanBrick = BrickBase & {
  kind: 'COURSE_ELAN';
  // Where the player ends up at the end of the run-up (typically a couple
  // of metres before the impact spot, ready to jump). The starting position
  // is whatever the player held at the previous snapshot — that's already
  // visible on the canvas so a separate `from` marker would just duplicate it.
  to: [number, number, number];
};

export type PenetrationBrick = BrickBase & {
  kind: 'PENETRATION';
  // Final spot for the setter — usually [1.5, 0, 0.8] (close to the net, between P2 and P3).
  to: [number, number, number];
};

export type Recul3mBrick = BrickBase & {
  kind: 'RECUL_3M';
  // Where the attacker pulls back to. Usually [x, 0, 3.5] for the 3 m line.
  to: [number, number, number];
};

export type BrickAction =
  | SmashBrick
  | BidouilleBrick
  | FeinteBrick
  | JumpServeBrick
  | FloatServeBrick
  | PasseHauteBrick
  | PasseTendueBrick
  | BlocBrick
  | ManchetteBrick
  | DefensePlongeeBrick
  | CourseElanBrick
  | PenetrationBrick
  | Recul3mBrick;

// UI metadata for each brick — drives the "add brick" panel.
export type BrickMeta = {
  kind: BrickKind;
  label: string;
  category: BrickCategory;
  // Roles for which the brick makes sense — used to grey out impossible combos
  // in the toolbar when a non-matching player is selected. `null` = always allowed.
  validRoles: ReadonlyArray<PlayerRole> | null;
  // One-sentence summary used in tooltips and the brick row header.
  description: string;
  // Sub-actions the brick generates at compile time. Shown in the tooltip so
  // the author sees what's bundled inside (the runtime gets ~3-5 actions per
  // brick — this list is what the auto-snap logic produces).
  subActions: ReadonlyArray<string>;
};

export const BRICK_CATALOG: ReadonlyArray<BrickMeta> = [
  // Attack
  {
    kind: 'SMASH', label: 'Smash', category: 'attack',
    validRoles: ['outside', 'opposite', 'middle', 'opponent'],
    description: 'Attaque puissante avec saut, synchronisée sur l\'arrivée du ballon.',
    subActions: ["course d'élan", 'saut (≈1.6m)', 'frappe SPIKE', 'atterrissage'],
  },
  // FIVB rule: a libero cannot poke / set above net height — bidouille is forbidden.
  {
    kind: 'BIDOUILLE', label: 'Bidouille', category: 'attack',
    validRoles: ['setter', 'outside', 'opposite', 'middle', 'opponent', 'generic'],
    description: 'Touche du bout des doigts par-dessus le filet, sans saut. 3e touche désespérée.',
    subActions: ['déplacement vers la balle', 'pose SET au contact'],
  },
  {
    kind: 'FEINTE', label: 'Feinte', category: 'attack',
    validRoles: ['outside', 'opposite', 'middle', 'opponent'],
    description: 'Amorti en suspension : main posée sur le ballon pour passer derrière le contre.',
    subActions: ['approche', 'saut court (≈1.4m)', 'pose SET au contact', 'atterrissage'],
  },
  // Liberos cannot serve. Setters could in theory but it's never tactical, so we exclude.
  {
    kind: 'JUMP_SERVE', label: 'Service sauté', category: 'attack',
    validRoles: ['outside', 'opposite', 'middle', 'opponent', 'generic'],
    description: 'Service tendu avec course d\'élan et saut puissant derrière la ligne.',
    subActions: ['course d\'élan', 'saut haut (≈2m)', 'frappe SPIKE', 'atterrissage'],
  },
  {
    kind: 'FLOAT_SERVE', label: 'Service flottant', category: 'attack',
    validRoles: ['setter', 'outside', 'opposite', 'middle', 'opponent', 'generic'],
    description: 'Service à plat sans rotation, pas de saut. La balle « flotte » et tombe brusquement.',
    subActions: ['stance fixe', 'pose SPIKE au contact'],
  },
  // Distribution
  {
    kind: 'PASSE_HAUTE', label: 'Passe haute', category: 'distribution',
    validRoles: ['setter', 'libero', 'outside', 'generic'],
    description: 'Passe en cloche au-dessus du filet pour préparer un attaquant.',
    subActions: ['déplacement vers le ballon', 'pose SET au contact'],
  },
  {
    kind: 'PASSE_TENDUE', label: 'Passe tendue', category: 'distribution',
    validRoles: ['setter', 'libero'],
    description: 'Passe rapide et tendue pour déborder le contre adverse.',
    subActions: ['déplacement vers le ballon', 'pose SET au contact'],
  },
  // Defense
  {
    kind: 'BLOC', label: 'Bloc', category: 'defense',
    validRoles: ['middle', 'outside', 'opposite', 'opponent'],
    description: 'Saut au filet bras tendus pour stopper l\'attaque adverse.',
    subActions: ['petit pas latéral', 'saut au filet (≈1.4m)', 'pose ARM_SPIKE', 'atterrissage'],
  },
  {
    kind: 'MANCHETTE', label: 'Manchette', category: 'defense',
    validRoles: null,
    description: 'Réception ou défense bras joints en stance basse.',
    subActions: ['descente en stance', 'pose BUMP au contact'],
  },
  {
    kind: 'DEFENSE_PLONGEE', label: 'Défense plongée', category: 'defense',
    validRoles: null,
    description: 'Sauvetage rapide vers une balle hors de portée — chute contrôlée.',
    subActions: ['déplacement rapide vers la balle', 'pose BUMP au contact'],
  },
  // Movement-only
  {
    kind: 'COURSE_ELAN', label: "Course d'élan", category: 'movement',
    validRoles: ['outside', 'opposite', 'middle', 'opponent'],
    description: 'Course de préparation vers la zone d\'attaque (sans saut).',
    subActions: ['déplacement de la position courante vers la zone'],
  },
  {
    kind: 'PENETRATION', label: 'Pénétration', category: 'movement',
    validRoles: ['setter'],
    description: 'Pénétration du passeur depuis la défense vers la zone 2-3.',
    subActions: ['déplacement courbe vers le filet'],
  },
  {
    kind: 'RECUL_3M', label: 'Recul 3m', category: 'movement',
    validRoles: ['outside', 'opposite', 'middle'],
    description: 'Sortie de réception : l\'attaquant recule sur la ligne des 3 m pour préparer son élan.',
    subActions: ['déplacement vers la ligne des 3 m'],
  },
];

export const BRICK_BY_KIND: Record<BrickKind, BrickMeta> = Object.freeze(
  Object.fromEntries(BRICK_CATALOG.map(b => [b.kind, b])) as Record<BrickKind, BrickMeta>,
);

// CSS variable names used to colour-code each brick category in the UI.
// Any consumer that wants to tint UI by category (toolbar group titles,
// brick row borders, canvas anchor markers) should read from this map so
// the tints stay consistent across the editor surface.
export const BRICK_CATEGORY_COLORS: Record<BrickCategory, string> = {
  attack:       'var(--orange)',
  distribution: 'var(--teal)',
  defense:      'var(--pink)',
  movement:     'var(--ink)',
};
