import { useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nDefault, { isLang, getI18nForLang } from '../i18n';

export default function LanguageGate() {
  const { lang } = useParams<{ lang?: string }>();
  const validLang = isLang(lang) ? lang : null;

  // Keep the default i18n singleton in lockstep with the URL so non-React
  // consumers (like the CONFIGURATIONS proxy) resolve translations in the
  // currently-rendered language.
  if (validLang && i18nDefault.language !== validLang) {
    void i18nDefault.changeLanguage(validLang);
  }

  useEffect(() => {
    if (!validLang) return;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', validLang);
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage?.setItem('volley-wiki-lang', validLang);
      } catch {
        // ignore (private mode, etc.)
      }
    }
  }, [validLang]);

  if (!validLang) {
    return <Navigate to="/" replace />;
  }

  return (
    <I18nextProvider i18n={getI18nForLang(validLang)}>
      <Outlet />
    </I18nextProvider>
  );
}
