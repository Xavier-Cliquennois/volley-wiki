import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Court, type CourtLayout } from '../components/court';
import { CONFIGURATIONS, type TeamSize } from '../positions/configurations';
import { S } from './styles';
import { TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { useCurrentLang } from '../i18n/paths';
import DrillList from '../drills/DrillList';
import { CONTENT_KEY_BY_CONFIG, LAYOUTS_BY_CONFIG, type DefenseLayout, type ZoneTab } from './positionnementLayouts';

const SLUG_TO_SIZE: Record<TeamSizeSlug, TeamSize> = { '4v4': 4, '5v5': 5, '6v6': 6 };
const SIZE_TO_SLUG: Record<TeamSize, TeamSizeSlug> = { 4: '4v4', 5: '5v5', 6: '6v6' };

type DefenseNote = string | { label: string; text: string };

function defenseToCourtLayout(layout: DefenseLayout, labels: string[]): CourtLayout {
  return {
    ball: { x: layout.ballX, y: layout.ballY },
    players: layout.players.map((p, i) => ({
      id: `${p.zoneId}-${i}`,
      x: p.x,
      y: p.y,
      label: p.label ?? p.zoneId.slice(1),
      role: p.role ?? p.zoneId,
      sub: p.sub,
    })),
    zones: layout.zones.map((z, i) => ({
      id: `${z.posNumber}-${i}`,
      x: z.x,
      y: z.y,
      w: z.w,
      h: z.h,
      role: z.role ?? z.posNumber,
      label: labels[i] ?? '',
      labelRole: z.labelRole,
      labelPos: z.labelPos,
    })),
    arrows: [
      {
        id: 'main',
        kind: 'main',
        from: { x: layout.ballX, y: layout.ballY },
        to: { x: layout.mainShot.toX, y: layout.mainShot.toY },
      },
      ...layout.altShots.map((s, i) => ({
        id: `alt-${i}`,
        kind: 'alt' as const,
        from: { x: layout.ballX, y: layout.ballY },
        to: { x: s.toX, y: s.toY },
      })),
    ],
  };
}


function DataDrivenDefense({
  layout,
  labels,
  notes,
  idSuffix,
}: {
  layout: DefenseLayout;
  labels: string[];
  notes: DefenseNote[];
  idSuffix: string;
}) {
  const courtLayout = defenseToCourtLayout(layout, labels);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court layout={courtLayout} view="full" idSuffix={idSuffix} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {notes.map((n, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            {typeof n === 'string' ? (
              <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{n}</span>
            ) : (
              <span>
                <strong style={{ color: 'var(--ink)' }}>{n.label} : </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{n.text}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type IndicatorCard = {
  title: string;
  action: string;
  accentColor: string;
  points: string[];
};

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

type DefenseSystem = {
  name: string;
  tag: string;
  principe: string;
  forces: string[];
  faiblesses: string[];
  indication: string;
  accent: string;
};

type DefenseSectionData = {
  title: string;
  warning: { label: string; text: string } | null;
  systems: DefenseSystem[];
  tableHeaders: string[];
  tableRows: string[][];
  footer: { strong: string; text: string };
};

type ExerciseItem = {
  title: string;
  level: string;
  duration: string;
  materiel: string;
  objectif: string;
  steps: string[];
};

type PrincipleCard = { title: string; points: string[] };

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnement({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
  const { t } = useTranslation('guideContent');
  const { t: tD } = useTranslation('drills');
  const lang = useCurrentLang();
  const teamSize: TeamSize = teamSizeProp ?? 6;
  const configurations = CONFIGURATIONS[teamSize];

  // Config is fully URL-driven via the parent route. Fallback to the first
  // configuration when not provided (e.g. the deprecated /:size route).
  const configId = configIdProp && configurations.some(c => c.id === configIdProp)
    ? configIdProp
    : configurations[0].id;

  const [zone, setZone] = useState<ZoneTab>('zone4');

  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  // JSON-driven content for the active config + team size.
  const contentKey = CONTENT_KEY_BY_CONFIG[configuration.id] ?? configuration.id;

  const renderZoneTab = () => {
    const layouts = LAYOUTS_BY_CONFIG[configuration.id];
    if (!layouts) {
      return (
        <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>
          {t('positionnement.zonePositioning.unavailable')}
        </div>
      );
    }
    const labels = (t(`positionnement.layoutLabels.${contentKey}.${zone}`, { returnObjects: true }) as string[]) || [];
    const notes = (t(`positionnement.layoutNotes.${contentKey}.${zone}`, { returnObjects: true }) as DefenseNote[]) || [];
    return (
      <DataDrivenDefense
        layout={layouts[zone]}
        labels={labels}
        notes={notes}
        idSuffix={`${configuration.id}-${zone}`}
      />
    );
  };

  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)', color: 'var(--ink)',
    cursor: 'pointer',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', boxShadow: 'var(--shadow-sm)' };

  // ─── content from JSON ───
  const principlePoints = t('positionnement.principle.points', { returnObjects: true }) as string[];
  const mistakesData = t(`positionnement.mistakes.byTeamSize.${teamSize}`, { returnObjects: true }) as MistakesSection;
  const defenseData = t(`positionnement.defenseSystems.byTeamSize.${teamSize}`, { returnObjects: true }) as DefenseSectionData;
  const indicators = t('positionnement.readingAttacker.indicators', { returnObjects: true }) as IndicatorCard[];
  const advanceItems = t('positionnement.advanceRetreat.advance.items', { returnObjects: true }) as string[];
  const retreatItems = t('positionnement.advanceRetreat.retreat.items', { returnObjects: true }) as string[];
  const universalItems = t('positionnement.generalPrinciples.universalsCard.items', { returnObjects: true }) as [string, string][];
  const serviceSteps = t('positionnement.serviceTransition.steps', { returnObjects: true }) as [string, string][];
  const commGroups = t('positionnement.communication.groups', { returnObjects: true }) as { moment: string; calls: [string, string][] }[];
  const transitionGroups = t('positionnement.transitions.groups', { returnObjects: true }) as { label: string; items: [string, string][] }[];
  const exercises = t('positionnement.exercises.items', { returnObjects: true }) as ExerciseItem[];
  const commandments = t('positionnement.commandments.items', { returnObjects: true }) as [string, string][];

  const pivotCard = t(`positionnement.generalPrinciples.cards.pivotByTeamSize.${teamSize}`, { returnObjects: true }) as PrincipleCard;
  const frontCard = t('positionnement.generalPrinciples.cards.front', { returnObjects: true }) as PrincipleCard;
  const backCard = t('positionnement.generalPrinciples.cards.back', { returnObjects: true }) as PrincipleCard;
  const responsibilityCards: PrincipleCard[] = [frontCard, pivotCard, backCard];

  const tableAccents = ['var(--orange)', 'var(--teal)', 'var(--plum)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* TOP — Format & config selectors */}
      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={S.label}>{t('positionnement.selectors.title')}</div>
        <p
          style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t('positionnement.selectors.description') }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>{t('positionnement.selectors.formatLabel')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEAM_SIZES.map(slug => {
              const isActive = SLUG_TO_SIZE[slug] === teamSize;
              return (
                <Link
                  key={slug}
                  to={`/${lang}/guides/positionnement-defense/${slug}`}
                  style={{ ...(isActive ? btnActive : btnBase), textDecoration: 'none' }}
                >
                  {slug}
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>{t('positionnement.selectors.configLabel')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {configurations.map(c => (
              <Link
                key={c.id}
                to={`/${lang}/guides/positionnement-defense/${SIZE_TO_SLUG[teamSize]}/${c.id}`}
                style={{ ...(configId === c.id ? btnActive : btnBase), textDecoration: 'none' }}
              >
                {c.shortName}
              </Link>
            ))}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginTop: 4 }}>{configuration.name}</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{configuration.description}</p>
        </div>
      </section>

      {/* Principe de base */}
      <div style={S.card}>
        <div style={S.label}>{t('positionnement.principle.label')}</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>{t('positionnement.principle.lead')}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {principlePoints.map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Postes et zones */}
      <section>
        <h2 style={S.section}>{t('positionnement.postes.titlePrefix')} — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {t('positionnement.postes.layoutCaptionPrefix')} {configuration.name}
          </div>
          <Court
            view="our-side"
            show3mLine
            withShadow={false}
            idSuffix={`guide-postes-${configuration.id}`}
            layout={{
              players: configuration.positions
                .filter(p => p.zoneId !== 'L')
                .map(p => ({
                  id: p.zoneId,
                  x: p.court.x,
                  y: p.court.y,
                  label: p.zoneId,
                  role: p.zoneId,
                  caption: p.name,
                })),
            }}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to={`/${lang}/positions/${SIZE_TO_SLUG[teamSize]}/${configuration.id}`}
              style={{
                display: 'inline-block', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em',
                color: 'var(--orange)', border: '2.5px solid var(--orange)', padding: '6px 16px',
                textDecoration: 'none',
              }}
            >
              {t('positionnement.postes.detailCta')}
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>{t('positionnement.postes.ruleLabel')} : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {t(`positionnement.postes.ruleByTeamSize.${teamSize}`)}
          </span>
        </div>
      </section>

      {/* 2. Positionnement par zone */}
      <section>
        <h2 style={S.section}>{t('positionnement.zonePositioning.title')}</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {t(`positionnement.zonePositioning.tabLabels.${z}`)}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {t(`positionnement.zonePositioning.captionsByZone.${zone}`)}
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{t('positionnement.zonePositioning.legend.zone')}</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>{t('positionnement.zonePositioning.legend.blk')}</strong> {t('positionnement.zonePositioning.legend.blkDesc')}</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>{t('positionnement.zonePositioning.legend.off')}</strong> {t('positionnement.zonePositioning.legend.offDesc')}</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>{t('positionnement.zonePositioning.legend.def')}</strong> {t('positionnement.zonePositioning.legend.defDesc')}</span>
        </div>
      </section>

      {/* 3. Principes généraux */}
      <section>
        <h2 style={S.section}>{t('positionnement.generalPrinciples.title')}</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>{t('positionnement.generalPrinciples.responsibilityLabel')}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {responsibilityCards.map((card, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{card.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Principes universels 4/5/6 — Hebert, Liskevych, Volleyball Canada */}
        <div style={{ ...S.card, border: '2.5px solid var(--teal)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 8 }}>
            {t('positionnement.generalPrinciples.universalsCard.title')}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            {t('positionnement.generalPrinciples.universalsCard.intro')}
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {universalItems.map(([title, text], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ background: 'var(--teal)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 11, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{title} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Lire l'attaquant */}
      <section>
        <h2 style={S.section}>{t('positionnement.readingAttacker.title')}</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            {t('positionnement.readingAttacker.intro')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          {indicators.map((card, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `5px solid ${card.accentColor}` }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: card.accentColor, marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', marginBottom: 10, letterSpacing: '0.08em' }}>{card.action}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                    <span style={{ ...S.bulletOrange, color: card.accentColor }}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>{t('positionnement.readingAttacker.proTipLabel')} : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{t('positionnement.readingAttacker.proTipText')}</span>
        </div>
      </section>

      {/* 5. Quand avancer / reculer */}
      <section>
        <h2 style={S.section}>{t('positionnement.advanceRetreat.title')}</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>{t('positionnement.advanceRetreat.label')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>{t('positionnement.advanceRetreat.advance.title')}</div>
              {advanceItems.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>{t('positionnement.advanceRetreat.retreat.title')}</div>
              {retreatItems.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.5, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Erreurs courantes (conditionnel par teamSize) */}
      <section>
        <h2 style={S.section}>{t('positionnement.mistakes.titlePrefix')} {mistakesData.title}</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{mistakesData.intro}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mistakesData.mistakes.map(([label, text], i) => (
            <div key={i} style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 16, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Positionnement au service */}
      <section>
        <h2 style={S.section}>{t('positionnement.serviceTransition.title')}</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p
            style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: t('positionnement.serviceTransition.intro') }}
          />
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>{t('positionnement.serviceTransition.stepsLabel')}</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {serviceSteps.map(([step, detail], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={S.stepBadge}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{step} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Communication */}
      <section>
        <h2 style={S.section}>{t('positionnement.communication.title')}</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{t('positionnement.communication.intro')}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {commGroups.map((group, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{group.moment}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.calls.map(([call, desc], j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{call} </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.4 }}>—</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}> {desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>{t('positionnement.communication.ruleLabel')} : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{t('positionnement.communication.ruleText')}</span>
        </div>
      </section>

      {/* 9. Systèmes défensifs (conditionnel par teamSize) */}
      <section>
        <h2 style={S.section}>{t('positionnement.defenseSystems.titlePrefix')} {defenseData.title}</h2>

        {defenseData.warning && (
          <div style={{ ...S.alert, marginBottom: 14 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink)', marginBottom: 6 }}>{defenseData.warning.label}</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>{defenseData.warning.text}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {defenseData.systems.map((sys, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `5px solid ${sys.accent}` }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: sys.accent, marginBottom: 4 }}>{sys.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.55, marginBottom: 8 }}>{sys.tag}</div>
              <p style={{ fontSize: 12, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0', lineHeight: 1.5 }}>{sys.principe}</p>
              <div style={S.labelTeal}>{t('positionnement.defenseSystems.forcesLabel')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sys.forces.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>
              <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>{t('positionnement.defenseSystems.weaknessesLabel')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sys.faiblesses.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                    <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                  </li>
                ))}
              </ul>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                {t('positionnement.defenseSystems.indicationLabel')} : <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau comparatif */}
        <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
          <div style={{ ...S.label, marginBottom: 10 }}>{t('positionnement.defenseSystems.tableLabel')}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>{t('positionnement.defenseSystems.tableHeaderCriterion')}</th>
                {defenseData.tableHeaders.map((h, i) => (
                  <th key={i} style={{ textAlign: 'center', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tableAccents[i] }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defenseData.tableRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,24,18,0.1)' }}>
                  <td style={{ padding: '5px 8px', color: 'var(--ink)', opacity: 0.85 }}>{row[0]}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{row[1]}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{row[2]}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>{defenseData.footer.strong}</strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{defenseData.footer.text}</span>
        </div>
      </section>

      {/* 10. Transitions */}
      <section>
        <h2 style={S.section}>{t('positionnement.transitions.title')}</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            {t('positionnement.transitions.intro')}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transitionGroups.map((group, gi) => (
            <div key={gi} style={S.card}>
              <div style={S.label}>{group.label}</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map(([step, detail], i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={S.stepBadge}>{i + 1}</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{step} : </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Exercices */}
      <section>
        <h2 style={S.section}>{t('positionnement.exercises.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                {t('positionnement.exercises.durationLabel')} : {ex.duration} · {t('positionnement.exercises.materialLabel')} : {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                {t('positionnement.exercises.objectiveLabel')} : <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ex.steps.map((step, j) => (
                  <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={{ color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11, flexShrink: 0, width: 16, textAlign: 'right', marginTop: 2 }}>{j + 1}.</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Récapitulatif */}
      <section>
        <h2 style={S.section}>{t('positionnement.commandments.title')}</h2>
        <div style={S.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginBottom: 16 }}>
            {commandments.map(([title, sub], i) => (
              <div key={i} style={{ border: '1.5px solid var(--ink)', padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 12, flexShrink: 0, width: 20 }}>{i + 1}.</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{title}</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ border: '2.5px solid var(--orange)', background: 'var(--yellow)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{t('positionnement.commandments.sameSide.title')}</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>{t('positionnement.commandments.sameSide.action')}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>{t('positionnement.commandments.sameSide.desc')}</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{t('positionnement.commandments.oppositeSide.title')}</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>{t('positionnement.commandments.oppositeSide.action')}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>{t('positionnement.commandments.oppositeSide.desc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Drills */}
      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.defense') })}</h2>
        <DrillList skill="defense" />
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>{t('positionnement.conclusion.label')}</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            {t('positionnement.conclusion.body1')}
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            {t('positionnement.conclusion.body2')}
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>{t('positionnement.conclusion.mantra')}</p>
        </div>
      </section>

    </div>
  );
}
