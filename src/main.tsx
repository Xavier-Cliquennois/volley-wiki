import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createHead, UnheadProvider } from '@unhead/react/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import '@fontsource/bungee/400.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import './index.css';
import './i18n';
import { routes } from './routes';

const head = createHead();
const hydrationData = (window as unknown as { __staticRouterHydrationData?: unknown })
  .__staticRouterHydrationData;
const router = createBrowserRouter(routes, hydrationData ? { hydrationData } : undefined);
const rootElement = document.getElementById('app')!;

const app = (
  <StrictMode>
    <UnheadProvider head={head}>
      <RouterProvider router={router} />
    </UnheadProvider>
  </StrictMode>
);

// Only hydrate when the page actually carries prerendered markup. The
// container is empty in `vite dev` (the SSG plugin only runs at build time),
// on routes that are not in the prerender list (e.g. /:lang/systems, served
// through the SPA fallback) and on the root redirect page. Hydrating an empty
// container makes React report a mismatch on <Layout> and throw the tree away,
// so those pages are rendered from scratch instead.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
