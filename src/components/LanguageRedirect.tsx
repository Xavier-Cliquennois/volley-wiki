import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { detectInitialLang, DEFAULT_LANG, type Lang } from '../i18n';

function pickLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const stored = window.localStorage?.getItem('volley-wiki-lang');
    if (stored === 'fr' || stored === 'en') return stored;
  } catch {
    // ignore (private mode, etc.)
  }
  return detectInitialLang();
}

export default function LanguageRedirect({ subPath = '' }: { subPath?: string }) {
  const location = useLocation();
  const target = pickLang();
  const suffix = subPath ? (subPath.startsWith('/') ? subPath : `/${subPath}`) : '';
  // Preserve query string + hash on redirect.
  const to = `/${target}${suffix}${location.search}${location.hash}`;

  // Cache the choice for next visits.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage?.setItem('volley-wiki-lang', target);
    } catch {
      // ignore
    }
  }, [target]);

  return <Navigate to={to} replace />;
}
