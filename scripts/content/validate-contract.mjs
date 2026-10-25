#!/usr/bin/env node
// Vendored copy of `scripts/wiki-content/validate.mjs` from the app repository
// (Xavier-Cliquennois/volley-quest), which owns the v1 contract
// (`docs/wiki-content.md`). Do not edit by hand: copy it again when the
// contract changes. The content build only uses `validateInput`, which does
// not read the contract document.
// Validates wiki content documents against the v1 contract in docs/wiki-content.md.
//
// Usage:
//   node scripts/wiki-content/validate.mjs                    # validates the sample fixture
//   node scripts/wiki-content/validate.mjs <file.json>        # one language document, or { fr, en }
//   node scripts/wiki-content/validate.mjs --wiki <dir>       # also checks guideContent.json coverage
//   node scripts/wiki-content/selftest.mjs                    # broken variants of the sample must fail
//
// No dependency on purpose: the volley-wiki build can run or copy it as is.
// The list of block types and the guideContent mapping are read from the
// contract document itself, so the doc and this script cannot drift apart.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTRACT_PATH = path.join(ROOT, 'docs', 'wiki-content.md');
const DEFAULT_SAMPLE = path.join(ROOT, 'docs', 'fixtures', 'wiki-content.sample.json');

const SCHEMA_VERSION = 1;
const MAX_DOCUMENT_BYTES = 1024 * 1024;
const MAX_PLAIN = 300;
const MAX_RICH = 2000;
const LANGS = ['fr', 'en'];
const SOURCE = 'https://volley-wiki.fr';
const COLOR_KEYS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'L'];
const TEAM_SIZES = [4, 5, 6];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const GUIDE_CATEGORIES = ['technique', 'tactic'];
const TECHNIQUE_CATEGORIES = ['serve', 'reception', 'set', 'attack', 'defense'];
const DRILL_SKILLS = ['reception', 'set', 'attack', 'defense', 'serve', 'block', 'team-play'];
const CALLOUT_TONES = ['rule', 'tip', 'warning', 'info'];
const LIST_STYLES = ['bullet', 'numbered', 'check'];
const ACCENTS = ['orange', 'plum', 'teal', 'ink'];
const ARROW_KINDS = ['main', 'alt'];
const WHOLE_SECTIONS = ['guides', 'positions', 'rules', 'glossary', 'techniques', 'drills'];
const MAX_URL = 300;
// Exactly one 11-character video id, no other query parameter.
const YOUTUBE_WATCH_QUERY_RE = /^\?v=[A-Za-z0-9_-]{11}$/;
const YOUTUBE_SHORT_PATH_RE = /^\/[A-Za-z0-9_-]{11}$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CONFIG_ID_RE = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;
const CONTENT_VERSION_RE = /^\d{4}-\d{2}-\d{2}\.[0-9a-f]{12}$/;
const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const HEX_RE = /^#[0-9a-f]{6}$/;
const HTML_RE = /<\/?[a-zA-Z!]/;

// ---------------------------------------------------------------------------
// Contract document parsing

/** Returns the markdown table rows (cells, trimmed) under the given heading. */
function tableRowsUnder(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start === -1) throw new Error(`heading not found in contract: ${heading}`);
  const rows = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#')) break;
    if (!line.startsWith('|') || /^\|[\s|:-]+\|$/.test(line)) continue;
    rows.push(line.slice(1, -1).split('|').map((c) => c.trim()));
  }
  return rows;
}

