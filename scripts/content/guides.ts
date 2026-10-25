// Guides: one converter per guide component (src/guides/Guide*.tsx), each
// turning the guide's `guideContent` structures into contract blocks, in the
// order the site renders them. The mapping is the table "Correspondance
// guideContent.json vers les blocs" of the contract.
import { GUIDES } from '../../src/guides/data.ts';
import { CONFIG_LAYOUTS } from '../../src/positions/configurations.ts';
import {
  CONTENT_KEY_BY_CONFIG,
  LAYOUTS_BY_CONFIG,
  type DefenseLayout,
  type ZoneTab,
} from '../../src/guides/positionnementLayouts.ts';
import {
  accentOf,
  callout,
  cards,
  drills,
  labeled,
  link,
  list,
  only,
  pairs,
  paragraph,
  plain,
  rich,
  slugify,
  table,
  techniques,
  videos,
  type Block,
  type Card,
  type Pair,
  type Section,
  type TeamSize,
} from './blocks.ts';
import { Texts, type Lang } from './source.ts';

const SITE = 'https://volley-wiki.fr';
/** Not published in v1: it is about beach, out of the epic's scope. */
const EXCLUDED_GUIDES = new Set(['indoor-vs-beach']);
const SIZES: TeamSize[] = [6, 5, 4];
const ZONES: ZoneTab[] = ['zone4', 'zone3', 'zone2'];

type LabelText = { label: string; text: string };
type Video = { title: string; url: string };
type Ctx = { lang: Lang; t: Texts; drillsT: Texts; keyPoints: string };

const toPairs = (items: LabelText[]): Pair[] => items.map((i) => ({ term: i.label, text: i.text }));
const tuplePairs = (items: [string, string][]): Pair[] => items.map(([term, text]) => ({ term, text }));
const section = (id: string, blocks: Block[], title?: string): Section =>
  title ? { id, title, blocks } : { id, blocks };

function goldenRule(t: Texts, key = 'goldenRule'): Section {
  const mantra = t.has(`${key}.mantra`) ? t.get(`${key}.mantra`) : undefined;
  return section('golden-rule', [callout('rule', t.get(`${key}.body`), { mantra })]);
}

function drillSection(c: Ctx, skill: string): Section {
  const label = c.drillsT.get('sectionTitle').replace('{{skill}}', c.drillsT.get(`skills.${skill}`));
  return section('drills', [drills(skill)], label);
}

function videoSection(t: Texts, key: string): Section {
  return section('videos', [videos(t.get<Video[]>(`${key}.items`))], t.get(`${key}.title`));
}

// ---------------------------------------------------------------------------

function service(c: Ctx): Section[] {
  const { t } = c;
  type ServiceType = {
    name: string; levelLabel: string; tagline: string; description: string;
    biomechanics: string[]; steps: string[]; errors: LabelText[]; exercises: string[]; videos: Video[];
  };
  const types = t.get<ServiceType[]>('types.items');
  const typeCards: Card[] = types.map((s) => ({
    title: s.name,
    subtitle: s.tagline,
    tag: s.levelLabel,
    text: s.description,
    groups: [
      { label: t.get('types.biomechanicsLabel'), items: s.biomechanics },
      { label: t.get('types.stepsLabel'), items: s.steps },
      { label: t.get('types.errorsLabel'), items: s.errors.map((e) => labeled(e.label, e.text)) },
      { label: t.get('types.exercisesLabel'), items: s.exercises },
    ],
    videos: s.videos.length > 0 ? s.videos : undefined,
  }));
  const zoneRows = t.get<{ zone: string; effect: string }[]>('zones.rows');
  return [
    goldenRule(t),
    section('types', [cards(typeCards)], t.get('types.title')),
    section('zones', [
      table([t.get('zones.headerZone'), t.get('zones.headerEffect')], zoneRows.map((r) => [r.zone, r.effect])),
      pairs(toPairs(t.get<LabelText[]>('zones.tips'))),
    ], t.get('zones.title')),
    drillSection(c, 'serve'),
    section('learning-hierarchy', [
      callout('info', t.get('learningHierarchy.footer'), {
        label: t.get('learningHierarchy.label'),
        mantra: types.map((s) => `${s.name} (${s.levelLabel})`).join(' → '),
      }),
    ]),
  ];
}

