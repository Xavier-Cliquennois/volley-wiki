import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
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
import { routes } from './routes';

const head = createHead();
const hydrationData = (window as unknown as { __staticRouterHydrationData?: unknown })
  .__staticRouterHydrationData;
const router = createBrowserRouter(routes, hydrationData ? { hydrationData } : undefined);
const rootElement = document.getElementById('root')!;

hydrateRoot(
  rootElement,
  <StrictMode>
    <UnheadProvider head={head}>
      <RouterProvider router={router} />
    </UnheadProvider>
  </StrictMode>,
);
