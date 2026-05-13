import type { RouteObject } from 'react-router';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import PositionsHub from './pages/PositionsHub';
import Positions from './pages/Positions';
import Scenarios from './pages/Scenarios';
import Rules from './pages/Rules';
import Glossary from './pages/Glossary';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import GuideDefenseSized from './pages/GuideDefenseSized';
import ScenarioEditor from './pages/ScenarioEditor';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'techniques', Component: Techniques },
      { path: 'positions', Component: PositionsHub },
      { path: 'positions/:size', Component: Positions },
      { path: 'positions/:size/:config', Component: Positions },
      { path: 'scenarios', Component: Scenarios },
      { path: 'scenarios/:id', Component: Scenarios },
      { path: 'rules', Component: Rules },
      { path: 'glossary', Component: Glossary },
      { path: 'guides', Component: Guides },
      { path: 'guides/positionnement-defense/:size', Component: GuideDefenseSized },
      { path: 'guides/positionnement-defense/:size/:config', Component: GuideDefenseSized },
      { path: 'guides/:slug', Component: GuideDetail },
      // Internal authoring tool — intentionally not listed in the nav and not in the sitemap.
      { path: 'editor', Component: ScenarioEditor },
      { path: '*', Component: NotFound },
    ],
  },
];