function reception(c: Ctx): Section[] {
  const { t } = c;
  type System = { name: string; level: string; desc: string; pros: string[]; cons: string[] };
  type PasseurRole = { title: string; bullets: string[]; note?: string };
  type LiberoNote = { title: string; text: string };
  const sizes = (n: TeamSize) => ({ teamSizes: [n] });
  return [
    goldenRule(t),
    section('format', [paragraph(t.get('format.description'))], t.get('format.title')),
    section('ready-position', [
      list('bullet', t.get<string[]>('readyPosition.points')),
      callout('warning', t.get('readyPosition.errorText'), { label: t.get('readyPosition.errorLabel') }),
    ], t.get('readyPosition.title')),
    section('platform', [
      pairs(t.get<{ title: string; text: string }[]>('platform.tips').map((p) => ({ term: p.title, text: p.text }))),
    ], t.get('platform.title')),
    section('steps', [
      list('numbered', t.get<string[]>('steps.items')),
      callout('tip', t.get('steps.freezeText'), { label: t.get('steps.freezeLabel') }),
    ], t.get('steps.title')),
    section('displacements', [
      pairs(t.get<{ name: string; desc: string }[]>('displacements.items').map((d) => ({ term: d.name, text: d.desc }))),
      callout('info', t.get('displacements.oneHand.text'), { label: t.get('displacements.oneHand.label') }),
    ], t.get('displacements.title')),
    section('systems', SIZES.flatMap((n) => {
      const blocks: Block[] = [];
      if (n !== 6) {
        blocks.push(only(callout('warning', t.get(`systems.alert${n}`), { label: t.get('systems.nonOfficialLabel') }), sizes(n)));
      }
      const systems = t.get<System[]>(`systems.byTeamSize.${n}`);
      blocks.push(only(cards(systems.map((s) => ({
        title: s.name,
        tag: s.level,
        text: s.desc,
        groups: [
          { label: t.get('systems.prosLabel'), items: s.pros },
          { label: t.get('systems.consLabel'), items: s.cons },
        ],
      }))), sizes(n)));
      return blocks;
    }), t.get('systems.titlePrefix')),
    section('passeur', SIZES.map((n) => only(cards(t.get<PasseurRole[]>(`passeur.byTeamSize.${n}`).map((r) => ({
      title: r.title,
      text: r.note ? labeled(t.get('passeur.noteLabel'), r.note) : undefined,
      groups: [{ label: c.keyPoints, items: r.bullets }],
    }))), sizes(n))), t.get('passeur.titlePrefix')),
    section('libero', SIZES.map((n) => {
      const note = t.get<LiberoNote>(`libero.byTeamSize.${n}`);
      return only(callout('info', note.text, { label: note.title }), sizes(n));
    }), t.get('libero.title')),
    section('reading', [
      table(
        [t.get('reading.headerType'), t.get('reading.headerWhen')],
        t.get<{ type: string; adapt: string }[]>('reading.rows').map((r) => [r.type, r.adapt]),
      ),
      list('bullet', t.get<string[]>('reading.cues'), t.get('reading.cuesLabel')),
    ], t.get('reading.title')),
    section('errors', [
      pairs(toPairs(t.get<LabelText[]>('errors.common')), t.get('errors.commonLabel')),
      ...SIZES.map((n) => only(
        pairs(toPairs(t.get<LabelText[]>(`errors.byTeamSize.${n}`)), `${t.get('errors.sizeLabelPrefix')} ${n}v${n}`),
        sizes(n),
      )),
    ], t.get('errors.title')),
    drillSection(c, 'reception'),
    videoSection(t, 'videos'),
  ];
}