const backticked = (cell) => [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

function readContract() {
  const md = readFileSync(CONTRACT_PATH, 'utf8');
  const blockTypes = tableRowsUnder(md, '### Types de blocs')
    .map((cells) => backticked(cells[0])[0])
    .filter(Boolean);
  const mapping = new Map(); // "guide.section" -> block types
  const extraGuides = new Map(); // guide slug -> block types
  for (const cells of tableRowsUnder(md, '### Correspondance `guideContent.json` vers les blocs')) {
    const key = backticked(cells[0])[0];
    if (!key) continue;
    const types = backticked(cells[cells.length - 1]);
    (key.includes('.') ? mapping : extraGuides).set(key, types);
  }
  return { blockTypes, mapping, extraGuides };
}

// ---------------------------------------------------------------------------
// Validation helpers

class Checker {
  constructor() {
    this.errors = [];
  }
  fail(p, msg) {
    this.errors.push(`${p}: ${msg}`);
  }
  isObject(v, p) {
    if (v === null || typeof v !== 'object' || Array.isArray(v)) {
      this.fail(p, 'expected an object');
      return false;
    }
    return true;
  }
  isArray(v, p, { min = 0 } = {}) {
    if (!Array.isArray(v)) {
      this.fail(p, 'expected an array');
      return false;
    }
    if (v.length < min) this.fail(p, `expected at least ${min} item(s)`);
    return true;
  }
  text(v, p, max) {
    if (typeof v !== 'string' || v.trim() === '') return this.fail(p, 'expected a non-empty string');
    if (v.length > max) this.fail(p, `longer than ${max} characters`);
    if (v.includes('—')) this.fail(p, 'contains an em dash "—"');
    if (v.includes(';')) this.fail(p, 'contains a semicolon ";"');
    if (HTML_RE.test(v)) this.fail(p, 'contains HTML');
    if (/[\r\n]/.test(v)) this.fail(p, 'contains a line break');
  }
  plain(v, p) {
    this.text(v, p, MAX_PLAIN);
    if (typeof v === 'string' && v.includes('**')) this.fail(p, 'bold marker "**" in a plain field');
  }
  rich(v, p) {
    this.text(v, p, MAX_RICH);
    if (typeof v !== 'string') return;
    const parts = v.split('**');
    if (parts.length % 2 === 0) this.fail(p, 'unbalanced bold marker "**"');
    else if (parts.some((part, i) => i % 2 === 1 && part.trim() === '')) this.fail(p, 'empty bold span');
  }
  plainList(v, p, opts) {
    if (this.isArray(v, p, opts)) v.forEach((x, i) => this.plain(x, `${p}[${i}]`));
  }
  richList(v, p, opts) {
    if (this.isArray(v, p, opts)) v.forEach((x, i) => this.rich(x, `${p}[${i}]`));
  }
  oneOf(v, allowed, p) {
    if (!allowed.includes(v)) this.fail(p, `expected one of ${allowed.join(', ')}, got ${JSON.stringify(v)}`);
  }
  slug(v, p) {
    if (typeof v !== 'string' || !SLUG_RE.test(v)) this.fail(p, `invalid slug ${JSON.stringify(v)}`);
  }
  int(v, p, min) {
    if (!Number.isInteger(v) || v < min) this.fail(p, `expected an integer >= ${min}`);
  }
  coord(v, p) {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 100) this.fail(p, 'expected a number in [0, 100]');
  }
  point(v, p) {
    if (this.isObject(v, p)) {
      this.coord(v.x, `${p}.x`);
      this.coord(v.y, `${p}.y`);
    }
  }
  url(v, p, check) {
    if (typeof v !== 'string') return this.fail(p, 'expected a url string');
    if (v.length > MAX_URL) return this.fail(p, `url longer than ${MAX_URL} characters`);
    let parsed;
    try {
      parsed = new URL(v);
    } catch {
      return this.fail(p, `invalid url ${JSON.stringify(v)}`);
    }
    if (parsed.protocol !== 'https:') return this.fail(p, 'url must use https');
    if (parsed.username !== '' || parsed.password !== '') return this.fail(p, 'url must not carry credentials');
    if (parsed.port !== '') return this.fail(p, 'url must not set a port');
    if (!check(parsed)) this.fail(p, `url not allowed: ${v}`);
  }
  videoUrl(v, p) {
    this.url(v, p, (u) => {
      if (u.hash !== '') return false;
      if (u.host === 'youtu.be') return u.search === '' && YOUTUBE_SHORT_PATH_RE.test(u.pathname);
      if (u.host !== 'www.youtube.com' && u.host !== 'youtube.com') return false;
      return u.pathname === '/watch' && YOUTUBE_WATCH_QUERY_RE.test(u.search);
    });
  }
  siteUrl(v, p) {
    this.url(v, p, (u) => u.origin === SOURCE);
  }
  optional(obj, key, p, fn) {
    if (obj[key] !== undefined) fn(obj[key], `${p}.${key}`);
  }
  unique(items, key, p) {
    const seen = new Set();
    items.forEach((item, i) => {
      const id = item?.[key];
      if (seen.has(id)) this.fail(`${p}[${i}].${key}`, `duplicate ${JSON.stringify(id)}`);
      seen.add(id);
    });
  }
}

