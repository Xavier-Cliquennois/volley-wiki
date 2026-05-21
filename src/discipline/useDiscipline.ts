import { useLocation } from 'react-router-dom';
import { type Lang, SUPPORTED_LANGS } from '../i18n';

export type Discipline = 'indoor' | 'beach';

export const DISCIPLINES: readonly Discipline[] = ['indoor', 'beach'];

const LANG_BEACH_PATTERN = new RegExp(
  `^/(${SUPPORTED_LANGS.join('|')})/beach(?:/.*)?$`,
);

export function disciplineFromPath(pathname: string): Discipline {
  return LANG_BEACH_PATTERN.test(pathname) ? 'beach' : 'indoor';
}

export function useDiscipline(): Discipline {
  const { pathname } = useLocation();
  return disciplineFromPath(pathname);
}

// Pages whose indoor URL maps to a known beach URL. Sub-segments are stripped
// since most beach equivalents don't carry the same parameters
// (e.g. /positions/6v6/5-1 has no beach analogue).
const INDOOR_TO_BEACH: Record<string, string> = {
  '/': '/beach',
  '/positions': '/beach/positions',
  '/scenarios': '/beach/scenarios',
  '/guides': '/beach/guides',
};

function topSegmentFor(rest: string): string {
  // "/positions/6v6/5-1" → "/positions"
  const seg = rest.split('/')[1] ?? '';
  return seg ? `/${seg}` : '/';
}

// Map a path between disciplines, preserving the language prefix.
// Indoor URLs without a beach equivalent (e.g. /rules, /glossary, /editor)
// fall back to the beach hub so the switcher always lands somewhere sensible.
export function swapDisciplineInPath(
  pathname: string,
  target: Discipline,
  lang: Lang,
): string {
  const langPrefix = `/${lang}`;

  let rest = pathname.startsWith(langPrefix)
    ? pathname.slice(langPrefix.length) || '/'
    : pathname;

  const isBeach = rest === '/beach' || rest.startsWith('/beach/');
  if (isBeach) rest = rest === '/beach' ? '/' : rest.slice('/beach'.length);
  if (!rest) rest = '/';

  if (target === 'indoor') {
    return rest === '/' ? langPrefix : `${langPrefix}${rest}`;
  }

  // Indoor → Beach
  const top = topSegmentFor(rest);
  const mapped = INDOOR_TO_BEACH[top] ?? INDOOR_TO_BEACH[rest] ?? '/beach';
  return `${langPrefix}${mapped}`;
}