function attaque(c: Ctx): Section[] {
  const { t } = c;
  type Variant = { title: string; sub: string; items: LabelText[]; rule?: string };
  type AttackType = { name: string; position: string; description: string; keyPoints: string[]; shots: string[] };
  type Special = { name: string; levelLabel: string; desc: string };
  const variants = [t.get<Variant>('approach.three'), t.get<Variant>('approach.four')];
  return [
    goldenRule(t),
    section('phases', [
      pairs(t.get<{ name: string; desc: string }[]>('phases.items').map((p) => ({ term: p.name, text: p.desc }))),
      callout('info', t.get('phases.footer'), { label: t.get('phases.footerLabel') }),
    ], t.get('phases.title')),
    section('approach', [cards(variants.map((v) => ({
      title: v.title, subtitle: v.sub, text: v.rule, pairs: toPairs(v.items),
    })))], t.get('approach.title')),
    section('timing', [table(
      [t.get('timing.headerType'), t.get('timing.headerWhen')],
      t.get<{ type: string; timing: string }[]>('timing.rows').map((r) => [r.type, r.timing]),
    )], t.get('timing.title')),
    section('types', [cards(t.get<AttackType[]>('types.items').map((a) => ({
      title: a.name,
      subtitle: a.position,
      text: a.description,
      groups: [
        { label: t.get('types.keyPointsLabel'), items: a.keyPoints },
        { label: t.get('types.shotsLabel'), items: a.shots },
      ],
    })))], t.get('types.title')),
    section('special', [cards(t.get<Special[]>('special.items').map((s) => ({
      title: s.name, tag: s.levelLabel, text: s.desc,
    })))], t.get('special.title')),
    section('errors', [pairs(toPairs(t.get<LabelText[]>('errors.items')), t.get('errors.subtitle'))], t.get('errors.title')),
    drillSection(c, 'attack'),
    videoSection(t, 'videos'),
  ];
}

function contre(c: Ctx): Section[] {
  const { t } = c;
  type ContreType = { name: string; objective: string; points: LabelText[] };
  type BlockStyle = { label: string; body: string; points: string[] };
  type JumpColumn = { title: string; items: { label?: string; text: string }[] };
  const styles = [t.get<BlockStyle>('blockStyles.read'), t.get<BlockStyle>('blockStyles.commit')];
  return [
    goldenRule(t),
    section('fundamentals', [paragraph(t.get('fundamentals.html'))], t.get('fundamentals.title')),
    section('timing-steps', [list('numbered',
      t.get<{ title: string; desc: string }[]>('timingSteps.items').map((s) => labeled(s.title, s.desc)),
    )], t.get('timingSteps.title')),
    section('types', [cards(t.get<ContreType[]>('types.items').map((ct) => ({
      title: ct.name,
      subtitle: `${t.get('types.objectiveLabel')} : ${ct.objective}`,
      pairs: toPairs(ct.points),
    })))], t.get('types.title')),
    section('timing-tips', [pairs(toPairs(t.get<LabelText[]>('timingTips.items')))], t.get('timingTips.title')),
    section('visual-sequence', [
      paragraph(t.get('visualSequence.intro')),
      list('numbered', t.get<string[]>('visualSequence.chips')),
      pairs(toPairs(t.get<LabelText[]>('visualSequence.items'))),
    ], t.get('visualSequence.title')),
    section('timing-by-attack', [table(
      [t.get('timingByAttack.headerType'), t.get('timingByAttack.headerWhen')],
      t.get<{ type: string; timing: string }[]>('timingByAttack.rows').map((r) => [r.type, r.timing]),
    )], t.get('timingByAttack.title')),
    section('block-styles', [cards(styles.map((s) => ({
      title: s.label, text: s.body, groups: [{ label: c.keyPoints, items: s.points }],
    })))], t.get('blockStyles.title')),
    section('jump-technique', [cards(t.get<JumpColumn[]>('jumpTechnique.columns').map((col) => ({
      title: col.title,
      groups: [{ label: col.title, items: col.items.map((i) => (i.label ? labeled(i.label, i.text) : i.text)) }],
    })))], t.get('jumpTechnique.title')),
    section('errors', [pairs(toPairs(t.get<LabelText[]>('errors.items')), t.get('errors.subtitle'))], t.get('errors.title')),
    section('exercises', [pairs(
      t.get<{ title: string; desc: string }[]>('exercises.items').map((e) => ({ term: e.title, text: e.desc })),
    )], t.get('exercises.title')),
    section('pro-tips', [pairs(toPairs(t.get<LabelText[]>('proTips.items')))], t.get('proTips.title')),
    drillSection(c, 'block'),
    videoSection(t, 'videos'),
  ];
}

// ---------------------------------------------------------------------------
// Defensive positioning: every format and configuration in one guide, the
// site's `/guides/positionnement-defense/<n>v<n>/<config>` pages becoming
// `appliesTo` restrictions.

