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
import frHomeBeach from '../locales/fr/homeBeach.json';
import frTechniquesBeach from '../locales/fr/techniquesBeach.json';
import frPositionsBeach from '../locales/fr/positionsBeach.json';
import frScenariosBeach from '../locales/fr/scenariosBeach.json';
import frGuidesBeach from '../locales/fr/guidesBeach.json';
import frGuideContentBeach from '../locales/fr/guideContentBeach.json';
import frDrills from '../locales/fr/drills.json';

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
import enHomeBeach from '../locales/en/homeBeach.json';
import enTechniquesBeach from '../locales/en/techniquesBeach.json';
import enPositionsBeach from '../locales/en/positionsBeach.json';
import enScenariosBeach from '../locales/en/scenariosBeach.json';
import enGuidesBeach from '../locales/en/guidesBeach.json';
import enGuideContentBeach from '../locales/en/guideContentBeach.json';
import enDrills from '../locales/en/drills.json';

import plCommon from '../locales/pl/common.json';
import plHome from '../locales/pl/home.json';
import plTechniques from '../locales/pl/techniques.json';
import plPositions from '../locales/pl/positions.json';
import plRules from '../locales/pl/rules.json';
import plGlossary from '../locales/pl/glossary.json';
import plGuides from '../locales/pl/guides.json';
import plGuideContent from '../locales/pl/guideContent.json';
import plScenarios from '../locales/pl/scenarios.json';
import plScenarioContent from '../locales/pl/scenarioContent.json';
import plSeo from '../locales/pl/seo.json';
import plHomeBeach from '../locales/pl/homeBeach.json';
import plTechniquesBeach from '../locales/pl/techniquesBeach.json';
import plPositionsBeach from '../locales/pl/positionsBeach.json';
import plScenariosBeach from '../locales/pl/scenariosBeach.json';
import plGuidesBeach from '../locales/pl/guidesBeach.json';
import plGuideContentBeach from '../locales/pl/guideContentBeach.json';
import plDrills from '../locales/pl/drills.json';

import itCommon from '../locales/it/common.json';
import itHome from '../locales/it/home.json';
import itTechniques from '../locales/it/techniques.json';
import itPositions from '../locales/it/positions.json';
import itRules from '../locales/it/rules.json';
import itGlossary from '../locales/it/glossary.json';
import itGuides from '../locales/it/guides.json';
import itGuideContent from '../locales/it/guideContent.json';
import itScenarios from '../locales/it/scenarios.json';
import itScenarioContent from '../locales/it/scenarioContent.json';
import itSeo from '../locales/it/seo.json';
import itHomeBeach from '../locales/it/homeBeach.json';
import itTechniquesBeach from '../locales/it/techniquesBeach.json';
import itPositionsBeach from '../locales/it/positionsBeach.json';
import itScenariosBeach from '../locales/it/scenariosBeach.json';
import itGuidesBeach from '../locales/it/guidesBeach.json';
import itGuideContentBeach from '../locales/it/guideContentBeach.json';
import itDrills from '../locales/it/drills.json';

import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esTechniques from '../locales/es/techniques.json';
import esPositions from '../locales/es/positions.json';
import esRules from '../locales/es/rules.json';
import esGlossary from '../locales/es/glossary.json';
import esGuides from '../locales/es/guides.json';
import esGuideContent from '../locales/es/guideContent.json';
import esScenarios from '../locales/es/scenarios.json';
import esScenarioContent from '../locales/es/scenarioContent.json';
import esSeo from '../locales/es/seo.json';
import esHomeBeach from '../locales/es/homeBeach.json';
import esTechniquesBeach from '../locales/es/techniquesBeach.json';
import esPositionsBeach from '../locales/es/positionsBeach.json';
import esScenariosBeach from '../locales/es/scenariosBeach.json';
import esGuidesBeach from '../locales/es/guidesBeach.json';
import esGuideContentBeach from '../locales/es/guideContentBeach.json';
import esDrills from '../locales/es/drills.json';

