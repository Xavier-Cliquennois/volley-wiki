// Non-guide sections of the published content: positions, rules, glossary,
// techniques and drills (contract v1, sections of the same name).
import { ROLE_COLORS } from '../../src/constants/positions.ts';
import { CONFIG_LAYOUTS } from '../../src/positions/configurations.ts';
import { TECHNIQUES_INDOOR, type TechniqueTag } from '../../src/techniques/data.ts';
import { DRILLS } from '../../src/drills/data.ts';
import type { Drill } from '../../src/drills/types.ts';
import { plain, rich, slugify, type TeamSize } from './blocks.ts';
import { Texts, readLocale, type Lang } from './source.ts';

const SIZES: TeamSize[] = [6, 5, 4];
const ZONE_KEYS = Object.keys(ROLE_COLORS) as (keyof typeof ROLE_COLORS)[];
const LEVEL = { Débutant: 'beginner', Intermédiaire: 'intermediate', Avancé: 'advanced' } as const;
const CATEGORY: Partial<Record<TechniqueTag, string>> = {
  Service: 'serve',
  Réception: 'reception',
  Passe: 'set',
  Attaque: 'attack',
  Défense: 'defense',
};

type Discipline = 'indoor' | 'beach';
/** An entry without `discipline` counts as indoor, as on the site. */
const isIndoor = (e: { discipline?: Discipline[] }) => !e.discipline || e.discipline.includes('indoor');

export const palette = () => ({ ...ROLE_COLORS });

export function buildPositions(lang: Lang, untranslated: Set<string>) {
  const t = new Texts(lang, 'positions');
  type Slot = { name?: string; role: string; description: string; skills: string[]; traits: string[] };
  const positions = {
    intro: rich(t.get('hub.intro')),
    zones: Object.fromEntries(ZONE_KEYS.map((z) => [z, plain(t.get(`commonZones.${z}.name`))])),
    formats: SIZES.map((n) => ({
      teamSize: n,
      tagline: plain(t.get(`hub.formats.${n}v${n}.tagline`)),
      description: rich(t.get(`hub.formats.${n}v${n}.description`)),
      rules: rich(t.get(`teamIntros.${n}.rules`)),
      configurations: CONFIG_LAYOUTS[n].map((layout) => ({
        id: layout.id,
        name: plain(t.get(`configurations.${layout.id}.name`)),
        shortName: plain(t.get(`configurations.${layout.id}.shortName`)),
        description: rich(t.get(`configurations.${layout.id}.description`)),
        hasLibero: layout.hasLibero,
        slots: layout.positions.map((p) => {
          const slot = t.get<Slot>(`configurations.${layout.id}.positions.${p.zoneId}`);
          return {
            zone: p.zoneId,
            colorKey: p.zoneId,
            x: p.court.x,
            y: p.court.y,
            ...(slot.name ? { name: plain(slot.name) } : {}),
            role: plain(slot.role),
            description: rich(slot.description),
            skills: slot.skills.map(plain),
            traits: slot.traits.map(plain),
          };
        }),
      })),
    })),
  };
  if (t.fellBack) untranslated.add('positions');
  return positions;
}

export function buildRules(lang: Lang, untranslated: Set<string>) {
  const t = new Texts(lang, 'rules');
  type RuleSection = { id: string; num: string; title: string; discipline?: Discipline[]; rules: { title: string; content: string }[] };
  const rules = {
    warning: rich(t.get('warning')),
    quickFaults: t.get<string[]>('quickFaults').map(rich),
    sections: t.get<RuleSection[]>('sections').filter(isIndoor).map((s) => ({
      id: s.id,
      num: plain(s.num),
      title: plain(s.title),
      rules: s.rules.map((r) => ({ title: plain(r.title), text: rich(r.content) })),
    })),
  };
  if (t.fellBack) untranslated.add('rules');
  return rules;
}

/** Slug of a term in its own language: accents removed, `Side-out` -> `side-out`. */
const termSlug = (term: string) => slugify(term.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());