function defenseCourt(layout: DefenseLayout, labels: string[], teamSize: TeamSize, caption: string): Block {
  return {
    type: 'court',
    teamSize,
    caption,
    ball: { x: layout.ballX, y: layout.ballY },
    players: layout.players.map((p) => {
      const colorKey = p.role ?? p.zoneId;
      return {
        colorKey,
        x: p.x,
        y: p.y,
        // The site prints the zone number; keep it when the colour no longer says it (libero).
        ...(colorKey !== p.zoneId || p.label ? { label: p.label ?? p.zoneId.slice(1) } : {}),
        ...(p.sub ? { tag: p.sub } : {}),
      };
    }),
    zones: layout.zones.map((z, i) => ({
      colorKey: z.role ?? z.posNumber,
      x: z.x,
      y: z.y,
      w: z.w,
      h: z.h,
      ...(labels[i] ? { label: labels[i] } : {}),
    })),
    arrows: [
      { kind: 'main', from: { x: layout.ballX, y: layout.ballY }, to: { x: layout.mainShot.toX, y: layout.mainShot.toY } },
      ...layout.altShots.map((s) => ({
        kind: 'alt', from: { x: layout.ballX, y: layout.ballY }, to: { x: s.toX, y: s.toY },
      })),
    ],
  };
}

/** Defense notes mix plain strings and label/text pairs: one block per run. */
function noteBlocks(notes: (string | LabelText)[]): Block[] {
  const blocks: Block[] = [];
  let run: (string | LabelText)[] = [];
  const flush = () => {
    if (run.length === 0) return;
    blocks.push(typeof run[0] === 'string'
      ? list('bullet', run as string[])
      : pairs(toPairs(run as LabelText[])));
    run = [];
  };
  for (const note of notes) {
    if (run.length > 0 && typeof run[0] !== typeof note) flush();
    run.push(note);
  }
  flush();
  return blocks;
}

