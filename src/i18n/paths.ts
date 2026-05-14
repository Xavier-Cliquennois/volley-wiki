import { useParams } from 'react-router-dom';
import { type Lang, isLang, DEFAULT_LANG, SUPPORTED_LANGS } from './index';

export function useCurrentLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return isLang(lang) ? lang : DEFAULT_LANG;
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${lang}`;
  return `/${lang}${clean}`;
}

export function useLocalizedPath() {
  const lang = useCurrentLang();
  return (path: string) => localizedPath(lang, path);
}

const LANG_PATTERN = new RegExp(`^/(${SUPPORTED_LANGS.join('|')})(/.*)?$`);

export function swapLangInPath(pathname: string, target: Lang): string {
  const m = pathname.match(LANG_PATTERN);
  if (m) return `/${target}${m[2] ?? ''}`;
  return `/${target}${pathname}`;
}
