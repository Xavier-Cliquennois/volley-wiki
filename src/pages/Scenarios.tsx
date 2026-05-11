import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SCENARIOS, getScenarioById } from '../scenarios/data';
import type { PhaseKind, TeamSize } from '../scenarios/types';

const ScenarioPlayer = lazy(() => import('../scenarios/ScenarioPlayer'));

const PHASE_LABELS: Record<PhaseKind, string> = {
  attack: 'Attaque',
  defense: 'Défense',
  reception: 'Réception',
};

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
  const [searchParams, setSearchParams] = useSearchParams();

  const initialId = searchParams.get('id');
  const initialScenario = initialId ? getScenarioById(initialId) : undefined;

  const [teamSize, setTeamSize] = useState<TeamSize | null>(initialScenario?.config.teamSize ?? null);
  const [phase, setPhase] = useState<PhaseKind | null>(initialScenario?.config.phase ?? null);
  const [contextChoice, setContextChoice] = useState<string | null>(initialScenario?.id ?? null);
  const [launched, setLaunched] = useState(!!initialScenario);

  const lastSyncedId = useRef<string | null>(initialId ?? null);
  useEffect(() => {
    const targetId = launched && contextChoice ? contextChoice : null;
    if (targetId === lastSyncedId.current) return;
    lastSyncedId.current = targetId;
    if (targetId) {
      setSearchParams({ id: targetId }, { replace: true });
    } else if (searchParams.has('id')) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launched, contextChoice]);

  const matchingScenarios = useMemo(() => {
    if (!teamSize || !phase) return [];
    return SCENARIOS.filter(s => s.config.teamSize === teamSize && s.config.phase === phase);
  }, [teamSize, phase]);

  const launchedScenario = launched && contextChoice ? getScenarioById(contextChoice) : undefined;

  const reset = () => {
    setTeamSize(null);
    setPhase(null);
    setContextChoice(null);
    setLaunched(false);
  };

  const handleLaunch = () => {
    if (contextChoice) setLaunched(true);
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
    setContextChoice(id);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ TACTIQUE
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          SCÉNARIOS DE JEU
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7 }}>
          Visualisez des situations concrètes en 3D avec narration étape par étape.
        </p>
      </div>

      {/* Wizard — full */}
      {!launched && (
        <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 24 }}>
          {/* Step 1: team size */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
              1 · COMBIEN DE JOUEURS PAR ÉQUIPE ?
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

          {/* Step 2: phase */}
          {teamSize !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
                2 · QUELLE PHASE DE JEU ?
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
                    <span>{PHASE_LABELS[p].toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: context */}
          {teamSize !== null && phase !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>
                3 · QUEL CONTEXTE PRÉCIS ?
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
                  Aucun scénario disponible pour cette combinaison pour l'instant.
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {(teamSize !== null || phase !== null || contextChoice !== null) && (
            <div style={{ borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={reset}
                style={{ ...btnBase, padding: '10px 18px', fontSize: 10 }}
              >
                RÉINITIALISER
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
                LANCER LE SCÉNARIO →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compact bar — shown once launched */}
      {launched && (
        <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Row 1 — Format + Réinitialiser */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>FORMAT</span>
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
              title="Tout réinitialiser"
            >
              RÉINITIALISER
            </button>
          </div>

          {/* Row 2 — Phase */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '2px dashed rgba(26,24,18,0.18)' }}>
            <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>PHASE</span>
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
                <span aria-hidden="true">{PHASE_ICONS[p]}</span> {PHASE_LABELS[p].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Row 3 — Scénario picker */}
          {matchingScenarios.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8, borderTop: '2px dashed rgba(26,24,18,0.18)', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, marginRight: 4 }}>SCÉNARIO</span>
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
                  {s.title.replace(/^(\d+v\d+\s*·\s*)/, '').replace(/^(Attaque|Défense|Réception|Couverture)\s*·\s*/, '').toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Placeholder */}
      {launched && !launchedScenario && (
        <div style={{ border: '3px dashed var(--ink)', padding: '48px 20px', textAlign: 'center', background: 'var(--paper)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, opacity: 0.6, marginBottom: 8 }}>CHOISISSEZ UN SCÉNARIO</div>
          <p style={{ margin: 0, fontFamily: '"DM Mono", monospace', fontSize: 12, opacity: 0.5 }}>
            {!teamSize || !phase
              ? 'Sélectionnez un format et une phase au-dessus.'
              : matchingScenarios.length === 0
                ? 'Aucun scénario disponible pour cette combinaison.'
                : 'Cliquez sur un scénario dans la liste au-dessus.'}
          </p>
        </div>
      )}

      {/* Player */}
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
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.1em', opacity: 0.5 }}>CHARGEMENT…</span>
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