export function buildGlossary(lang: Lang, untranslated: Set<string>) {
  const t = new Texts(lang, 'glossary');
  type Term = { term: string; def: string; discipline?: Discipline[] };
  const glossary = {
    terms: t.get<Term[]>('terms').filter(isIndoor).map((e) => ({
      id: termSlug(e.term),
      term: plain(e.term),
      definition: rich(e.def),
    })),
  };
  if (t.fellBack) untranslated.add('glossary');
  return glossary;
}

export function buildTechniques(lang: Lang, untranslated: Set<string>) {
  const t = new Texts(lang, 'techniques');
  type Item = { name: string; description: string; when: string; keyPoints: string[]; errors: string[] };
  const techniques = {
    items: TECHNIQUES_INDOOR.map((tech) => {
      const item = t.get<Item>(`items.${tech.id}`);
      return {
        id: tech.id,
        name: plain(item.name),
        icon: tech.icon,
        level: LEVEL[tech.level],
        categories: tech.tags.flatMap((tag) => (CATEGORY[tag] ? [CATEGORY[tag]] : [])),
        description: rich(item.description),
        when: rich(item.when),
        keyPoints: item.keyPoints.map(rich),
        errors: item.errors.map(rich),
        videos: tech.videos.map((v) => ({ title: plain(v.title), url: v.url })),
      };
    }),
  };
  if (t.fellBack) untranslated.add('techniques');
  return techniques;
}

type DrillOverlay = {
  title?: string;
  goal?: string;
  equipment?: string[];
  duration?: string;
  variants?: string[];
  successCriteria?: string[];
  coachingCues?: string[];
};

/**
 * Same overlay as the site (`src/drills/localizeDrill.ts`): the French source
 * of `src/drills/data.ts`, overlaid by the `content` entry of the language,
 * arrays only when they have the source's length. Returns whether every text
 * came from the overlay.
 */
function localizeDrill(drill: Drill, overlay: DrillOverlay | undefined): [Drill, boolean] {
  const same = <T>(o: T[] | undefined, src: unknown[]) => (o && o.length === src.length ? o : undefined);
  const equipment = same(overlay?.equipment, drill.setup.equipment);
  const variants = same(overlay?.variants, drill.variants);
  const criteria = same(overlay?.successCriteria, drill.successCriteria);
  const cues = drill.coachingCues ? same(overlay?.coachingCues, drill.coachingCues) : undefined;
  const complete = Boolean(
    overlay?.title && overlay.goal && variants && criteria
    && (drill.setup.equipment.length === 0 || equipment)
    && (!drill.coachingCues || cues),
  );
  return [{
    ...drill,
    title: overlay?.title ?? drill.title,
    goal: overlay?.goal ?? drill.goal,
    setup: { ...drill.setup, duration: overlay?.duration ?? drill.setup.duration, equipment: equipment ?? drill.setup.equipment },
    variants: drill.variants.map((v, i) => ({ ...v, description: variants?.[i] ?? v.description })),
    successCriteria: criteria ?? drill.successCriteria,
    coachingCues: cues ?? drill.coachingCues,
  }, complete];
}

export function buildDrills(lang: Lang, untranslated: Set<string>) {
  const content = lang === 'fr'
    ? undefined
    : (readLocale(lang, 'drills').content as Record<string, DrillOverlay> | undefined);
  let complete = true;
  const items = DRILLS.map((source) => {
    const [d, done] = lang === 'fr' ? [source, true] : localizeDrill(source, content?.[source.id]);
    complete &&= done;
    return {
      id: d.id,
      skill: d.skill,
      title: plain(d.title),
      goal: rich(d.goal),
      duration: plain(d.setup.duration),
      minPlayers: d.setup.minPlayers,
      equipment: d.setup.equipment.map(plain),
      teamSizes: d.setup.teamSizes,
      variants: d.variants.map((v) => ({ level: v.level, text: rich(v.description) })),
      successCriteria: d.successCriteria.map(rich),
      ...(d.coachingCues ? { coachingCues: d.coachingCues.map(plain) } : {}),
      ...(d.sources ? { sources: d.sources.map(plain) } : {}),
    };
  });
  if (!complete) untranslated.add('drills');
  return { items };
}