// ---------------------------------------------------------------------------
// Blocks

function checkVideos(c, items, p) {
  if (!c.isArray(items, p, { min: 1 })) return;
  items.forEach((v, i) => {
    if (!c.isObject(v, `${p}[${i}]`)) return;
    c.plain(v.title, `${p}[${i}].title`);
    c.videoUrl(v.url, `${p}[${i}].url`);
  });
}

function checkPairs(c, items, p) {
  if (!c.isArray(items, p, { min: 1 })) return;
  items.forEach((pair, i) => {
    if (!c.isObject(pair, `${p}[${i}]`)) return;
    c.plain(pair.term, `${p}[${i}].term`);
    c.rich(pair.text, `${p}[${i}].text`);
  });
}

function checkCard(c, card, p) {
  if (!c.isObject(card, p)) return;
  c.plain(card.title, `${p}.title`);
  c.optional(card, 'subtitle', p, (v, q) => c.plain(v, q));
  c.optional(card, 'tag', p, (v, q) => c.plain(v, q));
  c.optional(card, 'colorKey', p, (v, q) => c.oneOf(v, COLOR_KEYS, q));
  c.optional(card, 'accent', p, (v, q) => c.oneOf(v, ACCENTS, q));
  c.optional(card, 'text', p, (v, q) => c.rich(v, q));
  c.optional(card, 'groups', p, (groups, q) => {
    if (!c.isArray(groups, q, { min: 1 })) return;
    groups.forEach((g, i) => {
      if (!c.isObject(g, `${q}[${i}]`)) return;
      c.plain(g.label, `${q}[${i}].label`);
      c.richList(g.items, `${q}[${i}].items`, { min: 1 });
    });
  });
  c.optional(card, 'pairs', p, (v, q) => checkPairs(c, v, q));
  c.optional(card, 'videos', p, (v, q) => checkVideos(c, v, q));
  if (card.text === undefined && card.groups === undefined && card.pairs === undefined) {
    c.fail(p, 'a card needs at least one of text, groups, pairs');
  }
}