import ptCommon from '../locales/pt/common.json';
import ptHome from '../locales/pt/home.json';
import ptTechniques from '../locales/pt/techniques.json';
import ptPositions from '../locales/pt/positions.json';
import ptRules from '../locales/pt/rules.json';
import ptGlossary from '../locales/pt/glossary.json';
import ptGuides from '../locales/pt/guides.json';
import ptGuideContent from '../locales/pt/guideContent.json';
import ptScenarios from '../locales/pt/scenarios.json';
import ptScenarioContent from '../locales/pt/scenarioContent.json';
import ptSeo from '../locales/pt/seo.json';
import ptHomeBeach from '../locales/pt/homeBeach.json';
import ptTechniquesBeach from '../locales/pt/techniquesBeach.json';
import ptPositionsBeach from '../locales/pt/positionsBeach.json';
import ptScenariosBeach from '../locales/pt/scenariosBeach.json';
import ptGuidesBeach from '../locales/pt/guidesBeach.json';
import ptGuideContentBeach from '../locales/pt/guideContentBeach.json';
import ptDrills from '../locales/pt/drills.json';

import jaCommon from '../locales/ja/common.json';
import jaHome from '../locales/ja/home.json';
import jaTechniques from '../locales/ja/techniques.json';
import jaPositions from '../locales/ja/positions.json';
import jaRules from '../locales/ja/rules.json';
import jaGlossary from '../locales/ja/glossary.json';
import jaGuides from '../locales/ja/guides.json';
import jaGuideContent from '../locales/ja/guideContent.json';
import jaScenarios from '../locales/ja/scenarios.json';
import jaScenarioContent from '../locales/ja/scenarioContent.json';
import jaSeo from '../locales/ja/seo.json';
import jaHomeBeach from '../locales/ja/homeBeach.json';
import jaTechniquesBeach from '../locales/ja/techniquesBeach.json';
import jaPositionsBeach from '../locales/ja/positionsBeach.json';
import jaScenariosBeach from '../locales/ja/scenariosBeach.json';
import jaGuidesBeach from '../locales/ja/guidesBeach.json';
import jaGuideContentBeach from '../locales/ja/guideContentBeach.json';
import jaDrills from '../locales/ja/drills.json';

import trCommon from '../locales/tr/common.json';
import trHome from '../locales/tr/home.json';
import trTechniques from '../locales/tr/techniques.json';
import trPositions from '../locales/tr/positions.json';
import trRules from '../locales/tr/rules.json';
import trGlossary from '../locales/tr/glossary.json';
import trGuides from '../locales/tr/guides.json';
import trGuideContent from '../locales/tr/guideContent.json';
import trScenarios from '../locales/tr/scenarios.json';
import trScenarioContent from '../locales/tr/scenarioContent.json';
import trSeo from '../locales/tr/seo.json';
import trHomeBeach from '../locales/tr/homeBeach.json';
import trTechniquesBeach from '../locales/tr/techniquesBeach.json';
import trPositionsBeach from '../locales/tr/positionsBeach.json';
import trScenariosBeach from '../locales/tr/scenariosBeach.json';
import trGuidesBeach from '../locales/tr/guidesBeach.json';
import trGuideContentBeach from '../locales/tr/guideContentBeach.json';
import trDrills from '../locales/tr/drills.json';

export const SUPPORTED_LANGS = ['fr', 'en', 'pl', 'it', 'es', 'pt', 'ja', 'tr'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_LABELS: Record<Lang, string> = {
  fr: 'Français',
  en: 'English',
  pl: 'Polski',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  tr: 'Türkçe',
};

export const LANG_SHORT: Record<Lang, string> = {
  fr: 'FR',
  en: 'EN',
  pl: 'PL',
  it: 'IT',
  es: 'ES',
  pt: 'PT',
  ja: 'JA',
  tr: 'TR',
};

export function isLang(value: string | undefined | null): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value ?? '');
}

const bundle = (
  common: unknown,
  home: unknown,
  techniques: unknown,
  positions: unknown,
  rules: unknown,
  glossary: unknown,
  guides: unknown,
  guideContent: unknown,
  scenarios: unknown,
  scenarioContent: unknown,
  seo: unknown,
  homeBeach: unknown,
  techniquesBeach: unknown,
  positionsBeach: unknown,
  scenariosBeach: unknown,
  guidesBeach: unknown,
  guideContentBeach: unknown,
  drills: unknown,
): Record<string, unknown> => ({
  common,
  home,
  techniques,
  positions,
  rules,
  glossary,
  guides,
  guideContent,
  scenarios,
  scenarioContent,
  seo,
  homeBeach,
  techniquesBeach,
  positionsBeach,
  scenariosBeach,
  guidesBeach,
  guideContentBeach,
  drills,
});

