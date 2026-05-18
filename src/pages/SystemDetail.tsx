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

const ROTATION_ORDER: RotationId[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];

export default function SystemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const lang = useCurrentLang();
  const { t } = useTranslation('common');

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
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: 0 }}>
          {t(system.teamSize === 6 || system.teamSize === 5 ? 'systems.rotationsTitle' : 'systems.formationTitle')}
        </h2>
        {ROTATION_ORDER.map(rid => {
          const rotation = system.rotations[rid];
          if (!rotation) return null;
          const isSingleFormation =
            (system.teamSize !== 6 && system.teamSize !== 5);
          return (
            <RotationCard
              key={rid}
              rotation={rotation}
              hideHeader={isSingleFormation}
            />
          );
        })}
      </section>

      <div>
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
      </div>
    </div>
  );
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

function RotationCard({ rotation, hideHeader }: { rotation: Rotation; hideHeader?: boolean }) {
  const { t } = useTranslation('common');
  const [userLevel] = useUserLevel();

  const visibleDetails = rotation.details.filter(d => meetsLevel(userLevel, d.requires));

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

      <RotationDiagram rotation={rotation} />

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
    </article>
  );
}
