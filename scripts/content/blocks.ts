// Text normalisation and block builders for the published content (contract
// v1, `docs/wiki-content.md` in the app repository).
//
// Two kinds of text fields: `plain` (no markup at all) and `rich` (only
// `**bold**`). The site sources hold a few `<strong>` passages and some UI
// template tags (`<link>`, `<mono>`, `<count>`): `<strong>` becomes `**`, the
// other tags are removed. Typography rules (no em dash, no semicolon) are not
// fixed here: the validator rejects them so they get rewritten in the sources.

export type TeamSize = 4 | 5 | 6;
export type AppliesTo = { teamSizes?: TeamSize[]; configurationIds?: string[] };
export type Block = { type: string; appliesTo?: AppliesTo; [key: string]: unknown };
export type Section = { id: string; title?: string; appliesTo?: AppliesTo; blocks: Block[] };
export type Pair = { term: string; text: string };
export type Card = {
  title: string;
  subtitle?: string;
  tag?: string;
  colorKey?: string;
  accent?: string;
  text?: string;
  groups?: { label: string; items: string[] }[];
  pairs?: Pair[];
  videos?: { title: string; url: string }[];
};

const TEMPLATE_TAGS_RE = /<\/?(link|mono|count)>/g;

function squash(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Rich text: `<strong>` becomes `**`, template tags are dropped. */
export function rich(value: string): string {
  return squash(
    value
      .replace(TEMPLATE_TAGS_RE, '')
      .replace(/<strong>\s*/g, '**')
      .replace(/\s*<\/strong>/g, '**'),
  );
}

/** Plain text: no markup at all. */
export function plain(value: string): string {
  return squash(value.replace(TEMPLATE_TAGS_RE, '').replace(/<\/?strong>/g, '').replace(/\*\*/g, ''));
}

/** `**Label** : text`, the way the site prints a label before its text. */
export function labeled(label: string, text: string): string {
  return `**${plain(label)}** : ${rich(text)}`;
}

/** Drops the keys whose value is undefined or an empty string. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''),
  ) as T;
}

const optPlain = (v?: string) => (v ? plain(v) : undefined);
const optRich = (v?: string) => (v ? rich(v) : undefined);

export const paragraph = (text: string): Block => ({ type: 'paragraph', text: rich(text) });

export const callout = (
  tone: 'rule' | 'tip' | 'warning' | 'info',
  text: string,
  opts: { label?: string; mantra?: string } = {},
): Block =>
  compact({ type: 'callout', tone, label: optPlain(opts.label), mantra: optPlain(opts.mantra), text: rich(text) });

export const list = (style: 'bullet' | 'numbered' | 'check', items: string[], label?: string): Block =>
  compact({ type: 'list', style, label: optPlain(label), items: items.map(rich) });

export const pairs = (items: Pair[], label?: string): Block =>
  compact({ type: 'pairs', label: optPlain(label), items: items.map(pair) });

export const pair = (p: Pair): Pair => ({ term: plain(p.term), text: rich(p.text) });

export const table = (columns: string[], rows: string[][], label?: string): Block =>
  compact({ type: 'table', label: optPlain(label), columns: columns.map(plain), rows: rows.map((r) => r.map(rich)) });

export const cards = (items: Card[], label?: string): Block =>
  compact({ type: 'cards', label: optPlain(label), items: items.map(card) });

function card(c: Card): Card {
  return compact({
    title: plain(c.title),
    subtitle: optPlain(c.subtitle),
    tag: optPlain(c.tag),
    colorKey: c.colorKey,
    accent: c.accent,
    text: optRich(c.text),
    groups: c.groups?.map((g) => ({ label: plain(g.label), items: g.items.map(rich) })),
    pairs: c.pairs?.map(pair),
    videos: c.videos?.map(video),
  });
}

const video = (v: { title: string; url: string }) => ({ title: plain(v.title), url: v.url });

export const videos = (items: { title: string; url: string }[], label?: string): Block =>
  compact({ type: 'videos', label: optPlain(label), items: items.map(video) });

export const link = (label: string, url: string, text?: string): Block =>
  compact({ type: 'link', label: plain(label), text: optRich(text), url });

export const drills = (skill: string, label?: string): Block =>
  compact({ type: 'drills', skill, label: optPlain(label) });

export const techniques = (label?: string): Block => compact({ type: 'techniques', label: optPlain(label) });

/** Restricts a block or a section to some formats / configurations. */
export function only<T extends Block | Section>(item: T, appliesTo: AppliesTo): T {
  return { ...item, appliesTo };
}

/** `goldenRule` -> `golden-rule`, `3F-2B` -> `3f-2b`. */
export function slugify(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** `var(--orange)` -> `orange` when it is one of the contract accents. */
export function accentOf(cssValue?: string): string | undefined {
  const m = cssValue?.match(/^var\(--(orange|plum|teal|ink)\)$/);
  return m ? m[1] : undefined;
}
