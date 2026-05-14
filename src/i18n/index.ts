import i18n, { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import frCommon from '../locales/fr/common.json';
import frHome from '../locales/fr/home.json';
import frTechniques from '../locales/fr/techniques.json';
import frPositions from '../locales/fr/positions.json';
import frRules from '../locales/fr/rules.json';
import frGlossary from '../locales/fr/glossary.json';
import frGuides from '../locales/fr/guides.json';
import frGuideContent from '../locales/fr/guideContent.json';
import frScenarios from '../locales/fr/scenarios.json';
import frScenarioContent from '../locales/fr/scenarioContent.json';
import frSeo from '../locales/fr/seo.json';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enTechniques from '../locales/en/techniques.json';
import enPositions from '../locales/en/positions.json';
import enRules from '../locales/en/rules.json';
import enGlossary from '../locales/en/glossary.json';
import enGuides from '../locales/en/guides.json';
import enGuideContent from '../locales/en/guideContent.json';
import enScenarios from '../locales/en/scenarios.json';
import enScenarioContent from '../locales/en/scenarioContent.json';
import enSeo from '../locales/en/seo.json';

export const SUPPORTED_LANGS = ['fr', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export function isLang(value: string | undefined | null): value is Lang {
  return value === 'fr' || value === 'en';
}

const RESOURCES = {
  fr: {
    common: frCommon,
    home: frHome,
    techniques: frTechniques,
    positions: frPositions,
    rules: frRules,
    glossary: frGlossary,
    guides: frGuides,
    guideContent: frGuideContent,
    scenarios: frScenarios,
    scenarioContent: frScenarioContent,
    seo: frSeo,
  },
  en: {
    common: enCommon,
    home: enHome,
    techniques: enTechniques,
    positions: enPositions,
    rules: enRules,
    glossary: enGlossary,
    guides: enGuides,
    guideContent: enGuideContent,
    scenarios: enScenarios,
    scenarioContent: enScenarioContent,
    seo: enSeo,
  },
} as const;

const NAMESPACES = Object.keys(RESOURCES.fr);

export function detectInitialLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const candidates = (navigator.languages?.length ? navigator.languages : [navigator.language]) ?? [];
  for (const raw of candidates) {
    const base = raw?.toLowerCase().split('-')[0];
    if (base === 'fr') return 'fr';
    if (base === 'en') return 'en';
  }
  return DEFAULT_LANG;
}

// One pre-initialized instance per language. Switching language at runtime means
// swapping which instance is exposed to React — this avoids any async behavior
// of `i18n.changeLanguage()` and keeps SSR fully synchronous.
const INSTANCES: Record<Lang, I18nInstance> = {} as Record<Lang, I18nInstance>;

for (const lng of SUPPORTED_LANGS) {
  const inst = createInstance();
  inst.use(initReactI18next).init({
    resources: { [lng]: RESOURCES[lng] },
    lng,
    fallbackLng: lng,
    supportedLngs: [lng],
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    initImmediate: false,
  } as Parameters<typeof inst.init>[0]);
  INSTANCES[lng] = inst;
}

// Also initialize the default i18next module-level singleton so the bare
// `useTranslation()` (with no I18nextProvider) and `i18next` imports work.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: RESOURCES,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    initImmediate: false,
  } as Parameters<typeof i18n.init>[0]);
}

export function getI18nForLang(lng: Lang): I18nInstance {
  return INSTANCES[lng];
}

export default i18n;