/** One validator per block type. Keys must match the contract's block table. */
const BLOCK_CHECKS = {
  paragraph: (c, b, p) => c.rich(b.text, `${p}.text`),
  callout: (c, b, p) => {
    c.oneOf(b.tone, CALLOUT_TONES, `${p}.tone`);
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    c.optional(b, 'mantra', p, (v, q) => c.plain(v, q));
    c.rich(b.text, `${p}.text`);
  },
  list: (c, b, p) => {
    c.oneOf(b.style, LIST_STYLES, `${p}.style`);
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    c.richList(b.items, `${p}.items`, { min: 1 });
  },
  pairs: (c, b, p) => {
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    checkPairs(c, b.items, `${p}.items`);
  },
  table: (c, b, p) => {
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    c.plainList(b.columns, `${p}.columns`, { min: 1 });
    if (!c.isArray(b.rows, `${p}.rows`, { min: 1 })) return;
    const width = Array.isArray(b.columns) ? b.columns.length : 0;
    b.rows.forEach((row, i) => {
      c.richList(row, `${p}.rows[${i}]`);
      if (Array.isArray(row) && row.length !== width) c.fail(`${p}.rows[${i}]`, `expected ${width} cells`);
    });
  },
  cards: (c, b, p) => {
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    if (c.isArray(b.items, `${p}.items`, { min: 1 })) b.items.forEach((card, i) => checkCard(c, card, `${p}.items[${i}]`));
  },
  court: (c, b, p) => {
    c.oneOf(b.teamSize, TEAM_SIZES, `${p}.teamSize`);
    c.optional(b, 'caption', p, (v, q) => c.plain(v, q));
    if (c.isArray(b.players, `${p}.players`, { min: 1 })) {
      b.players.forEach((pl, i) => {
        const q = `${p}.players[${i}]`;
        if (!c.isObject(pl, q)) return;
        c.oneOf(pl.colorKey, COLOR_KEYS, `${q}.colorKey`);
        c.coord(pl.x, `${q}.x`);
        c.coord(pl.y, `${q}.y`);
        c.optional(pl, 'label', q, (v, r) => c.plain(v, r));
        c.optional(pl, 'tag', q, (v, r) => c.plain(v, r));
      });
    }
    c.optional(b, 'zones', p, (zones, q) => {
      if (!c.isArray(zones, q)) return;
      zones.forEach((z, i) => {
        const r = `${q}[${i}]`;
        if (!c.isObject(z, r)) return;
        c.oneOf(z.colorKey, COLOR_KEYS, `${r}.colorKey`);
        for (const k of ['x', 'y', 'w', 'h']) c.coord(z[k], `${r}.${k}`);
        if (z.x + z.w > 100 || z.y + z.h > 100) c.fail(r, 'zone goes past the half court');
        c.optional(z, 'label', r, (v, s) => c.plain(v, s));
      });
    });
    c.optional(b, 'ball', p, (v, q) => c.point(v, q));
    c.optional(b, 'arrows', p, (arrows, q) => {
      if (!c.isArray(arrows, q)) return;
      arrows.forEach((a, i) => {
        const r = `${q}[${i}]`;
        if (!c.isObject(a, r)) return;
        c.oneOf(a.kind, ARROW_KINDS, `${r}.kind`);
        c.point(a.from, `${r}.from`);
        c.point(a.to, `${r}.to`);
      });
    });
  },
  videos: (c, b, p) => {
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
    checkVideos(c, b.items, `${p}.items`);
  },
  link: (c, b, p) => {
    c.plain(b.label, `${p}.label`);
    c.optional(b, 'text', p, (v, q) => c.rich(v, q));
    c.siteUrl(b.url, `${p}.url`);
  },
  drills: (c, b, p) => {
    c.oneOf(b.skill, DRILL_SKILLS, `${p}.skill`);
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
  },
  techniques: (c, b, p) => {
    c.optional(b, 'label', p, (v, q) => c.plain(v, q));
  },
};

/** Own-property lookup only: "constructor" or "toString" must not resolve to an inherited function. */
const blockCheckFor = (type) =>
  typeof type === 'string' && Object.hasOwn(BLOCK_CHECKS, type) ? BLOCK_CHECKS[type] : undefined;

function checkAppliesTo(c, v, p, configIds) {
  if (!c.isObject(v, p)) return;
  if (v.teamSizes === undefined && v.configurationIds === undefined) c.fail(p, 'empty appliesTo');
  c.optional(v, 'teamSizes', p, (sizes, q) => {
    if (c.isArray(sizes, q, { min: 1 })) sizes.forEach((s, i) => c.oneOf(s, TEAM_SIZES, `${q}[${i}]`));
  });
  c.optional(v, 'configurationIds', p, (ids, q) => {
    if (!c.isArray(ids, q, { min: 1 })) return;
    ids.forEach((id, i) => {
      if (!configIds.has(id)) c.fail(`${q}[${i}]`, `unknown configuration ${JSON.stringify(id)}`);
    });
  });
}

// ---------------------------------------------------------------------------
// Sections

