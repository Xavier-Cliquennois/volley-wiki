// Reads the site's locale files, with the same French fallback as the site
// (`fallbackLng: 'fr'` in src/i18n/index.ts), and records every fallback so the
// document can list it in `untranslated`.
import { readFileSync } from 'node:fs';

export type Lang = 'fr' | 'en';

const ROOT = new URL('../../', import.meta.url);
const cache = new Map<string, unknown>();

export function readLocale(lang: Lang, ns: string): Record<string, unknown> {
  const key = `${lang}/${ns}`;
  if (!cache.has(key)) {
    const file = new URL(`src/locales/${lang}/${ns}.json`, ROOT);
    cache.set(key, JSON.parse(readFileSync(file, 'utf8')));
  }
  return cache.get(key) as Record<string, unknown>;
}

function lookup(root: unknown, path: string): unknown {
  let node = root;
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object' || !(part in node)) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

/**
 * Text accessor for one namespace (optionally under a prefix such as a guide
 * key). Missing paths fall back to French; a path missing in French too is a
 * build error, so a renamed key cannot silently empty a section.
 */
export class Texts {
  fellBack = false;
  private readonly lang: Lang;
  private readonly ns: string;
  private readonly prefix: string;

  constructor(lang: Lang, ns: string, prefix = '') {
    this.lang = lang;
    this.ns = ns;
    this.prefix = prefix;
  }

  /** Language the texts are actually read in (French when the whole prefix is missing). */
  get contentLang(): Lang {
    if (this.lang === 'fr' || !this.prefix) return this.lang;
    return lookup(readLocale(this.lang, this.ns), this.prefix) === undefined ? 'fr' : this.lang;
  }

  get<T = string>(path: string): T {
    const full = this.prefix ? `${this.prefix}.${path}` : path;
    const own = lookup(readLocale(this.lang, this.ns), full);
    if (own !== undefined) return own as T;
    const fr = lookup(readLocale('fr', this.ns), full);
    if (fr === undefined) throw new Error(`missing text ${this.ns}:${full}`);
    if (this.lang !== 'fr') this.fellBack = true;
    return fr as T;
  }

  has(path: string): boolean {
    const full = this.prefix ? `${this.prefix}.${path}` : path;
    return lookup(readLocale(this.lang, this.ns), full) !== undefined
      || lookup(readLocale('fr', this.ns), full) !== undefined;
  }
}
