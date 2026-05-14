import { SITE_NAME, SITE_URL } from './constants';

type Crumb = { name: string; path: string };

function localizedUrl(lang: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `${SITE_URL}/${lang}`;
  return `${SITE_URL}/${lang}${clean}`;
}

export function buildBreadcrumb(crumbs: Crumb[], lang: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: localizedUrl(lang, crumb.path),
    })),
  };
}

export function buildWebSite(lang: string = 'en') {
  const inLanguage = lang === 'fr' ? 'fr-FR' : 'en-US';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/${lang}`,
    inLanguage,
  };
}

type ArticleArgs = {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  lang?: string;
};

export function buildArticle({
  headline,
  description,
  path,
  image,
  datePublished,
  dateModified,
  lang = 'en',
}: ArticleArgs) {
  const inLanguage = lang === 'fr' ? 'fr-FR' : 'en-US';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: localizedUrl(lang, path),
    inLanguage,
    image: image ?? `${SITE_URL}/og-image.png`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

type HowToStep = { name: string; text: string };

export function buildHowTo(args: {
  name: string;
  description: string;
  steps: HowToStep[];
  lang?: string;
}) {
  const inLanguage = args.lang === 'fr' ? 'fr-FR' : 'en-US';
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: args.name,
    description: args.description,
    inLanguage,
    step: args.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
