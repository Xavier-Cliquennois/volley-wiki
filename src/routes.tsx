import type { RouteObject } from 'react-router';
import Layout from './layouts/Layout';
import LanguageGate from './components/LanguageGate';
import LanguageRedirect from './components/LanguageRedirect';
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
import Systems from './pages/Systems';
import SystemDetail from './pages/SystemDetail';
import Quiz from './pages/Quiz';
import QuizDetail from './pages/QuizDetail';
import ScenarioEditor from './pages/ScenarioEditor';
import NotFound from './pages/NotFound';
import HomeBeach from './pages/HomeBeach';
import TechniquesBeach from './pages/TechniquesBeach';
import PositionsBeach from './pages/PositionsBeach';
import ScenariosBeach from './pages/ScenariosBeach';
import GuidesBeach from './pages/GuidesBeach';
import GuideBeachDetail from './pages/GuideBeachDetail';

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <LanguageRedirect /> },
      {
        path: ':lang',
        Component: LanguageGate,
        children: [
          {
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
              { path: 'systems', Component: Systems },
              { path: 'systems/:slug', Component: SystemDetail },
              { path: 'quiz', Component: Quiz },
              { path: 'quiz/:slug', Component: QuizDetail },
              // Beach branch
              { path: 'beach', Component: HomeBeach },
              { path: 'beach/techniques', Component: TechniquesBeach },
              { path: 'beach/positions', Component: PositionsBeach },
              { path: 'beach/scenarios', Component: ScenariosBeach },
              { path: 'beach/guides', Component: GuidesBeach },
              { path: 'beach/guides/:slug', Component: GuideBeachDetail },
              { path: 'beach/systems', Component: Systems },
              { path: 'beach/systems/:slug', Component: SystemDetail },
              // Internal authoring tool — intentionally not listed in the nav and not in the sitemap.
              { path: 'editor', Component: ScenarioEditor },
              { path: '*', Component: NotFound },
            ],
          },
        ],
      },
      // Top-level fallback for any path that doesn't start with /:lang.
      // Redirects to the language-detected version of the requested path.
      { path: '*', element: <LanguageRedirect /> },
    ],
  },
];