const RESOURCES = {
  fr: bundle(frCommon, frHome, frTechniques, frPositions, frRules, frGlossary, frGuides, frGuideContent, frScenarios, frScenarioContent, frSeo, frHomeBeach, frTechniquesBeach, frPositionsBeach, frScenariosBeach, frGuidesBeach, frGuideContentBeach, frDrills),
  en: bundle(enCommon, enHome, enTechniques, enPositions, enRules, enGlossary, enGuides, enGuideContent, enScenarios, enScenarioContent, enSeo, enHomeBeach, enTechniquesBeach, enPositionsBeach, enScenariosBeach, enGuidesBeach, enGuideContentBeach, enDrills),
  pl: bundle(plCommon, plHome, plTechniques, plPositions, plRules, plGlossary, plGuides, plGuideContent, plScenarios, plScenarioContent, plSeo, plHomeBeach, plTechniquesBeach, plPositionsBeach, plScenariosBeach, plGuidesBeach, plGuideContentBeach, plDrills),
  it: bundle(itCommon, itHome, itTechniques, itPositions, itRules, itGlossary, itGuides, itGuideContent, itScenarios, itScenarioContent, itSeo, itHomeBeach, itTechniquesBeach, itPositionsBeach, itScenariosBeach, itGuidesBeach, itGuideContentBeach, itDrills),
  es: bundle(esCommon, esHome, esTechniques, esPositions, esRules, esGlossary, esGuides, esGuideContent, esScenarios, esScenarioContent, esSeo, esHomeBeach, esTechniquesBeach, esPositionsBeach, esScenariosBeach, esGuidesBeach, esGuideContentBeach, esDrills),
  pt: bundle(ptCommon, ptHome, ptTechniques, ptPositions, ptRules, ptGlossary, ptGuides, ptGuideContent, ptScenarios, ptScenarioContent, ptSeo, ptHomeBeach, ptTechniquesBeach, ptPositionsBeach, ptScenariosBeach, ptGuidesBeach, ptGuideContentBeach, ptDrills),
  ja: bundle(jaCommon, jaHome, jaTechniques, jaPositions, jaRules, jaGlossary, jaGuides, jaGuideContent, jaScenarios, jaScenarioContent, jaSeo, jaHomeBeach, jaTechniquesBeach, jaPositionsBeach, jaScenariosBeach, jaGuidesBeach, jaGuideContentBeach, jaDrills),
  tr: bundle(trCommon, trHome, trTechniques, trPositions, trRules, trGlossary, trGuides, trGuideContent, trScenarios, trScenarioContent, trSeo, trHomeBeach, trTechniquesBeach, trPositionsBeach, trScenariosBeach, trGuidesBeach, trGuideContentBeach, trDrills),
} as const;

const NAMESPACES = Object.keys(RESOURCES.fr);

export function detectInitialLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const candidates = (navigator.languages?.length ? navigator.languages : [navigator.language]) ?? [];
  for (const raw of candidates) {
    const base = raw?.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}

// One pre-initialized instance per language. Switching language at runtime means
// swapping which instance is exposed to React — this avoids any async behavior
// of `i18n.changeLanguage()` and keeps SSR fully synchronous.
const INSTANCES: Record<Lang, I18nInstance> = {} as Record<Lang, I18nInstance>;

for (const lng of SUPPORTED_LANGS) {
  const inst = createInstance();
  // Each per-language instance carries its own bundle plus the canonical
  // French bundle as a fallback, so a key missing in the target language
  // (typically a guide section not yet translated) falls back to French
  // instead of returning the raw key string. We never fall back to EN here
  // because FR is the canonical source for guide content.
  const resources: Record<string, unknown> =
    lng === 'fr' ? { fr: RESOURCES.fr } : { [lng]: RESOURCES[lng], fr: RESOURCES.fr };
  inst.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: lng === 'fr' ? 'fr' : ['fr'],
    supportedLngs: lng === 'fr' ? ['fr'] : [lng, 'fr'],
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
