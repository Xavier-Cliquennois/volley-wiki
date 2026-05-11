import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SCENARIOS } from './src/scenarios/data'
import { GUIDES } from './src/guides/data'

const SITE_URL = 'https://volley-wiki.fr'

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/techniques', changefreq: 'monthly', priority: '0.8' },
  { path: '/positions', changefreq: 'monthly', priority: '0.8' },
  { path: '/scenarios', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides', changefreq: 'monthly', priority: '0.8' },
  { path: '/rules', changefreq: 'monthly', priority: '0.7' },
  { path: '/glossary', changefreq: 'monthly', priority: '0.7' },
]

function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10)

  const urls: string[] = []

  const push = (loc: string, changefreq: string, priority: string) => {
    urls.push(
      `  <url>\n` +
        `    <loc>${SITE_URL}${loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority}</priority>\n` +
        `  </url>`
    )
  }

  for (const route of STATIC_ROUTES) {
    push(route.path, route.changefreq, route.priority)
  }

  for (const guide of GUIDES) {
    push(`/guides/${guide.slug}`, 'monthly', '0.7')
  }

  for (const scenario of SCENARIOS) {
    push(`/scenarios?id=${encodeURIComponent(scenario.id)}`, 'monthly', '0.6')
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
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
  plugins: [react(), tailwindcss(), sitemapPlugin()],
})
