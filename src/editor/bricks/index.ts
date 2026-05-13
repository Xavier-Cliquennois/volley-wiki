export type {
  BrickAction,
  BrickKind,
  BrickCategory,
  BrickMeta,
  SmashBrick,
  BidouilleBrick,
  FeinteBrick,
  JumpServeBrick,
  FloatServeBrick,
  PasseHauteBrick,
  PasseTendueBrick,
  BlocBrick,
  ManchetteBrick,
  DefensePlongeeBrick,
  CourseElanBrick,
  PenetrationBrick,
  Recul3mBrick,
} from './types';
export { BRICK_CATALOG, BRICK_BY_KIND, BRICK_CATEGORY_COLORS } from './types';
export { expandBrick } from './expand';
export type { ExpandContext } from './expand';
export { createBrickWithDefaults, brickAnchorPoints } from './factory';