function checkGuides(c, guides, p, configIds) {
  if (!c.isArray(guides, p, { min: 1 })) return;
  c.unique(guides, 'slug', p);
  guides.forEach((g, i) => {
    const q = `${p}[${i}]`;
    if (!c.isObject(g, q)) return;
    c.slug(g.slug, `${q}.slug`);
    c.plain(g.title, `${q}.title`);
    c.plain(g.subtitle, `${q}.subtitle`);
    c.rich(g.description, `${q}.description`);
    c.oneOf(g.category, GUIDE_CATEGORIES, `${q}.category`);
    c.oneOf(g.level, LEVELS, `${q}.level`);
    c.int(g.readingTimeMinutes, `${q}.readingTimeMinutes`, 1);
    if (!c.isArray(g.sections, `${q}.sections`, { min: 1 })) return;
    c.unique(g.sections, 'id', `${q}.sections`);
    g.sections.forEach((s, j) => {
      const r = `${q}.sections[${j}]`;
      if (!c.isObject(s, r)) return;
      c.slug(s.id, `${r}.id`);
      c.optional(s, 'title', r, (v, t) => c.plain(v, t));
      c.optional(s, 'appliesTo', r, (v, t) => checkAppliesTo(c, v, t, configIds));
      if (!c.isArray(s.blocks, `${r}.blocks`, { min: 1 })) return;
      s.blocks.forEach((b, k) => {
        const t = `${r}.blocks[${k}]`;
        if (!c.isObject(b, t)) return;
        const check = blockCheckFor(b.type);
        if (!check) return c.fail(`${t}.type`, `unknown block type ${JSON.stringify(b.type)}`);
        c.optional(b, 'appliesTo', t, (v, u) => checkAppliesTo(c, v, u, configIds));
        check(c, b, t);
      });
    });
  });
}

function checkPositions(c, pos, p) {
  if (!c.isObject(pos, p)) return;
  c.rich(pos.intro, `${p}.intro`);
  if (c.isObject(pos.zones, `${p}.zones`)) {
    for (const k of COLOR_KEYS) c.plain(pos.zones[k], `${p}.zones.${k}`);
  }
  if (!c.isArray(pos.formats, `${p}.formats`, { min: 1 })) return;
  c.unique(pos.formats, 'teamSize', `${p}.formats`);
  const allConfigs = pos.formats.flatMap((f) => (Array.isArray(f?.configurations) ? f.configurations : []));
  c.unique(allConfigs, 'id', `${p}.formats[*].configurations`);
  pos.formats.forEach((f, i) => {
    const q = `${p}.formats[${i}]`;
    if (!c.isObject(f, q)) return;
    c.oneOf(f.teamSize, TEAM_SIZES, `${q}.teamSize`);
    c.plain(f.tagline, `${q}.tagline`);
    c.rich(f.description, `${q}.description`);
    c.rich(f.rules, `${q}.rules`);
    if (!c.isArray(f.configurations, `${q}.configurations`, { min: 1 })) return;
    f.configurations.forEach((cfg, j) => {
      const r = `${q}.configurations[${j}]`;
      if (!c.isObject(cfg, r)) return;
      if (typeof cfg.id !== 'string' || !CONFIG_ID_RE.test(cfg.id)) c.fail(`${r}.id`, 'invalid configuration id');
      c.plain(cfg.name, `${r}.name`);
      c.plain(cfg.shortName, `${r}.shortName`);
      c.rich(cfg.description, `${r}.description`);
      if (typeof cfg.hasLibero !== 'boolean') c.fail(`${r}.hasLibero`, 'expected a boolean');
      if (!c.isArray(cfg.slots, `${r}.slots`, { min: 1 })) return;
      c.unique(cfg.slots, 'zone', `${r}.slots`);
      cfg.slots.forEach((s, k) => {
        const t = `${r}.slots[${k}]`;
        if (!c.isObject(s, t)) return;
        c.oneOf(s.zone, COLOR_KEYS, `${t}.zone`);
        c.oneOf(s.colorKey, COLOR_KEYS, `${t}.colorKey`);
        c.coord(s.x, `${t}.x`);
        c.coord(s.y, `${t}.y`);
        c.optional(s, 'name', t, (v, u) => c.plain(v, u));
        c.plain(s.role, `${t}.role`);
        c.rich(s.description, `${t}.description`);
        c.plainList(s.skills, `${t}.skills`, { min: 1 });
        c.plainList(s.traits, `${t}.traits`, { min: 1 });
      });
    });
  });
}

