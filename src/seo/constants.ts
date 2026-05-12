export const SITE_URL = 'https://volley-wiki.fr';
export const SITE_NAME = 'Volley-Wiki';
export const SITE_LOCALE = 'fr_FR';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const TEAM_SIZES = ['6v6', '5v5', '4v4'] as const;
export type TeamSizeSlug = (typeof TEAM_SIZES)[number];
export const TEAM_SIZE_LABEL: Record<TeamSizeSlug, string> = {
  '6v6': '6 contre 6',
  '5v5': '5 contre 5',
  '4v4': '4 contre 4',
};

// Tactical configuration IDs per format — duplicated from Positions.CONFIGURATIONS
// so that build-time files (vite.config, react-ssg.config) can enumerate them
// without pulling in the React component tree.
export const POSITION_CONFIGS_BY_SIZE: Record<TeamSizeSlug, readonly string[]> = {
  '6v6': ['5-1', '4-2', '6-2'],
  '5v5': ['pentagon', '3F-2B', '2F-3B'],
  '4v4': ['losange', 'carre', '3-1'],
};

// First config per size = the canonical landing when no :config is provided.
export const DEFAULT_POSITION_CONFIG: Record<TeamSizeSlug, string> = {
  '6v6': '5-1',
  '5v5': 'pentagon',
  '4v4': 'losange',
};