function positionnement(c: Ctx): Section[] {
  const { t } = c;
  type PrincipleCard = { title: string; points: string[] };
  type Indicator = { title: string; action: string; accentColor: string; points: string[] };
  type DefenseSystem = {
    name: string; tag: string; principe: string; forces: string[]; faiblesses: string[]; indication: string; accent: string;
  };
  type DefenseData = {
    title: string;
    warning: LabelText | null;
    systems: DefenseSystem[];
    tableHeaders: string[];
    tableRows: string[][];
    footer: { strong: string; text: string };
  };
  type Exercise = { title: string; level: string; duration: string; materiel: string; objectif: string; steps: string[] };
  type Side = { title: string; action: string; desc: string };
  const sizes = (n: TeamSize) => ({ teamSizes: [n] });
  const principleCard = (p: PrincipleCard): Card => ({ title: p.title, groups: [{ label: c.keyPoints, items: p.points }] });

  const courtBlocks: Block[] = [];
  for (const n of SIZES) {
    for (const config of CONFIG_LAYOUTS[n]) {
      const layouts = LAYOUTS_BY_CONFIG[config.id];
      if (!layouts) throw new Error(`no defensive layout for configuration ${config.id}`);
      const contentKey = CONTENT_KEY_BY_CONFIG[config.id] ?? config.id;
      const appliesTo = { teamSizes: [n], configurationIds: [config.id] };
      for (const zone of ZONES) {
        const caption = t.get(`zonePositioning.captionsByZone.${zone}`);
        courtBlocks.push(only(defenseCourt(layouts[zone], t.get<string[]>(`layoutLabels.${contentKey}.${zone}`), n, caption), appliesTo));
        for (const b of noteBlocks(t.get<(string | LabelText)[]>(`layoutNotes.${contentKey}.${zone}`))) {
          courtBlocks.push(only(b, appliesTo));
        }
      }
    }
  }
  const legendDesc = (key: string) => t.get(`zonePositioning.legend.${key}Desc`).replace(/^=\s*/, '');
  courtBlocks.push(pairs(['blk', 'off', 'def'].map((k) => ({ term: t.get(`zonePositioning.legend.${k}`), text: legendDesc(k) }))));

  const sides = [t.get<Side>('commandments.sameSide'), t.get<Side>('commandments.oppositeSide')];
  return [
    section('selectors', [paragraph(t.get('selectors.description'))], t.get('selectors.title')),
    section('principle', [
      callout('info', t.get('principle.lead'), { label: t.get('principle.label') }),
      list('bullet', t.get<string[]>('principle.points')),
    ]),
    section('postes', SIZES.map((n) => only(
      callout('warning', t.get(`postes.ruleByTeamSize.${n}`), { label: t.get('postes.ruleLabel') }),
      sizes(n),
    )), t.get('postes.titlePrefix')),
    section('zone-positioning', courtBlocks, t.get('zonePositioning.title')),
    section('general-principles', [
      ...SIZES.map((n) => only(cards([
        principleCard(t.get<PrincipleCard>('generalPrinciples.cards.front')),
        principleCard(t.get<PrincipleCard>(`generalPrinciples.cards.pivotByTeamSize.${n}`)),
        principleCard(t.get<PrincipleCard>('generalPrinciples.cards.back')),
      ], t.get('generalPrinciples.responsibilityLabel')), sizes(n))),
      cards([{
        title: t.get('generalPrinciples.universalsCard.title'),
        text: t.get('generalPrinciples.universalsCard.intro'),
        pairs: tuplePairs(t.get<[string, string][]>('generalPrinciples.universalsCard.items')),
      }]),
    ], t.get('generalPrinciples.title')),
    section('reading-attacker', [
      paragraph(t.get('readingAttacker.intro')),
      cards(t.get<Indicator[]>('readingAttacker.indicators').map((i) => ({
        title: i.title, subtitle: i.action, accent: accentOf(i.accentColor), groups: [{ label: c.keyPoints, items: i.points }],
      }))),
      callout('tip', t.get('readingAttacker.proTipText'), { label: t.get('readingAttacker.proTipLabel') }),
    ], t.get('readingAttacker.title')),
    section('advance-retreat', [cards(['advance', 'retreat'].map((k) => ({
      title: t.get(`advanceRetreat.${k}.title`),
      groups: [{ label: c.keyPoints, items: t.get<string[]>(`advanceRetreat.${k}.items`) }],
    })), t.get('advanceRetreat.label'))], t.get('advanceRetreat.title')),
    ...SIZES.map((n) => {
      const m = t.get<{ title: string; intro: string; mistakes: [string, string][] }>(`mistakes.byTeamSize.${n}`);
      return only(section(`mistakes-${n}`, [paragraph(m.intro), pairs(tuplePairs(m.mistakes))],
        `${t.get('mistakes.titlePrefix')} ${m.title}`), sizes(n));
    }),
    section('service-transition', [
      paragraph(t.get('serviceTransition.intro')),
      pairs(tuplePairs(t.get<[string, string][]>('serviceTransition.steps')), t.get('serviceTransition.stepsLabel')),
    ], t.get('serviceTransition.title')),
    section('communication', [
      paragraph(t.get('communication.intro')),
      ...t.get<{ moment: string; calls: [string, string][] }[]>('communication.groups')
        .map((g) => pairs(tuplePairs(g.calls), g.moment)),
      callout('rule', t.get('communication.ruleText'), { label: t.get('communication.ruleLabel') }),
    ], t.get('communication.title')),
    ...SIZES.map((n) => {
      const d = t.get<DefenseData>(`defenseSystems.byTeamSize.${n}`);
      const blocks: Block[] = [];
      if (d.warning) blocks.push(callout('warning', d.warning.text, { label: d.warning.label }));
      blocks.push(cards(d.systems.map((s) => ({
        title: s.name,
        subtitle: s.tag,
        accent: accentOf(s.accent),
        text: s.principe,
        groups: [
          { label: t.get('defenseSystems.forcesLabel'), items: s.forces },
          { label: t.get('defenseSystems.weaknessesLabel'), items: s.faiblesses },
          { label: t.get('defenseSystems.indicationLabel'), items: [s.indication] },
        ],
      }))));
      blocks.push(table([t.get('defenseSystems.tableHeaderCriterion'), ...d.tableHeaders], d.tableRows, t.get('defenseSystems.tableLabel')));
      blocks.push(callout('info', `**${d.footer.strong.trim()}** ${d.footer.text}`));
      return only(section(`defense-systems-${n}`, blocks, `${t.get('defenseSystems.titlePrefix')} ${d.title}`), sizes(n));
    }),
    section('transitions', [
      paragraph(t.get('transitions.intro')),
      ...t.get<{ label: string; items: [string, string][] }[]>('transitions.groups')
        .map((g) => pairs(tuplePairs(g.items), g.label)),
    ], t.get('transitions.title')),
    section('exercises', [cards(t.get<Exercise[]>('exercises.items').map((e) => ({
      title: e.title,
      tag: e.level,
      subtitle: `${t.get('exercises.durationLabel')} : ${e.duration} · ${t.get('exercises.materialLabel')} : ${e.materiel}`,
      text: labeled(t.get('exercises.objectiveLabel'), e.objectif),
      groups: [{ label: c.keyPoints, items: e.steps }],
    })))], t.get('exercises.title')),
    section('commandments', [
      pairs(tuplePairs(t.get<[string, string][]>('commandments.items'))),
      cards(sides.map((s) => ({ title: s.title, subtitle: s.action, text: s.desc }))),
    ], t.get('commandments.title')),
    drillSection(c, 'defense'),
    section('conclusion', [callout('info', `${t.get('conclusion.body1')} ${t.get('conclusion.body2')}`, {
      label: t.get('conclusion.label'), mantra: t.get('conclusion.mantra'),
    })]),
  ];
}

