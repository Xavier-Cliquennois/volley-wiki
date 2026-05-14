import { useHead } from '@unhead/react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './constants';
import { isLang, SUPPORTED_LANGS } from '../i18n';

type JsonLd = Record<string, unknown>;

type HeadProps = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
};

function localizedHref(lang: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `${SITE_URL}/${lang}`;
  return `${SITE_URL}/${lang}${clean}`;
}

export function Head({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: HeadProps) {
  const { i18n, t } = useTranslation('seo');
  const lang = isLang(i18n.language) ? i18n.language : 'en';
  const ogLocale = t('ogLocale');
  const alternateLocale = t('alternateLocale');
  const htmlLang = t('htmlLang');

  const canonical = localizedHref(lang, path);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  const alternates: { rel: string; hreflang: string; href: string }[] = SUPPORTED_LANGS.map(
    (l) => ({
      rel: 'alternate',
      hreflang: l,
      href: localizedHref(l, path),
    }),
  );
  alternates.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: localizedHref('en', path),
  });

  useHead({
    title,
    htmlAttrs: { lang: htmlLang },
    // Cast: unhead's narrow `Link` types reject the standard hreflang shape
    // even though it's valid HTML. We emit `<link rel="alternate" hreflang="..."/>`
    // exactly as Google expects for i18n pages.
    link: [{ rel: 'canonical', href: canonical }, ...alternates] as never,
    meta: [
      { name: 'description', content: description },
      ...(noindex ? [{ name: 'robots', content: 'noindex' }] : []),
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: ogLocale },
      { property: 'og:locale:alternate', content: alternateLocale },
      { property: 'og:url', content: canonical },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    script: schemas.map((schema) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema),
    })),
  });

  return null;
}
