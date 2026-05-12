import { defineReactSsgConfig } from 'vite-plugin-react-ssg';
import { routes } from './src/routes';
import { SCENARIOS } from './src/scenarios/data';
import { GUIDES } from './src/guides/data';
import { POSITION_CONFIGS_BY_SIZE, SITE_URL, TEAM_SIZES } from './src/seo/constants';

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

export default defineReactSsgConfig({
  history: 'browser',
  origin: SITE_URL,
  routes,
  paths: [
    ...scenarioPaths,
    ...guidePaths,
    ...defenseHubPath,
    ...sizedDefensePaths,
    ...sizedPositionsPaths,
  ],
  logLevel: 'normal',
});
