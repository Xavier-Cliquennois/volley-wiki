import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { ROLE_COLORS } from '../constants/positions';
import { Court, type CourtLayout } from '../components/court';
import { Head } from '../seo/Head';
import { DEFAULT_POSITION_CONFIG, TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

const SLUG_TO_SIZE: Record<TeamSizeSlug, 4 | 5 | 6> = { '4v4': 4, '5v5': 5, '6v6': 6 };

type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';
type TeamSize = 4 | 5 | 6;

type CourtPos = { x: number; y: number };

const POS_6v6_GRID: Record<ZoneId, CourtPos> = {
  P4: { x: 20, y: 22 },
  P3: { x: 50, y: 22 },
  P2: { x: 80, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
  P1: { x: 80, y: 75 },
  L:  { x: 50, y: 92 },
};

const NUMBER_BY_ZONE: Record<ZoneId, string> = {
  P4: '④', P3: '③', P2: '②', P5: '⑤', P6: '⑥', P1: '①', L: 'L',
};

// Per-configuration layout: which zones appear in the configuration + court
// positions. The textual content (name/role/description/skills/traits) is
// resolved from i18n.
type ConfigLayoutEntry = { zoneId: ZoneId; court: CourtPos };
type ConfigLayout = {
  id: string;
  hasLibero: boolean;
  positions: ConfigLayoutEntry[];
};

const CONFIG_LAYOUTS: Record<TeamSize, ConfigLayout[]> = {
  6: [
    {
      id: '5-1',
      hasLibero: true,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
        { zoneId: 'L',  court: POS_6v6_GRID.L  },
      ],
    },
    {
      id: '4-2',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
      ],
    },
    {
      id: '6-2',
      hasLibero: true,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
        { zoneId: 'L',  court: POS_6v6_GRID.L  },
      ],
    },
  ],
  5: [
    {
      id: 'pentagon',
      hasLibero: false,
      positions: [
        { zoneId: 'P3', court: { x: 50, y: 18 } },
        { zoneId: 'P4', court: { x: 20, y: 42 } },
        { zoneId: 'P2', court: { x: 80, y: 42 } },
        { zoneId: 'P5', court: { x: 25, y: 78 } },
        { zoneId: 'P1', court: { x: 75, y: 78 } },
      ],
    },
    {
      id: '3F-2B',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 20, y: 22 } },
        { zoneId: 'P3', court: { x: 50, y: 22 } },
        { zoneId: 'P2', court: { x: 80, y: 22 } },
        { zoneId: 'P5', court: { x: 25, y: 75 } },
        { zoneId: 'P1', court: { x: 75, y: 75 } },
      ],
    },
    {
      id: '2F-3B',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 25, y: 22 } },
        { zoneId: 'P3', court: { x: 75, y: 22 } },
        { zoneId: 'P5', court: { x: 15, y: 75 } },
        { zoneId: 'P6', court: { x: 50, y: 75 } },
        { zoneId: 'P1', court: { x: 85, y: 75 } },
      ],
    },
  ],
  4: [
    {
      id: 'losange',
      hasLibero: false,
      positions: [
        { zoneId: 'P3', court: { x: 50, y: 18 } },
        { zoneId: 'P4', court: { x: 20, y: 48 } },
        { zoneId: 'P2', court: { x: 80, y: 48 } },
        { zoneId: 'P1', court: { x: 50, y: 80 } },
      ],
    },
    {
      id: 'carre',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 25, y: 22 } },
        { zoneId: 'P2', court: { x: 75, y: 22 } },
        { zoneId: 'P5', court: { x: 25, y: 75 } },
        { zoneId: 'P1', court: { x: 75, y: 75 } },
      ],
    },
    {
      id: '3-1',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 20, y: 22 } },
        { zoneId: 'P3', court: { x: 50, y: 22 } },
        { zoneId: 'P2', court: { x: 80, y: 22 } },
        { zoneId: 'P1', court: { x: 50, y: 78 } },
      ],
    },
  ],
};

// Legacy export: the CONFIGURATIONS shape consumed by GuideDefenseSized only
// reads `.id`, `.name`, `.shortName`, `.positions`. The labels here are
// resolved from i18n at the call site, but keeping the structured export
// lets the existing imports compile without changes.
type Configuration = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  hasLibero: boolean;
  positions: { zoneId: ZoneId; number: string; name: string; role: string; description: string; skills: string[]; traits: string[]; court: CourtPos }[];
};

const LIBERO_HIGHLIGHTED_ZONES: ZoneId[] = ['P1', 'P5', 'P6'];