function checkRules(c, rules, p) {
  if (!c.isObject(rules, p)) return;
  c.rich(rules.warning, `${p}.warning`);
  c.richList(rules.quickFaults, `${p}.quickFaults`, { min: 1 });
  if (!c.isArray(rules.sections, `${p}.sections`, { min: 1 })) return;
  c.unique(rules.sections, 'id', `${p}.sections`);
  rules.sections.forEach((s, i) => {
    const q = `${p}.sections[${i}]`;
    if (!c.isObject(s, q)) return;
    c.slug(s.id, `${q}.id`);
    c.plain(s.num, `${q}.num`);
    c.plain(s.title, `${q}.title`);
    if (!c.isArray(s.rules, `${q}.rules`, { min: 1 })) return;
    s.rules.forEach((r, j) => {
      if (!c.isObject(r, `${q}.rules[${j}]`)) return;
      c.plain(r.title, `${q}.rules[${j}].title`);
      c.rich(r.text, `${q}.rules[${j}].text`);
    });
  });
}

function checkGlossary(c, glossary, p) {
  if (!c.isObject(glossary, p)) return;
  if (!c.isArray(glossary.terms, `${p}.terms`, { min: 1 })) return;
  c.unique(glossary.terms, 'id', `${p}.terms`);
  glossary.terms.forEach((t, i) => {
    const q = `${p}.terms[${i}]`;
    if (!c.isObject(t, q)) return;
    c.slug(t.id, `${q}.id`);
    c.plain(t.term, `${q}.term`);
    c.rich(t.definition, `${q}.definition`);
  });
}

function checkTechniques(c, techniques, p) {
  if (!c.isObject(techniques, p)) return;
  if (!c.isArray(techniques.items, `${p}.items`, { min: 1 })) return;
  c.unique(techniques.items, 'id', `${p}.items`);
  techniques.items.forEach((t, i) => {
    const q = `${p}.items[${i}]`;
    if (!c.isObject(t, q)) return;
    c.slug(t.id, `${q}.id`);
    c.plain(t.name, `${q}.name`);
    c.plain(t.icon, `${q}.icon`);
    c.oneOf(t.level, LEVELS, `${q}.level`);
    if (c.isArray(t.categories, `${q}.categories`, { min: 1 })) {
      t.categories.forEach((cat, j) => c.oneOf(cat, TECHNIQUE_CATEGORIES, `${q}.categories[${j}]`));
    }
    c.rich(t.description, `${q}.description`);
    c.rich(t.when, `${q}.when`);
    c.richList(t.keyPoints, `${q}.keyPoints`, { min: 1 });
    c.richList(t.errors, `${q}.errors`, { min: 1 });
    checkVideos(c, t.videos, `${q}.videos`);
  });
}

function checkDrills(c, drills, p) {
  if (!c.isObject(drills, p)) return;
  if (!c.isArray(drills.items, `${p}.items`, { min: 1 })) return;
  c.unique(drills.items, 'id', `${p}.items`);
  drills.items.forEach((d, i) => {
    const q = `${p}.items[${i}]`;
    if (!c.isObject(d, q)) return;
    c.slug(d.id, `${q}.id`);
    c.oneOf(d.skill, DRILL_SKILLS, `${q}.skill`);
    c.plain(d.title, `${q}.title`);
    c.rich(d.goal, `${q}.goal`);
    c.plain(d.duration, `${q}.duration`);
    c.int(d.minPlayers, `${q}.minPlayers`, 1);
    c.plainList(d.equipment, `${q}.equipment`);
    if (c.isArray(d.teamSizes, `${q}.teamSizes`, { min: 1 })) {
      d.teamSizes.forEach((s, j) => c.oneOf(s, TEAM_SIZES, `${q}.teamSizes[${j}]`));
    }
    if (c.isArray(d.variants, `${q}.variants`, { min: 1 })) {
      d.variants.forEach((v, j) => {
        if (!c.isObject(v, `${q}.variants[${j}]`)) return;
        c.oneOf(v.level, LEVELS, `${q}.variants[${j}].level`);
        c.rich(v.text, `${q}.variants[${j}].text`);
      });
    }
    c.richList(d.successCriteria, `${q}.successCriteria`, { min: 1 });
    c.optional(d, 'coachingCues', q, (v, r) => c.plainList(v, r));
    c.optional(d, 'sources', q, (v, r) => c.plainList(v, r));
  });
}

