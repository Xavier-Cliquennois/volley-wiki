import type { RoleColorKey } from '../../constants/positions';

export type CourtPoint = { x: number; y: number };

export type CourtPlayer = {
  id: string;
  x: number;
  y: number;
  label: string;
  role?: RoleColorKey;
  sub?: string;
  caption?: string;
  active?: boolean;
  onClick?: () => void;
  title?: string;
};

export type CourtZone = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role?: RoleColorKey;
  label?: string;
  // Final position of the label (no auto-offset applied).
  // If omitted, position is computed to avoid overlapping players.
  labelPos?: CourtPoint;
  // Colour applied to the label text. Defaults to a neutral fallback
  // rather than the zone's role colour, matching the legacy look.
  labelRole?: RoleColorKey;
};

export type CourtArrow = {
  id: string;
  from: CourtPoint;
  to: CourtPoint;
  // Visual variant. 'main' = thick orange ball trajectory (quick attacks).
  // 'alt' = dashed grey ball trajectory (other tempos). 'movement' = thin
  // teal dotted line showing a player movement (penetration, approach…).
  kind?: 'main' | 'alt' | 'movement';
  // Optional override for the endpoint backoff (SVG user units). The default
  // backoff is generous so the arrowhead doesn't overlap a player at the
  // target. Override with a small value when the target is in empty space
  // (e.g. attack trajectories pointing at the net).
  backoff?: number;
  // Render the arrow faded (used to highlight a hovered companion arrow).
  dimmed?: boolean;
};

export type CourtBall = CourtPoint;

export type CourtLayout = {
  players?: CourtPlayer[];
  zones?: CourtZone[];
  arrows?: CourtArrow[];
  ball?: CourtBall;
};

export type CourtView = 'full' | 'our-side';

export type CourtProps = {
  layout: CourtLayout;
  view?: CourtView;
  show3mLine?: boolean;
  showSideLabels?: boolean;
  withShadow?: boolean;
  idSuffix: string;
};
