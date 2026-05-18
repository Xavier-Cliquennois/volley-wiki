import type { Level } from '../userLevel/useUserLevel';
import type { RoleColorKey } from '../constants/positions';

// Internal role codes (international); display labels come from i18n.
// FR renders these as: Passeur / Pointu / Central / Aile / Libéro.
// S/S2 distinguish the two setters in 6-2 and 4-2 systems (5-1 uses S only).
// B1/B2: beach 2v2 players (no formal roles — one defender, one blocker).
export type RoleCode =
  | 'S' | 'S2' | 'OPP' | 'MB1' | 'MB2' | 'OH1' | 'OH2' | 'L'
  | 'B1' | 'B2';

export type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

export type RotationId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';

export type SystemId =
  // 6v6 indoor
  | '5-1'
  | '6-2'
  | '4-2'
  // 5v5 indoor
  | '5v5-5-1'
  | '5v5-4-2'
  // 4v4 indoor (single formation each, not 6 rotations)
  | '4v4-diamant'
  | '4v4-box'
  | '4v4-ligne'
  // Beach 2v2
  | 'beach-classic';

export type TeamSize = 4 | 5 | 6 | 2;
export type Discipline = 'indoor' | 'beach';

// Normalized court coordinates (matches CourtPlayer in components/court):
// x in [0,100], y in [0,100]. View is 'our-side' so y=0 is the net and y=100
// is the back of our court.
export type CourtCoord = { x: number; y: number };

export type PlayerSlot = {
  role: RoleCode;
  // Color palette key (re-used from the positions palette).
  color: RoleColorKey;
  // Required position at the moment of the opponent's serve, constrained by
  // FIVB overlap rules. Used to place the player on the diagram.
  servePosition: CourtCoord;
  // Position after release: where the player goes once the serve is contacted.
  // Reception zone, attack zone, or setter penetration target.
  releasePosition?: CourtCoord;
  // True if this slot receives the serve.
  receives: boolean;
  // Per-rotation note (e.g. "stack behind OH to clear reception lane").
  note?: string;
};

export type AttackZone = 'A' | 'B' | 'C' | 'D' | 'pipe' | 'slide';

export type AttackOption = {
  id: string;
  attacker: RoleCode;
  zone: AttackZone;
  // Label for the option, e.g. "Quick centre", "Pipe". Display via i18n key
  // when content is localized; raw string is allowed during scaffolding.
  label: string;
  risk: 'low' | 'medium' | 'high';
  tempo: 1 | 2 | 3;
  // Target position on the court (where the ball is struck — the front edge
  // of the net for front-row attacks, slightly back for pipe).
  target: CourtCoord;
};

// A single piece of explanatory content. `requires` is the minimum user level
// at which it should be visible. Beginner blocks show to everyone; advanced
// blocks only when the user has switched to advanced.
export type ContentBlock = {
  id: string;
  requires: Level;
  body: string;
};

export type Rotation = {
  id: RotationId;
  // Where the setter stands at service: 'front' means at the net (no
  // penetration needed), 'back' means in the back row (must penetrate).
  setterAt: 'front' | 'back';
  slots: PlayerSlot[];
  attacks: AttackOption[];
  // The one-liner shown by default to every reader.
  summary: string;
  // Deeper content unlocked by level or by the "more info" toggle.
  details: ContentBlock[];
};

export type SystemDef = {
  id: SystemId;
  // Localized display title, e.g. "Système 5-1".
  title: string;
  tagline: string;
  teamSize: TeamSize;
  discipline: Discipline;
  // Long-form philosophy paragraph, surfaced at the top of the system page.
  philosophy: string;
  // Audience hint, shown alongside the title.
  recommendedLevel: Level;
  pros: string[];
  cons: string[];
  // Indoor 6v6/5v5 systems carry 6 rotations. 4v4 and beach are static
  // formations — they expose a single rotation (the formation snapshot)
  // under the R1 key.
  rotations: Partial<Record<RotationId, Rotation>>;
};

// Risk → court arrow style mapping. Kept here so the diagram, the legend,
// and any future export all stay in sync.
export const RISK_COLORS: Record<AttackOption['risk'], string> = {
  low: '#2ecc71',
  medium: '#f0c84c',
  high: '#e74c3c',
};