// ---------------------------------------------------------------------------

function lectureDuJeu(c: Ctx): Section[] {
  const { t, lang } = c;
  const cueSection = (key: string, listKey: string) => section(slugify(key), [
    paragraph(t.get(`${key}.intro`)),
    pairs(toPairs(t.get<LabelText[]>(`${key}.${listKey}`))),
  ], t.get(`${key}.title`));
  return [
    goldenRule(t),
    section('eye-sequence', [
      paragraph(t.get('eyeSequence.intro')),
      cards(t.get<{ phase: string; items: string[] }[]>('eyeSequence.phases').map((p) => ({
        title: p.phase, groups: [{ label: c.keyPoints, items: p.items }],
      }))),
    ], t.get('eyeSequence.title')),
    cueSection('readServer', 'cues'),
    cueSection('readPasserOpp', 'cases'),
    cueSection('readSetter', 'cues'),
    cueSection('readHitter', 'cues'),
    cueSection('blockTiming', 'rules'),
    section('if-then', [
      paragraph(t.get('ifThen.intro')),
      pairs(t.get<{ if: string; then: string }[]>('ifThen.scenarios').map((s) => ({ term: s.if, text: s.then }))),
    ], t.get('ifThen.title')),
    section('scouting', [
      paragraph(t.get('scouting.intro')),
      cards(t.get<{ axis: string; questions: string[] }[]>('scouting.axes').map((a) => ({
        title: a.axis, groups: [{ label: c.keyPoints, items: a.questions }],
      }))),
    ], t.get('scouting.title')),
    section('scouting-format', [
      paragraph(t.get('scoutingFormat.intro')),
      list('check', t.get<string[]>('scoutingFormat.checklist')),
    ], t.get('scoutingFormat.title')),
    section('common-mistakes', [pairs(toPairs(t.get<LabelText[]>('commonMistakes.items')))], t.get('commonMistakes.title')),
    section('drills', [pairs(
      t.get<{ level: string; desc: string }[]>('drills.items').map((d) => ({ term: d.level, text: d.desc })),
      t.get('drills.level'),
    )], t.get('drills.title')),
    section('linked-scenarios', [
      link(t.get('linkedScenarios.title'), `${SITE}/${lang}/scenarios`, t.get('linkedScenarios.intro')),
    ], t.get('linkedScenarios.title')),
  ];
}

function signauxArbitre(c: Ctx): Section[] {
  const { t } = c;
  // The site prints these two labels in French whatever the language.
  const [gesture, context] = t.contentLang === 'fr' ? ['Geste', 'Contexte'] : ['Gesture', 'Context'];
  type Signal = { name: string; gesture: string; context: string };
  return [
    goldenRule(t, 'intro'),
    section('signals', [cards(t.get<Signal[]>('signals').map((s, i) => ({
      title: s.name,
      tag: `N° ${String(i + 1).padStart(2, '0')}`,
      pairs: [{ term: gesture, text: s.gesture }, { term: context, text: s.context }],
    })))], t.get('intro.title')),
  ];
}