function CourtField({
  layout,
  selectedId,
  onToggle,
  positionLabels,
}: {
  layout: ConfigLayout;
  selectedId: ZoneId | null;
  onToggle: (id: ZoneId) => void;
  positionLabels: Record<string, { name: string; short: string }>;
}) {
  const isActive = (id: ZoneId): boolean => {
    if (!selectedId) return false;
    if (selectedId === 'L') return LIBERO_HIGHLIGHTED_ZONES.includes(id);
    return selectedId === id;
  };

  const courtLayout: CourtLayout = {
    players: layout.positions.map(pos => ({
      id: pos.zoneId,
      x: pos.court.x,
      y: pos.court.y,
      label: pos.zoneId,
      role: pos.zoneId,
      caption: positionLabels[pos.zoneId]?.short ?? '',
      active: isActive(pos.zoneId),
      onClick: () => onToggle(pos.zoneId),
      title: positionLabels[pos.zoneId]?.name ?? '',
    })),
  };

  return (
    <Court
      layout={courtLayout}
      view="our-side"
      show3mLine
      withShadow={false}
      idSuffix={`positions-${layout.id}`}
    />
  );
}

export default function Positions() {
  const { size: sizeParam, config: configParam } = useParams<{ size: string; config: string }>();
  const { t } = useTranslation('positions');
  const { t: tSeo } = useTranslation('seo');
  const { t: tCommon } = useTranslation('common');
  const lang = useCurrentLang();

  const isValidSize = !!sizeParam && (TEAM_SIZES as readonly string[]).includes(sizeParam);
  const sizeSlug = (isValidSize ? sizeParam : '6v6') as TeamSizeSlug;
  const teamSize: TeamSize = SLUG_TO_SIZE[sizeSlug];
  const layouts = CONFIG_LAYOUTS[teamSize];

  const configIsValid = !!configParam && layouts.some(c => c.id === configParam);
  const configId = configIsValid ? configParam! : DEFAULT_POSITION_CONFIG[sizeSlug];

  const [selectedId, setSelectedId] = useState<ZoneId | null>(null);

  const layout = useMemo(
    () => layouts.find(c => c.id === configId) ?? layouts[0],
    [layouts, configId]
  );

  // Resolve textual content from i18n for the current configuration.
  const configName = t(`configurations.${configId}.name`);
  const configShort = t(`configurations.${configId}.shortName`);
  const configDescription = t(`configurations.${configId}.description`);

  // Position labels (short caption for the court + full name for tooltips).
  const positionLabels = useMemo(() => {
    const out: Record<string, { name: string; short: string }> = {};
    for (const pos of layout.positions) {
      // Try config-specific name first, then fall back to commonZones.
      const configKey = `configurations.${configId}.positions.${pos.zoneId}.name`;
      const commonKey = `commonZones.${pos.zoneId}.name`;
      const fullName =
        (t(configKey) !== configKey ? t(configKey) : t(commonKey)) || '';
      const short = fullName.split(' ')[0];
      out[pos.zoneId] = { name: fullName, short };
    }
    if (layout.hasLibero && !layout.positions.some(p => p.zoneId === 'L')) {
      out['L'] = { name: t('commonZones.L.name'), short: 'L' };
    }
    return out;
  }, [layout, configId, t]);

  const positions = useMemo(() => {
    const list = [...layout.positions];
    if (layout.hasLibero && !list.some(p => p.zoneId === 'L')) {
      list.push({ zoneId: 'L', court: POS_6v6_GRID.L });
    }
    return list;
  }, [layout]);

  const visiblePositions = selectedId
    ? positions.filter(p => p.zoneId === selectedId)
    : positions;

  const toggle = (id: ZoneId) => setSelectedId(prev => (prev === id ? null : id));

  if (!isValidSize) {
    return <Navigate to={`/${lang}/positions`} replace />;
  }
  if (configParam && !configIsValid) {
    return <Navigate to={`/${lang}/positions/${sizeSlug}/${DEFAULT_POSITION_CONFIG[sizeSlug]}`} replace />;
  }

  const btnBase: React.CSSProperties = {
    padding: '7px 16px',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 11,
    letterSpacing: '0.06em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)',
    color: 'var(--ink)',
    cursor: 'pointer',
    transition: 'all 0.08s',
  };

  const teamSizeLabel = tCommon(`teamSize.${sizeSlug}`);
  const seoTitle = tSeo('positions.title', { size: sizeSlug, config: configShort });
  const seoDescription = tSeo('positions.description', {
    size: sizeSlug,
    label: teamSizeLabel,
    configName,
    descriptionExcerpt: configDescription.slice(0, 100),
  });
  const canonicalPath = `/positions/${sizeSlug}/${configId}`;
  const articleHeadline = tSeo('positions.articleHeadline', { size: sizeSlug, config: configShort });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={seoTitle}
        description={seoDescription}
        path={canonicalPath}
        ogType="article"
        jsonLd={[
          buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.positions'), path: '/positions' },
              { name: sizeSlug.toUpperCase(), path: `/positions/${sizeSlug}` },
              { name: configShort, path: canonicalPath },
            ],
            lang,
          ),
          buildArticle({
            headline: articleHeadline,
            description: seoDescription,
            path: canonicalPath,
            lang,
          }),
        ]}
      />

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('page.kickerPrefix')} {sizeSlug.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('page.titlePrefix')} {sizeSlug.toUpperCase()}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          {t('page.subtitle', { label: teamSizeLabel })}
        </p>
      </div>

      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 12 }}>
          {t('page.step1')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {TEAM_SIZES.map(slug => {
            const active = slug === sizeSlug;
            return (
              <Link
                key={slug}
                to={`/${lang}/positions/${slug}`}
                style={{
                  ...btnBase,
                  fontSize: 16,
                  padding: '10px 24px',
                  textDecoration: 'none',
                  ...(active ? { background: 'var(--orange)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
                }}
              >
                {slug}
              </Link>
            );
          })}
        </div>
        <div style={{ fontSize: 14, marginBottom: 6 }}>{t(`teamIntros.${teamSize}.tagline`)}</div>
        <div style={{ borderLeft: '4px solid var(--teal)', paddingLeft: 12, fontSize: 13, opacity: 0.7 }}>
          {t(`teamIntros.${teamSize}.rules`)}
        </div>
      </div>

      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 12 }}>
          {t('page.step2')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {layouts.map(c => {
            const active = configId === c.id;
            const short = t(`configurations.${c.id}.shortName`);
            return (
              <Link
                key={c.id}
                to={`/${lang}/positions/${sizeSlug}/${c.id}`}
                onClick={() => setSelectedId(null)}
                style={{
                  ...btnBase,
                  textDecoration: 'none',
                  ...(active ? { background: 'var(--teal)', color: 'var(--cream)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
                }}
              >
                {short}
              </Link>
            );
          })}
        </div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, marginBottom: 8 }}>{configName}</div>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{configDescription}</p>
      </div>

      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', opacity: 0.6 }}>
            {t('page.courtTitle')} {configName.toUpperCase()}
          </div>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              style={{ ...btnBase, fontSize: 9, padding: '5px 12px' }}
            >
              {t('page.showAll')}
            </button>
          )}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 8 }}>
              ← {tCommon('court.net')} →
            </div>
            <CourtField layout={layout} selectedId={selectedId} onToggle={toggle} positionLabels={positionLabels} />
            <div style={{ width: '100%', maxWidth: 420, marginTop: 8, textAlign: 'center' }}>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.18em', opacity: 0.55 }}>{tCommon('court.backOfCourt')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', padding: '12px 14px' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', marginBottom: 10 }}>{t('page.legendTitle')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                {(t('page.legendItems', { returnObjects: true }) as string[]).map((html, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
                <li style={{ opacity: 0.6, fontSize: 11 }}>{t('page.legendHint')}</li>
              </ul>
            </div>
            {layout.hasLibero ? (
              <button
                onClick={() => toggle('L')}
                style={{
                  ...btnBase,
                  padding: '12px 14px',
                  textAlign: 'left',
                  display: 'block',
                  width: '100%',
                  ...(selectedId === 'L' ? { background: ROLE_COLORS.L, color: '#fff' } : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2.5px solid var(--ink)`, background: ROLE_COLORS.L,
                    fontFamily: '"Bungee", sans-serif', fontSize: 10, color: '#fff',
                  }}>L</span>
                  <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>{t('page.liberoLabel')}</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.65 }}>{t('page.liberoCardDescription')}</p>
              </button>
            ) : (
              <div
                style={{ border: '3px solid var(--ink)', background: 'var(--paper)', padding: '12px 14px', fontSize: 12, opacity: 0.7 }}
                dangerouslySetInnerHTML={{ __html: t('page.noLibero') }}
              />
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
          <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>{t('page.cardsTitle')}</span>
          <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        </div>

        {visiblePositions.map(pos => {
          const roleColor = ROLE_COLORS[pos.zoneId];
          const configKey = `configurations.${configId}.positions.${pos.zoneId}`;
          const positionName = positionLabels[pos.zoneId]?.name ?? '';
          const role = t(`${configKey}.role`);
          const description = t(`${configKey}.description`);
          const skills = (t(`${configKey}.skills`, { returnObjects: true }) as string[]) ?? [];
          const traits = (t(`${configKey}.traits`, { returnObjects: true }) as string[]) ?? [];
          return (
            <div key={pos.zoneId} style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', overflow: 'hidden' }}>
              <div style={{
                padding: '16px 22px',
                borderBottom: '3px solid var(--ink)',
                borderLeft: `6px solid ${roleColor}`,
                background: 'var(--paper)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <span style={{
                  width: 52, height: 52, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Bungee", sans-serif', fontSize: 15,
                  background: roleColor,
                  border: '3px solid var(--ink)',
                  borderRadius: '50%',
                  color: pos.zoneId === 'P5' ? '#1a1812' : '#fff',
                  boxShadow: '3px 3px 0 var(--ink)',
                }}>
                  {pos.zoneId}
                </span>
                <div>
                  <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, margin: '0 0 4px 0', letterSpacing: '0.03em' }}>{positionName}</h2>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6 }}>{role}</div>
                </div>
              </div>
              <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>{t('page.skillsTitle')}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {skills.map(s => (
                        <span key={s} style={{
                          padding: '3px 10px',
                          border: '2px solid var(--ink)',
                          background: 'var(--paper)',
                          fontFamily: '"DM Mono", monospace',
                          fontSize: 11,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 }}>{t('page.traitsTitle')}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {traits.map(tr => (
                        <li key={tr} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                          <span style={{ fontFamily: '"Bungee", sans-serif', color: roleColor, flexShrink: 0 }}>▸</span>
                          {tr}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('page.crossLink.kicker')}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          <Trans
            i18nKey="page.crossLink.html"
            t={t}
            components={{
              link: (
                <Link
                  to={`/${lang}/guides/positionnement-defense/${sizeSlug}/${layout.id}`}
                  style={{ color: 'var(--orange)', fontWeight: 700 }}
                />
              ),
            }}
          />
        </p>
      </div>
    </div>
  );
}

// Re-export shape consumed by GuideDefenseSized — it only reads `.id` and uses
// `.shortName`/`.name` from the resolved object. We build a lightweight
// shim that mirrors the legacy shape using a fake `t` (caller may inject the
// real translations).
function makeConfiguration(layout: ConfigLayout, getText: (key: string) => string): Configuration {
  // i18next returns the raw key when a translation is missing, so falsy-coalescing
  // with `||` never triggers a fallback. Use an explicit "did it resolve?" check.
  const resolve = (key: string): string => {
    const value = getText(key);
    return value !== key ? value : '';
  };
  const positions = layout.positions.map(p => ({
    zoneId: p.zoneId,
    number: NUMBER_BY_ZONE[p.zoneId],
    name: resolve(`configurations.${layout.id}.positions.${p.zoneId}.name`) || resolve(`commonZones.${p.zoneId}.name`),
    role: resolve(`configurations.${layout.id}.positions.${p.zoneId}.role`),
    description: resolve(`configurations.${layout.id}.positions.${p.zoneId}.description`),
    skills: [] as string[],
    traits: [] as string[],
    court: p.court,
  }));
  return {
    id: layout.id,
    name: resolve(`configurations.${layout.id}.name`),
    shortName: resolve(`configurations.${layout.id}.shortName`),
    description: resolve(`configurations.${layout.id}.description`),
    hasLibero: layout.hasLibero,
    positions,
  };
}

// Hook-based access for callers that need the resolved configuration shape.
export function useConfigurations(): Record<TeamSize, Configuration[]> {
  const { t } = useTranslation('positions');
  return useMemo(() => ({
    6: CONFIG_LAYOUTS[6].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
    5: CONFIG_LAYOUTS[5].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
    4: CONFIG_LAYOUTS[4].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
  }), [t]);
}

// Language-aware legacy export. The default i18n singleton's language is
// synchronised with the active route by LanguageGate, so each CONFIGURATIONS[..]
// access resolves config names in the current language.
import i18nDefault from '../i18n';
function buildConfigurations(): Record<TeamSize, Configuration[]> {
  const tr = (k: string) => i18nDefault.t(k, { ns: 'positions' });
  return {
    6: CONFIG_LAYOUTS[6].map(l => makeConfiguration(l, tr)),
    5: CONFIG_LAYOUTS[5].map(l => makeConfiguration(l, tr)),
    4: CONFIG_LAYOUTS[4].map(l => makeConfiguration(l, tr)),
  };
}
export const CONFIGURATIONS = new Proxy({} as Record<TeamSize, Configuration[]>, {
  get(_target, prop) {
    const fresh = buildConfigurations();
    return fresh[Number(prop) as TeamSize];
  },
}) as Record<TeamSize, Configuration[]>;
export type { TeamSize, Configuration };
