// Builds the published content documents (`/content/v1/<lang>.json`) from the
// site sources. Run by `scripts/build-content.mjs` after `vite build`.
import { createHash } from 'node:crypto';
import { buildGuides } from './guides.ts';
import { buildDrills, buildGlossary, buildPositions, buildRules, buildTechniques, palette } from './sections.ts';
import type { Lang } from './source.ts';

export const LANGS: Lang[] = ['fr', 'en'];
export const SCHEMA_VERSION = 1;
const SOURCE = 'https://volley-wiki.fr';

export function buildDocument(lang: Lang, now: Date) {
  const untranslated = new Set<string>();
  const guides = buildGuides(lang, untranslated);
  const positions = buildPositions(lang, untranslated);
  const rules = buildRules(lang, untranslated);
  const glossary = buildGlossary(lang, untranslated);
  const techniques = buildTechniques(lang, untranslated);
  const drills = buildDrills(lang, untranslated);
  const body = {
    lang,
    source: SOURCE,
    untranslated: [...untranslated].sort(),
    palette: palette(),
    court: { widthM: 9, lengthM: 18, attackLineM: 3 },
    guides,
    positions,
    rules,
    glossary,
    techniques,
    drills,
  };
  // The hash covers the document without contentVersion and publishedAt, so
  // two builds of the same content give the same hash.
  const hash = createHash('sha256')
    .update(JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...body }))
    .digest('hex')
    .slice(0, 12);
  return {
    schemaVersion: SCHEMA_VERSION,
    contentVersion: `${now.toISOString().slice(0, 10)}.${hash}`,
    publishedAt: `${now.toISOString().slice(0, 19)}Z`,
    ...body,
  };
}
