import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentLang } from '../i18n/paths';
import { SYSTEMS } from '../systems/data';
import type { SystemId } from '../systems/types';
import { useDiscipline } from '../discipline/useDiscipline';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';

// Groups of systems, displayed as sections on the hub. The list is filtered
// at render time based on the active discipline (indoor / beach).
type Group = {
  key: string;        // translation key suffix under systems.group.*
  ids: SystemId[];
  discipline: 'indoor' | 'beach';
};

const GROUPS: Group[] = [
  { key: '6v6', ids: ['5-1', '6-2', '4-2'], discipline: 'indoor' },
  { key: '5v5', ids: ['5v5-5-1', '5v5-4-2'], discipline: 'indoor' },
  { key: '4v4', ids: ['4v4-diamant', '4v4-box', '4v4-ligne'], discipline: 'indoor' },
  { key: 'beach', ids: ['beach-classic'], discipline: 'beach' },
];

export default function Systems() {
  const { t } = useTranslation('common');
  const lang = useCurrentLang();
  const discipline = useDiscipline();
  const visibleGroups = GROUPS.filter(g => g.discipline === discipline);
  const hubPath = discipline === 'beach' ? '/beach/systems' : '/systems';
  const titleKey = discipline === 'beach' ? 'systems.hubTitleBeach' : 'systems.hubTitle';
  const descKey = discipline === 'beach' ? 'systems.hubDescriptionBeach' : 'systems.hubDescription';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Head
        title={`${t(titleKey)} — Volley-Wiki`}
        description={t(descKey)}
        path={hubPath}
        jsonLd={buildBreadcrumb(
          [
            { name: t('nav.home'), path: '/' },
            { name: t('nav.systems'), path: hubPath },
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
          {t(titleKey)}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 720 }}>
          {t(descKey)}
        </p>
      </header>

      {visibleGroups.map(group => (
        <section key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 20,
              letterSpacing: '0.04em',
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            {t(`systems.group.${group.key}`)}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {group.ids.map(id => (
              <SystemCard key={id} id={id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SystemCard({ id }: { id: SystemId }) {
  const { t } = useTranslation('common');
  const lang = useCurrentLang();
  const system = SYSTEMS[id];
  const isAvailable = !!system;
  const subPath = system?.discipline === 'beach' ? 'beach/systems' : 'systems';

  // Card "title number" on the left — for short slugs we show the slug as
  // a big retro number. For longer slugs (5v5-*, 4v4-*), show just the
  // last part to keep it compact.
  const heading = id.includes('-') && id.length > 5 ? id.split('-').slice(1).join('-') : id;

  const content = (
    <>
      <div
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 26,
          letterSpacing: '0.04em',
          color: 'var(--orange)',
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        {heading}
      </div>
      <div
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 14,
          letterSpacing: '0.04em',
          marginTop: 8,
        }}
      >
        {system ? system.title : t(`systems.title.${id}`, id)}
      </div>
      <p
        style={{
          margin: '8px 0 0 0',
          fontSize: 13,
          lineHeight: 1.5,
          opacity: 0.8,
          minHeight: 44,
        }}
      >
        {system ? system.tagline : t('systems.comingSoon')}
      </p>
      {isAvailable && (
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'var(--orange)',
          }}
        >
          {t('actions.explore')}
        </div>
      )}
    </>
  );

  const baseStyle: React.CSSProperties = {
    display: 'block',
    border: '3px solid var(--ink)',
    background: isAvailable ? 'var(--cream)' : 'var(--paper)',
    boxShadow: isAvailable ? 'var(--shadow)' : 'none',
    padding: '20px 24px',
    textDecoration: 'none',
    color: 'var(--ink)',
    opacity: isAvailable ? 1 : 0.55,
    cursor: isAvailable ? 'pointer' : 'default',
  };

  if (!isAvailable) {
    return <div style={baseStyle}>{content}</div>;
  }

  return (
    <Link
      to={`/${lang}/${subPath}/${id}`}
      style={{
        ...baseStyle,
        transition: 'transform 0.08s, box-shadow 0.08s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '7px 7px 0 var(--ink)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
      }}
    >
      {content}
    </Link>
  );
}
