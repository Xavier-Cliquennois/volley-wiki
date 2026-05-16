import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';
import TechniqueList from '../techniques/TechniqueList';
import { TECHNIQUES_INDOOR, CATEGORY_TAGS_INDOOR } from '../techniques/data';

export default function Techniques() {
  const { t } = useTranslation('techniques');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <Head
        title={tSeo('techniques.title')}
        description={tSeo('techniques.description')}
        path="/techniques"
        jsonLd={buildBreadcrumb(
          [
            { name: tSeo('breadcrumbs.home'), path: '/' },
            { name: tSeo('breadcrumbs.techniques'), path: '/techniques' },
          ],
          lang,
        )}
      />
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('header.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('header.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          {t('header.subtitle')}
        </p>
      </div>

      <TechniqueList items={TECHNIQUES_INDOOR} categoryTags={CATEGORY_TAGS_INDOOR} namespace="techniques" />
    </div>
  );
}
