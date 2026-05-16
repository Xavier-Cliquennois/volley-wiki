import { defineReactSsgConfig } from 'vite-plugin-react-ssg';
import { routes } from './src/routes';
import { SCENARIOS } from './src/scenarios/data';
import { GUIDES } from './src/guides/data';
import { BEACH_GUIDES } from './src/guides/beach/data';
import { POSITION_CONFIGS_BY_SIZE, SITE_URL, TEAM_SIZES } from './src/seo/constants';

const LANGS = ['fr', 'en', 'pl', 'it', 'es', 'pt', 'ja', 'tr'] as const;

const scenarioPaths = SCENARIOS.map((s) => `/scenarios/${s.id}`);
const guidePaths = GUIDES.filter((g) => g.slug !== 'positionnement-defense').map(
  (g) => `/guides/${g.slug}`,
);
// /guides/positionnement-defense is a hub page handled by the GuideDetail hub-mode branch.
const defenseHubPath = ['/guides/positionnement-defense'];

// Per-config content pages (canonical URLs).
const sizedPositionsPaths: string[] = [];
const sizedDefensePaths: string[] = [];
for (const size of TEAM_SIZES) {
  for (const config of POSITION_CONFIGS_BY_SIZE[size]) {
    sizedPositionsPaths.push(`/positions/${size}/${config}`);
    sizedDefensePaths.push(`/guides/positionnement-defense/${size}/${config}`);
  }
}

const beachGuidePaths = BEACH_GUIDES.map((g) => `/beach/guides/${g.slug}`);

// All language-agnostic content paths (excluding the index).
const contentPaths: string[] = [
  '/techniques',
  '/positions',
  '/scenarios',
  '/guides',
  '/rules',
  '/glossary',
  ...scenarioPaths,
  ...guidePaths,
  ...defenseHubPath,
  ...sizedDefensePaths,
  ...sizedPositionsPaths,
  // Beach
  '/beach',
  '/beach/techniques',
  '/beach/positions',
  '/beach/scenarios',
  '/beach/guides',
  ...beachGuidePaths,
];

// Prefix every content path with each supported language. The bare /:lang
// (e.g. /fr, /en) is the homepage for that language; '/' is rendered by
// LanguageRedirect on the client.
const localizedPaths: string[] = [];
for (const lang of LANGS) {
  localizedPaths.push(`/${lang}`);
  for (const path of contentPaths) {
    localizedPaths.push(`/${lang}${path}`);
  }
}

export default defineReactSsgConfig({
  history: 'browser',
  origin: SITE_URL,
  routes,
  paths: localizedPaths,
  logLevel: 'normal',
});
