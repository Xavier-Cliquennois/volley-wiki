import { SYSTEMS, SYSTEM_ORDER } from './data';

// Language-agnostic URL paths of the systems pages, shared by the prerender
// list (react-ssg.config.ts) and the sitemap (vite.config.ts). Beach systems
// live under /beach/systems, matching the hub path used by SystemDetail.
export const SYSTEM_PATHS: string[] = [
  '/systems',
  '/beach/systems',
  ...SYSTEM_ORDER.flatMap((id) => {
    const system = SYSTEMS[id];
    if (!system) return [];
    const base = system.discipline === 'beach' ? '/beach/systems' : '/systems';
    return [`${base}/${id}`];
  }),
];
