import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import reactSsg from 'vite-plugin-react-ssg'
import { SCENARIOS } from './src/scenarios/data'
import { GUIDES } from './src/guides/data'
import { POSITION_CONFIGS_BY_SIZE, SITE_URL, TEAM_SIZES } from './src/seo/constants'

type Lang = 'fr' | 'en' | 'pl' | 'it' | 'es' | 'pt' | 'ja' | 'tr'
const LANGS: readonly Lang[] = ['fr', 'en', 'pl', 'it', 'es', 'pt', 'ja', 'tr']

type SitemapEntry = { path: string; changefreq: string; priority: string }

const STATIC_ROUTES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/techniques', changefreq: 'monthly', priority: '0.8' },
  { path: '/positions', changefreq: 'monthly', priority: '0.7' },
  { path: '/scenarios', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides', changefreq: 'monthly', priority: '0.8' },
  { path: '/rules', changefreq: 'monthly', priority: '0.7' },
  { path: '/glossary', changefreq: 'monthly', priority: '0.7' },
]

function localizedHref(lang: Lang, path: string): string {
  if (path === '/') return `${SITE_URL}/${lang}`
  return `${SITE_URL}/${lang}${path}`
}

function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10)

  const paths: SitemapEntry[] = [...STATIC_ROUTES]
  for (const size of TEAM_SIZES) {
    for (const config of POSITION_CONFIGS_BY_SIZE[size]) {
      paths.push({ path: `/positions/${size}/${config}`, changefreq: 'monthly', priority: '0.8' })
    }
  }
  for (const guide of GUIDES) {
    if (guide.slug === 'positionnement-defense') continue
    paths.push({ path: `/guides/${guide.slug}`, changefreq: 'monthly', priority: '0.7' })
  }
  for (const size of TEAM_SIZES) {
    for (const config of POSITION_CONFIGS_BY_SIZE[size]) {
      paths.push({
        path: `/guides/positionnement-defense/${size}/${config}`,
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
  }
  for (const scenario of SCENARIOS) {
    paths.push({ path: `/scenarios/${scenario.id}`, changefreq: 'monthly', priority: '0.6' })
  }

  const urls: string[] = []
  for (const lang of LANGS) {
    for (const entry of paths) {
      const loc = localizedHref(lang, entry.path)
      const alternates = LANGS.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${localizedHref(l, entry.path)}"/>`,
      )
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedHref('en', entry.path)}"/>`,
      )
      urls.push(
        `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${entry.changefreq}</changefreq>\n` +
          `    <priority>${entry.priority}</priority>\n` +
          `${alternates.join('\n')}\n` +
          `  </url>`,
      )
    }
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.join('\n') +
    `\n</urlset>\n`
  )
}

function sitemapPlugin(): Plugin {
  return {
    name: 'volley-wiki-sitemap',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: buildSitemap(),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), reactSsg(), sitemapPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/gsap')
          ) {
            return 'three-vendor'
          }
        },
      },
    },
  },
})