function erreursTypiques(c: Ctx): Section[] {
  const { t } = c;
  type Position = { role: string; color: string; errors: LabelText[] };
  return [
    goldenRule(t, 'intro'),
    section('positions', [cards(t.get<Position[]>('positions').map((p) => ({
      title: p.role, colorKey: p.color, pairs: toPairs(p.errors),
    })))], t.get('intro.title')),
  ];
}

function passe(c: Ctx): Section[] {
  const { t } = c;
  return [
    goldenRule(t),
    section('hands', [paragraph(t.get('hands.intro')), pairs(toPairs(t.get<LabelText[]>('hands.cues')))], t.get('hands.title')),
    section('footwork', [paragraph(t.get('footwork.intro')), list('numbered', t.get<string[]>('footwork.steps'))], t.get('footwork.title')),
    section('decisions', [paragraph(t.get('decisions.intro')), pairs(toPairs(t.get<LabelText[]>('decisions.items')))], t.get('decisions.title')),
    drillSection(c, 'set'),
  ];
}

function jeuCollectif(c: Ctx): Section[] {
  const { t } = c;
  return [
    goldenRule(t),
    section('phases', [
      paragraph(t.get('phases.intro')),
      cards(t.get<{ phase: string; items: string[] }[]>('phases.items').map((p) => ({
        title: p.phase, groups: [{ label: c.keyPoints, items: p.items }],
      }))),
    ], t.get('phases.title')),
    section('coverage', [paragraph(t.get('coverage.intro')), pairs(toPairs(t.get<LabelText[]>('coverage.items')))], t.get('coverage.title')),
    section('communication', [paragraph(t.get('communication.intro')), pairs(toPairs(t.get<LabelText[]>('communication.items')))], t.get('communication.title')),
    drillSection(c, 'team-play'),
  ];
}

const techniquesDeBase = (): Section[] => [section('techniques', [techniques()])];

/** guide slug -> guideContent key (null when the guide has none) and converter. */
const CONVERTERS: Record<string, [string | null, (c: Ctx) => Section[]]> = {
  'techniques-de-base': [null, techniquesDeBase],
  service: ['service', service],
  'passe-setter': ['passe', passe],
  'jeu-collectif': ['jeuCollectif', jeuCollectif],
  reception: ['reception', reception],
  attaque: ['attaque', attaque],
  contre: ['contre', contre],
  'positionnement-defense': ['positionnement', positionnement],
  'lecture-du-jeu': ['lectureDuJeu', lectureDuJeu],
  'signaux-arbitre': ['signauxArbitre', signauxArbitre],
  'erreurs-typiques': ['erreursTypiques', erreursTypiques],
};

const CATEGORY = { Technique: 'technique', Tactique: 'tactic' } as const;
const LEVEL = { Débutant: 'beginner', Intermédiaire: 'intermediate', Avancé: 'advanced' } as const;

export function buildGuides(lang: Lang, untranslated: Set<string>): unknown[] {
  const order = Object.keys(new Texts('fr', 'guides').get<Record<string, unknown>>('list'));
  const drillsT = new Texts(lang, 'drills');
  return order.filter((slug) => !EXCLUDED_GUIDES.has(slug)).map((slug) => {
    const meta = GUIDES.find((g) => g.slug === slug);
    const converter = CONVERTERS[slug];
    if (!meta || !converter) throw new Error(`guide ${slug} has no metadata or converter`);
    const [key, convert] = converter;
    const t = new Texts(lang, 'guideContent', key ?? '');
    const keyPointsLang = key ? t.contentLang : lang;
    const keyPoints = new Texts(keyPointsLang, 'guideContent').get('attaque.types.keyPointsLabel');
    const sections = convert({ lang, t, drillsT, keyPoints });
    const meta18n = new Texts(lang, 'guides', `list.${slug}`);
    const guide = {
      slug,
      title: plain(meta18n.get('title')),
      subtitle: plain(meta18n.get('subtitle')),
      description: rich(meta18n.get('description')),
      category: CATEGORY[meta.category],
      level: LEVEL[meta.level],
      readingTimeMinutes: Number(/\d+/.exec(meta18n.get('readingTime'))?.[0]),
      sections,
    };
    if (t.fellBack || meta18n.fellBack) untranslated.add(`guide:${slug}`);
    return guide;
  });
}