// ---------------------------------------------------------------------------
// Document

function checkDocument(c, doc, p, expectedLang) {
  if (!c.isObject(doc, p)) return;
  const bytes = Buffer.byteLength(JSON.stringify(doc), 'utf8');
  if (bytes > MAX_DOCUMENT_BYTES) c.fail(p, `document is ${bytes} bytes, max ${MAX_DOCUMENT_BYTES}`);
  if (doc.schemaVersion !== SCHEMA_VERSION) c.fail(`${p}.schemaVersion`, `expected ${SCHEMA_VERSION}`);
  if (typeof doc.contentVersion !== 'string' || !CONTENT_VERSION_RE.test(doc.contentVersion)) {
    c.fail(`${p}.contentVersion`, 'expected YYYY-MM-DD.<12 hex>');
  }
  if (typeof doc.publishedAt !== 'string' || !ISO_UTC_RE.test(doc.publishedAt) || Number.isNaN(Date.parse(doc.publishedAt))) {
    c.fail(`${p}.publishedAt`, 'expected an ISO 8601 UTC date');
  }
  c.oneOf(doc.lang, LANGS, `${p}.lang`);
  if (expectedLang && doc.lang !== expectedLang) c.fail(`${p}.lang`, `expected ${expectedLang}`);
  if (doc.source !== SOURCE) c.fail(`${p}.source`, `expected ${SOURCE}`);

  if (c.isObject(doc.palette, `${p}.palette`)) {
    for (const k of COLOR_KEYS) {
      if (typeof doc.palette[k] !== 'string' || !HEX_RE.test(doc.palette[k])) c.fail(`${p}.palette.${k}`, 'expected #rrggbb');
    }
    for (const k of Object.keys(doc.palette)) if (!COLOR_KEYS.includes(k)) c.fail(`${p}.palette.${k}`, 'unknown key');
  }
  if (c.isObject(doc.court, `${p}.court`)) {
    if (doc.court.widthM !== 9 || doc.court.lengthM !== 18 || doc.court.attackLineM !== 3) {
      c.fail(`${p}.court`, 'expected { widthM: 9, lengthM: 18, attackLineM: 3 }');
    }
  }

  const configIds = new Set(
    (doc.positions?.formats ?? []).flatMap((f) => (f?.configurations ?? []).map((cfg) => cfg?.id)),
  );
  checkPositions(c, doc.positions, `${p}.positions`);
  checkGuides(c, doc.guides, `${p}.guides`, configIds);
  checkRules(c, doc.rules, `${p}.rules`);
  checkGlossary(c, doc.glossary, `${p}.glossary`);
  checkTechniques(c, doc.techniques, `${p}.techniques`);
  checkDrills(c, doc.drills, `${p}.drills`);

  if (c.isArray(doc.untranslated, `${p}.untranslated`)) {
    if (doc.lang === 'fr' && doc.untranslated.length > 0) c.fail(`${p}.untranslated`, 'must be empty in fr');
    const slugs = new Set((doc.guides ?? []).map((g) => g?.slug));
    doc.untranslated.forEach((entry, i) => {
      const q = `${p}.untranslated[${i}]`;
      if (typeof entry === 'string' && entry.startsWith('guide:')) {
        if (!slugs.has(entry.slice('guide:'.length))) c.fail(q, `unknown guide ${JSON.stringify(entry)}`);
      } else if (!WHOLE_SECTIONS.includes(entry)) {
        c.fail(q, `expected guide:<slug> or one of ${WHOLE_SECTIONS.join(', ')}`);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// guideContent.json coverage (volley-wiki sources)

function checkCoverage(c, wikiDir, contract) {
  const readJson = (lang, file) =>
    JSON.parse(readFileSync(path.join(wikiDir, 'src', 'locales', lang, file), 'utf8'));
  const sections = new Set();
  for (const lang of LANGS) {
    const content = readJson(lang, 'guideContent.json');
    for (const [guide, guideSections] of Object.entries(content)) {
      for (const section of Object.keys(guideSections)) sections.add(`${guide}.${section}`);
    }
  }
  for (const key of sections) {
    if (!contract.mapping.has(key)) c.fail('coverage', `guideContent section ${key} has no row in the mapping table`);
  }
  for (const [key, types] of [...contract.mapping, ...contract.extraGuides]) {
    if (contract.mapping.has(key) && !sections.has(key)) c.fail('coverage', `mapping row ${key} matches no guideContent section`);
    if (types.length === 0) c.fail('coverage', `mapping row ${key} lists no block type`);
    for (const t of types) if (!blockCheckFor(t)) c.fail('coverage', `mapping row ${key} cites unknown block type ${t}`);
  }
  const guideSlugs = Object.keys(readJson('fr', 'guides.json').list);
  for (const slug of contract.extraGuides.keys()) {
    if (!guideSlugs.includes(slug)) c.fail('coverage', `extra guide ${slug} is not in guides.json`);
  }
  return sections.size;
}

// ---------------------------------------------------------------------------

/** Checks one language document or a { fr, en } object. Returns the languages found. */
function checkInput(c, input) {
  const docs = input && typeof input === 'object' && 'schemaVersion' in input ? { [input.lang]: input } : input;
  const langs = Object.keys(docs ?? {});
  if (langs.length === 0) c.fail('input', 'no document found');
  for (const lang of langs) checkDocument(c, docs[lang], lang, lang);
  return langs;
}

/** Validates parsed input and returns the list of errors (empty when valid). */
export function validateInput(input) {
  const c = new Checker();
  checkInput(c, input);
  return c.errors;
}

function main(argv) {
  let file = DEFAULT_SAMPLE;
  let wikiDir = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--wiki') wikiDir = path.resolve(argv[++i] ?? '');
    else file = path.resolve(argv[i]);
  }

  const c = new Checker();
  const contract = readContract();

  // The block table of the contract and this script must list the same types.
  const scriptTypes = Object.keys(BLOCK_CHECKS);
  for (const t of contract.blockTypes) if (!scriptTypes.includes(t)) c.fail('contract', `block type ${t} has no validator`);
  for (const t of scriptTypes) if (!contract.blockTypes.includes(t)) c.fail('contract', `block type ${t} is missing from the contract table`);
  const usedTypes = new Set([...contract.mapping.values(), ...contract.extraGuides.values()].flat());
  for (const t of contract.blockTypes) if (!usedTypes.has(t)) c.fail('contract', `block type ${t} is used by no mapping row`);

  const langs = checkInput(c, JSON.parse(readFileSync(file, 'utf8')));

  let covered = 0;
  if (wikiDir) covered = checkCoverage(c, wikiDir, contract);

  if (c.errors.length > 0) {
    console.error(`FAIL ${path.relative(process.cwd(), file)}: ${c.errors.length} error(s)`);
    for (const e of c.errors.slice(0, 50)) console.error(`  - ${e}`);
    if (c.errors.length > 50) console.error(`  ... and ${c.errors.length - 50} more`);
    process.exit(1);
  }
  console.log(`OK ${path.relative(process.cwd(), file)}: ${langs.join(', ')} valid against contract v${SCHEMA_VERSION}`);
  console.log(`OK contract: ${contract.blockTypes.length} block types (${contract.blockTypes.join(', ')})`);
  if (wikiDir) {
    console.log(`OK coverage: ${covered} guideContent sections (fr + en) mapped, ${contract.extraGuides.size} guides outside guideContent`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
