import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SCENARIOS, getScenarioById } from '../scenarios/data';
import type { PhaseKind, ScenarioRotationTag, ScenarioSystemTag, TeamSize } from '../scenarios/types';
import { Head } from '../seo/Head';
import { buildBreadcrumb, buildHowTo } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';
import { useLocalizedScenario, useLocalizedScenarios } from '../i18n/localizeScenario';

const SYSTEM_TAGS: readonly ScenarioSystemTag[] = ['5-1', '6-2', '4-2'];
const ROTATION_TAGS: readonly ScenarioRotationTag[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];

function isSystemTag(value: string | null): value is ScenarioSystemTag {
  return value !== null && (SYSTEM_TAGS as readonly string[]).includes(value);
}
function isRotationTag(value: string | null): value is ScenarioRotationTag {
  return value !== null && (ROTATION_TAGS as readonly string[]).includes(value);
}

const ScenarioPlayer = lazy(() => import('../scenarios/ScenarioPlayer'));

const PHASE_ICONS: Record<PhaseKind, string> = {
  attack: '🎯',
  defense: '🛡️',
  reception: '🤲',
};

const PHASE_COLORS: Record<PhaseKind, string> = {
  attack: 'var(--orange)',
  defense: 'var(--teal)',
  reception: 'var(--pink)',
};

