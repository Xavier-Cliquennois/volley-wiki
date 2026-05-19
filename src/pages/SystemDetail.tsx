import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentLang } from '../i18n/paths';
import { getSystemById } from '../systems/data';
import type { Rotation, RotationId } from '../systems/types';
import RotationDiagram from '../systems/RotationDiagram';
import LevelFilterPanel from '../components/LevelFilterPanel';
import { meetsLevel, useUserLevel } from '../userLevel/useUserLevel';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { SCENARIOS } from '../scenarios/data';
import type { ScenarioRotationTag, ScenarioSystemTag } from '../scenarios/types';

// Tactical systems whose scenarios live under /scenarios with tags. Used to
// link a rotation back to the matching scenario list.
const TAGGABLE_SYSTEMS: readonly string[] = ['5-1', '6-2', '4-2'];

// Count scenarios tagged with a specific system + rotation pair. Rotation
// is optional: callers can request the total for a system.
function countTaggedScenarios(system: ScenarioSystemTag, rotation?: ScenarioRotationTag): number {
  return SCENARIOS.filter(s => {
    if (s.config.system !== system) return false;
    if (rotation && s.config.rotation !== rotation) return false;
    return true;
  }).length;
}

const ROTATION_ORDER: RotationId[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];

export default function SystemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const lang = useCurrentLang();
  const { t } = useTranslation('common');
  const [showMovements, setShowMovements] = useState(false);

  const system = slug ? getSystemById(slug) : undefined;
  const hubPath = system?.discipline === 'beach' ? '/beach/systems' : '/systems';
  if (!system) {
    return <Navigate to={`/${lang}/systems`} replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Head
        title={`${system.title} — Volley-Wiki`}
        description={system.tagline}
        path={`${hubPath}/${system.id}`}
        jsonLd={buildBreadcrumb(
          [
            { name: t('nav.home'), path: '/' },
            { name: t('nav.systems'), path: hubPath },
            { name: system.title, path: `${hubPath}/${system.id}` },
          ],
          lang,
        )}
      />

      <header>
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--teal)',
            marginBottom: 10,
          }}
        >
          ★ {t('systems.kicker')}
        </div>
        <h1
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            margin: '0 0 10px 0',
            letterSpacing: '0.03em',
          }}
        >
          {system.title}
        </h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.8, maxWidth: 720 }}>
          {system.tagline}
        </p>
      </header>

      <LevelFilterPanel />

      <section>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: '0 0 12px 0' }}>
          {t('systems.philosophy')}
        </h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
          {system.philosophy}
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        <ProsCons title={t('systems.pros')} items={system.pros} accent="var(--teal)" />
        <ProsCons title={t('systems.cons')} items={system.cons} accent="var(--orange)" />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: 0 }}>
            {t(system.teamSize === 6 || system.teamSize === 5 ? 'systems.rotationsTitle' : 'systems.formationTitle')}
          </h2>
          <MovementsToggle value={showMovements} onChange={setShowMovements} />
        </div>
        {ROTATION_ORDER.map(rid => {
          const rotation = system.rotations[rid];
          if (!rotation) return null;
          const isSingleFormation =
            (system.teamSize !== 6 && system.teamSize !== 5);
          const systemTag = TAGGABLE_SYSTEMS.includes(system.id)
            ? (system.id as ScenarioSystemTag)
            : undefined;
          return (
            <RotationCard
              key={rid}
              rotation={rotation}
              hideHeader={isSingleFormation}
              showMovements={showMovements}
              positionsHref={systemIdToPositionsLink(system.id) ?? undefined}
              systemTag={systemTag}
            />
          );
        })}
      </section>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link
          to={`/${lang}${hubPath}`}
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            border: '3px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 12,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            color: 'var(--ink)',
            boxShadow: '3px 3px 0 var(--ink)',
          }}
        >
          ← {t('systems.backToHub')}
        </Link>
        {(() => {
          const positionsLink = systemIdToPositionsLink(system.id);
          if (!positionsLink) return null;
          return (
            <Link
              to={`/${lang}${positionsLink}`}
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                border: '3px solid var(--ink)',
                background: 'var(--paper)',
                fontFamily: '"Bungee", sans-serif',
                fontSize: 12,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                color: 'var(--ink)',
                boxShadow: '3px 3px 0 var(--ink)',
              }}
            >
              {t('actions.viewPositions')}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}

// Map a SystemId to a /positions/<size>/<config> path. Mirrors the inverse
// table in Positions.tsx — kept here so SystemDetail can offer a back-link
// to the position guide for systems with a matching layout.
function systemIdToPositionsLink(id: string): string | null {
  switch (id) {
    case '5-1':
    case '6-2':
    case '4-2':
      return `/positions/6v6/${id}`;
    case '5v5-5-1':
      return '/positions/5v5/3F-2B';
    case '5v5-4-2':
      return '/positions/5v5/2F-3B';
    case '4v4-diamant':
      return '/positions/4v4/losange';
    case '4v4-box':
      return '/positions/4v4/carre';
    case '4v4-ligne':
      return '/positions/4v4/3-1';
    default:
      return null;
  }
}

function ProsCons({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div
      style={{
        border: '2.5px solid var(--ink)',
        background: 'var(--paper)',
        padding: '14px 18px',
        boxShadow: '3px 3px 0 var(--ink)',
      }}
    >
      <div
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 12,
          letterSpacing: '0.1em',
          color: accent,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MovementsToggle({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  const { t } = useTranslation('common');
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        border: '2.5px solid var(--ink)',
        background: value ? 'var(--teal)' : 'var(--cream)',
        color: value ? 'var(--cream)' : 'var(--ink)',
        fontFamily: '"Bungee", sans-serif',
        fontSize: 11,
        letterSpacing: '0.08em',
        boxShadow: '2px 2px 0 var(--ink)',
        cursor: 'pointer',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          border: '2px solid currentColor',
          background: value ? 'currentColor' : 'transparent',
        }}
      />
      {t('systems.toggleMovements')}
    </button>
  );
}

function RotationCard({
  rotation,
  hideHeader,
  showMovements,
  positionsHref,
  systemTag,
}: {
  rotation: Rotation;
  hideHeader?: boolean;
  showMovements: boolean;
  positionsHref?: string;
  systemTag?: ScenarioSystemTag;
}) {
  const { t } = useTranslation('common');
  const lang = useCurrentLang();
  const [userLevel] = useUserLevel();

  const visibleDetails = rotation.details.filter(d => meetsLevel(userLevel, d.requires));

  const scenarioCount = systemTag
    ? countTaggedScenarios(systemTag, rotation.id as ScenarioRotationTag)
    : 0;
  const scenariosHref = systemTag
    ? `/${lang}/scenarios?system=${systemTag}&rotation=${rotation.id}`
    : null;

  return (
    <article
      style={{
        border: '3px solid var(--ink)',
        background: 'var(--cream)',
        boxShadow: 'var(--shadow)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {!hideHeader && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h3
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 18,
              margin: 0,
              letterSpacing: '0.04em',
            }}
          >
            {t(`systems.rotationLabel`, { id: rotation.id })}
          </h3>
          <span
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              padding: '3px 10px',
              border: '2px solid var(--ink)',
              background: rotation.setterAt === 'front' ? 'var(--teal)' : 'var(--orange)',
              color: rotation.setterAt === 'front' ? 'var(--cream)' : 'var(--ink)',
            }}
          >
            {t(`systems.setterAt.${rotation.setterAt}`)}
          </span>
        </header>
      )}

      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
        {rotation.summary}
      </p>

      <RotationDiagram rotation={rotation} showMovements={showMovements} positionsHref={positionsHref} />

      {visibleDetails.length > 0 && (
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visibleDetails.map(detail => (
            <div
              key={detail.id}
              style={{
                borderLeft: '4px solid var(--teal)',
                paddingLeft: 14,
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              <div
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  marginBottom: 4,
                }}
              >
                {t(`userLevel.${detail.requires}`)}
              </div>
              {detail.body}
            </div>
          ))}
        </div>
      )}

      {scenariosHref && scenarioCount > 0 && (
        <Link
          to={scenariosHref}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            border: '2.5px solid var(--ink)',
            background: 'var(--yellow)',
            color: 'var(--ink)',
            textDecoration: 'none',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.06em',
            boxShadow: '2px 2px 0 var(--ink)',
          }}
        >
          {t('systems.viewScenarios', { count: scenarioCount })}
        </Link>
      )}
    </article>
  );
}