export default function Scenarios() {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('scenarios');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const rawScenario = routeId ? getScenarioById(routeId) : undefined;
  const launchedScenario = useLocalizedScenario(rawScenario);
  const launched = !!launchedScenario;
  const [searchParams, setSearchParams] = useSearchParams();

  // Optional URL filters: ?system=5-1&rotation=R1 narrows the wizard's
  // scenario list to just the ones tagged with that tactical context.
  const systemFilter = isSystemTag(searchParams.get('system')) ? (searchParams.get('system') as ScenarioSystemTag) : null;
  const rotationFilter = isRotationTag(searchParams.get('rotation')) ? (searchParams.get('rotation') as ScenarioRotationTag) : null;

  const [teamSize, setTeamSize] = useState<TeamSize | null>(launchedScenario?.config.teamSize ?? (systemFilter ? 6 : null));
  const [phase, setPhase] = useState<PhaseKind | null>(launchedScenario?.config.phase ?? null);
  const [contextChoice, setContextChoice] = useState<string | null>(launchedScenario?.id ?? null);

  useEffect(() => {
    if (launchedScenario) {
      setTeamSize(launchedScenario.config.teamSize);
      setPhase(launchedScenario.config.phase);
      setContextChoice(launchedScenario.id);
    }
  }, [launchedScenario?.id]);

  const localizedScenarios = useLocalizedScenarios(SCENARIOS);

  const matchingScenarios = useMemo(() => {
    if (!teamSize || !phase) return [];
    return localizedScenarios.filter(s => {
      if (s.config.teamSize !== teamSize) return false;
      if (s.config.phase !== phase) return false;
      if (systemFilter && s.config.system !== systemFilter) return false;
      if (rotationFilter && s.config.rotation !== rotationFilter) return false;
      return true;
    });
  }, [teamSize, phase, localizedScenarios, systemFilter, rotationFilter]);

  const clearTacticalFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('system');
    next.delete('rotation');
    setSearchParams(next, { replace: true });
  };

  const reset = () => {
    setTeamSize(null);
    setPhase(null);
    setContextChoice(null);
    if (launched) navigate(`/${lang}/scenarios`);
  };

  const handleLaunch = () => {
    if (contextChoice) navigate(`/${lang}/scenarios/${contextChoice}`);
  };

  const handleTeamSizeChange = (n: TeamSize) => {
    if (n === teamSize) return;
    setTeamSize(n);
    setPhase(null);
    setContextChoice(null);
  };
  const handlePhaseChange = (p: PhaseKind) => {
    if (p === phase) return;
    setPhase(p);
    setContextChoice(null);
  };
  const handleContextChange = (id: string) => {
    if (launched) {
      navigate(`/${lang}/scenarios/${id}`);
    } else {
      setContextChoice(id);
    }
  };

  const btnBase: React.CSSProperties = {
    border: '3px solid var(--ink)',
    background: 'var(--cream)',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 11,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    color: 'var(--ink)',
    transition: 'all 0.08s',
  };

  const seoTitle = launchedScenario
    ? tSeo('scenarioDetail.title', {
        title: launchedScenario.title,
        teamSize: `${launchedScenario.config.teamSize}v${launchedScenario.config.teamSize}`,
      })
    : tSeo('scenariosHub.title');
  const seoDescription = launchedScenario
    ? tSeo('scenarioDetail.description', {
        shortDescription: launchedScenario.shortDescription,
        phase: tSeo(`phase.${launchedScenario.config.phase}`),
      })
    : tSeo('scenariosHub.description');
  const seoPath = launchedScenario ? `/scenarios/${launchedScenario.id}` : '/scenarios';
  const breadcrumbCrumbs = launchedScenario
    ? [
        { name: tSeo('breadcrumbs.home'), path: '/' },
        { name: tSeo('breadcrumbs.scenarios'), path: '/scenarios' },
        { name: launchedScenario.title, path: seoPath },
      ]
    : [
        { name: tSeo('breadcrumbs.home'), path: '/' },
        { name: tSeo('breadcrumbs.scenarios'), path: '/scenarios' },
      ];
  const jsonLd: Record<string, unknown>[] = [buildBreadcrumb(breadcrumbCrumbs, lang)];
  if (launchedScenario && launchedScenario.steps.length) {
    jsonLd.push(
      buildHowTo({
        name: launchedScenario.title,
        description: launchedScenario.shortDescription,
        steps: launchedScenario.steps.map((step, idx) => ({
          name: step.title || t('player.step.defaultTitle', { index: idx + 1 }),
          text: step.description || step.title || t('player.step.defaultTitle', { index: idx + 1 }),
        })),
        lang,
      }),
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
        ogType={launchedScenario ? 'article' : 'website'}
        jsonLd={jsonLd}
      />
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('header.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('header.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7 }}>
          {t('header.subtitle')}
        </p>
      </div>

      <div
        role="status"
        style={{
          border: '3px solid var(--ink)',
          background: 'var(--yellow)',
          boxShadow: 'var(--shadow-sm)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>🚧</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.08em' }}>
            {t('construction.label')}
          </div>
          <p style={{ margin: 0, fontFamily: '"DM Mono", monospace', fontSize: 12, lineHeight: 1.5 }}>
            {t('construction.body')}
          </p>
        </div>
      </div>

      {(systemFilter || rotationFilter) && (
        <div
          role="status"
          style={{
            border: '3px solid var(--ink)',
            background: 'var(--teal)',
            color: 'var(--cream)',
            boxShadow: 'var(--shadow-sm)',
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.08em' }}>
            ★ {t('filters.tacticalKicker', { defaultValue: 'FILTRE TACTIQUE' })}
          </span>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 12 }}>
            {systemFilter && <strong>{systemFilter}</strong>}
            {systemFilter && rotationFilter && ' · '}
            {rotationFilter && <strong>{rotationFilter}</strong>}
          </span>
          <button
            type="button"
            onClick={clearTacticalFilter}
            style={{
              marginLeft: 'auto',
              border: '2px solid var(--cream)',
              background: 'transparent',
              color: 'var(--cream)',
              padding: '4px 12px',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 10,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            {t('filters.clear', { defaultValue: 'EFFACER ✕' })}
          </button>
        </div>
      )}

      {!launched && (
        <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
              {t('wizard.step1')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {([4, 5, 6] as TeamSize[]).map(n => (
                <button
                  key={n}
                  onClick={() => handleTeamSizeChange(n)}
                  style={{
                    ...btnBase,
                    padding: '16px 8px',
                    fontSize: 18,
                    ...(teamSize === n ? { background: 'var(--orange)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
                  }}
                >
                  {n}v{n}
                </button>
              ))}
            </div>
          </div>

          {teamSize !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
                {t('wizard.step2')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(['attack', 'defense', 'reception'] as PhaseKind[]).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePhaseChange(p)}
                    style={{
                      ...btnBase,
                      padding: '16px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      ...(phase === p ? { background: PHASE_COLORS[p], boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{PHASE_ICONS[p]}</span>
                    <span>{t(`phase.${p}`).toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {teamSize !== null && phase !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
                {t('wizard.step3')}
              </div>
              {matchingScenarios.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {matchingScenarios.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleContextChange(s.id)}
                      style={{
                        ...btnBase,
                        padding: '14px 16px',
                        textAlign: 'left',
                        width: '100%',
                        display: 'block',
                        ...(contextChoice === s.id
                          ? { background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' }
                          : {}),
                      }}
                    >
                      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.03em', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>{s.config.contextLabel}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ border: '3px dashed var(--ink)', padding: '16px', background: 'var(--paper)', fontFamily: '"DM Mono", monospace', fontSize: 12, opacity: 0.6 }}>
                  {t('wizard.noMatch')}
                </div>
              )}
            </div>
          )}

          {(teamSize !== null || phase !== null || contextChoice !== null) && (
            <div style={{ borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={reset}
                style={{ ...btnBase, padding: '10px 18px', fontSize: 10 }}
              >
                {t('wizard.reset')}
              </button>
              <button
                onClick={handleLaunch}
                disabled={!contextChoice}
                style={{
                  ...btnBase,
                  padding: '12px 24px',
                  background: contextChoice ? 'var(--orange)' : 'var(--paper)',
                  boxShadow: contextChoice ? 'var(--shadow)' : 'none',
                  opacity: contextChoice ? 1 : 0.4,
                  cursor: contextChoice ? 'pointer' : 'not-allowed',
                  fontSize: 13,
                }}
              >
                {t('wizard.launch')}
              </button>
            </div>
          )}
        </div>
      )}

      {launched && (
        <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>{t('compactBar.format')}</span>
            {([4, 5, 6] as TeamSize[]).map(n => (
              <button
                key={n}
                onClick={() => handleTeamSizeChange(n)}
                style={{
                  ...btnBase,
                  padding: '5px 12px',
                  fontSize: 10,
                  ...(teamSize === n ? { background: 'var(--orange)', boxShadow: '2px 2px 0 var(--ink)', transform: 'translate(-1px,-1px)' } : {}),
                }}
              >
                {n}v{n}
              </button>
            ))}
            <button
              onClick={reset}
              style={{ ...btnBase, padding: '5px 12px', fontSize: 9, marginLeft: 'auto' }}
              title={t('compactBar.resetTitle')}
            >
              {t('compactBar.reset')}
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '2px dashed rgba(26,24,18,0.18)' }}>
            <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>{t('compactBar.phase')}</span>
            {(['attack', 'defense', 'reception'] as PhaseKind[]).map(p => (
              <button
                key={p}
                onClick={() => handlePhaseChange(p)}
                style={{
                  ...btnBase,
                  padding: '5px 12px',
                  fontSize: 10,
                  ...(phase === p ? { background: PHASE_COLORS[p], boxShadow: '2px 2px 0 var(--ink)', transform: 'translate(-1px,-1px)' } : {}),
                }}
              >
                <span aria-hidden="true">{PHASE_ICONS[p]}</span> {t(`phase.${p}`).toUpperCase()}
              </button>
            ))}
          </div>

          {matchingScenarios.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8, borderTop: '2px dashed rgba(26,24,18,0.18)', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>{t('compactBar.scenario')}</span>
              {matchingScenarios.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleContextChange(s.id)}
                  style={{
                    ...btnBase,
                    padding: '5px 12px',
                    fontSize: 9,
                    ...(contextChoice === s.id ? { background: 'var(--yellow)', boxShadow: '2px 2px 0 var(--ink)', transform: 'translate(-1px,-1px)' } : {}),
                  }}
                  title={s.config.contextLabel}
                >
                  {s.title.replace(/^(\d+v\d+\s*·\s*)/, '').replace(/^(Attaque|Défense|Réception|Couverture|Attack|Defense|Defence|Reception|Coverage)\s*·\s*/i, '').toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {launched && !launchedScenario && (
        <div style={{ border: '3px dashed var(--ink)', padding: '48px 20px', textAlign: 'center', background: 'var(--paper)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, opacity: 0.6, marginBottom: 8 }}>{t('placeholder.title')}</div>
          <p style={{ margin: 0, fontFamily: '"DM Mono", monospace', fontSize: 12, opacity: 0.5 }}>
            {!teamSize || !phase
              ? t('placeholder.selectFormatAndPhase')
              : matchingScenarios.length === 0
                ? t('placeholder.noScenarios')
                : t('placeholder.clickInList')}
          </p>
        </div>
      )}

      {launched && launchedScenario && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 24, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>
              {launchedScenario.title}
            </h2>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>{launchedScenario.shortDescription}</p>
          </div>
          <Suspense
            fallback={
              <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.1em', opacity: 0.5 }}>{t('player.loading')}</span>
              </div>
            }
          >
            <ScenarioPlayer key={launchedScenario.id} scenario={launchedScenario} hideHeader />
          </Suspense>
        </div>
      )}
    </div>
  );
}
