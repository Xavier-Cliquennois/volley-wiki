import { Suspense, lazy, useMemo, useState } from 'react';
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

export default function Scenarios() {
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [phase, setPhase] = useState<PhaseKind | null>(null);
  const [contextChoice, setContextChoice] = useState<string | null>(null);
  // When true, the filter section collapses into a compact bar and the
  // selected scenario plays inline below.
  const [launched, setLaunched] = useState(false);

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

  // When the user changes a filter while a scenario is playing, we stay in
  // "launched" mode and let them pick again from the compact bar — no need
  // to walk back through the wizard.
  const handleTeamSizeChange = (n: TeamSize) => {
    if (n === teamSize) return;
    setTeamSize(n);
    setPhase(null);
    setContextChoice(null);
    // Drop out of launched mode only if the wizard hasn't been launched yet.
  };
  const handlePhaseChange = (p: PhaseKind) => {
    if (p === phase) return;
    setPhase(p);
    setContextChoice(null);
  };
  const handleContextChange = (id: string) => {
    setContextChoice(id);
    // If launched=true, re-render with the new id swaps the player automatically.
    // If launched=false, the user still needs to click "Lancer".
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Tactique</div>
        <h1 className="text-4xl font-bold text-white mb-3">Scénarios de jeu</h1>
        <p className="text-gray-400">
          Visualisez des situations concrètes en 3D avec narration étape par étape.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────── */}
      {/* Filter section — full when not launched, compact when launched */}
      {/* ────────────────────────────────────────────────────── */}
      {!launched && (
        <div className="border-2 border-gray-700 p-6 space-y-6">
          {/* Step 1: team size */}
          <div className="space-y-3">
            <div className="text-white text-sm font-bold uppercase tracking-wider">
              1 · Combien de joueurs par équipe ?
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([4, 5, 6] as TeamSize[]).map(n => (
                <button
                  key={n}
                  onClick={() => handleTeamSizeChange(n)}
                  className={`px-4 py-4 border-2 uppercase tracking-wider text-sm font-bold transition-colors ${
                    teamSize === n
                      ? 'border-yellow-400 bg-yellow-400 text-black'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {n}v{n}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: phase */}
          {teamSize !== null && (
            <div className="space-y-3 border-t-2 border-gray-800 pt-6">
              <div className="text-white text-sm font-bold uppercase tracking-wider">
                2 · Quelle phase de jeu ?
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['attack', 'defense', 'reception'] as PhaseKind[]).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePhaseChange(p)}
                    className={`px-3 py-4 border-2 uppercase tracking-wider text-xs font-bold transition-colors ${
                      phase === p
                        ? 'border-yellow-400 bg-yellow-400 text-black'
                        : 'border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{PHASE_ICONS[p]}</div>
                    {PHASE_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: context */}
          {teamSize !== null && phase !== null && (
            <div className="space-y-3 border-t-2 border-gray-800 pt-6">
              <div className="text-white text-sm font-bold uppercase tracking-wider">
                3 · Quel contexte précis ?
              </div>
              {matchingScenarios.length > 0 ? (
                <div className="space-y-2">
                  {matchingScenarios.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleContextChange(s.id)}
                      className={`w-full text-left p-4 border-2 transition-colors ${
                        contextChoice === s.id
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-white font-bold text-sm mb-1">{s.title}</div>
                      <div className="text-gray-500 text-xs">{s.config.contextLabel}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-gray-800 p-4 text-gray-500 text-sm">
                  Aucun scénario disponible pour cette combinaison pour l'instant.
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {(teamSize !== null || phase !== null || contextChoice !== null) && (
            <div className="border-t-2 border-gray-800 pt-6 flex flex-wrap gap-2 justify-between items-center">
              <button
                onClick={reset}
                className="px-4 py-2 text-xs uppercase tracking-wider border-2 border-gray-700 text-gray-400 hover:border-gray-500"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleLaunch}
                disabled={!contextChoice}
                className="px-6 py-3 text-xs uppercase tracking-wider border-2 border-yellow-600 bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Lancer le scénario →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────── */}
      {/* Compact filter bar — shown once the wizard has been launched */}
      {/* Each pill is still clickable to switch to another value */}
      {/* ────────────────────────────────────────────────────── */}
      {launched && (
        <div className="border-2 border-gray-700 p-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest mr-1">Format</span>
            {([4, 5, 6] as TeamSize[]).map(n => (
              <button
                key={n}
                onClick={() => handleTeamSizeChange(n)}
                className={`px-3 py-1 border-2 text-xs uppercase tracking-wider font-bold transition-colors ${
                  teamSize === n
                    ? 'border-yellow-400 bg-yellow-400 text-black'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {n}v{n}
              </button>
            ))}

            <span className="text-gray-500 text-[10px] uppercase tracking-widest ml-3 mr-1">Phase</span>
            {(['attack', 'defense', 'reception'] as PhaseKind[]).map(p => (
              <button
                key={p}
                onClick={() => handlePhaseChange(p)}
                className={`px-3 py-1 border-2 text-xs uppercase tracking-wider font-bold transition-colors ${
                  phase === p
                    ? 'border-yellow-400 bg-yellow-400 text-black'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {PHASE_ICONS[p]} {PHASE_LABELS[p]}
              </button>
            ))}

            <button
              onClick={reset}
              className="ml-auto px-3 py-1 border-2 border-gray-700 text-gray-400 text-[10px] uppercase tracking-wider hover:border-gray-500"
              title="Tout réinitialiser"
            >
              Réinitialiser
            </button>
          </div>

          {/* Scenario picker — list of scenarios in the current size+phase combo */}
          {matchingScenarios.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 mr-1">Scénario</span>
              {matchingScenarios.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleContextChange(s.id)}
                  className={`px-3 py-1 border-2 text-xs uppercase tracking-wider transition-colors ${
                    contextChoice === s.id
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 font-bold'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                  title={s.config.contextLabel}
                >
                  {s.title.replace(/^(\d+v\d+\s*·\s*)/, '').replace(/^(Attaque|Défense|Réception|Couverture)\s*·\s*/, '')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Placeholder when launched but no scenario picked (e.g. after a phase change) */}
      {launched && !launchedScenario && (
        <div className="border-2 border-dashed border-gray-700 p-12 text-center">
          <div className="text-gray-500 text-sm uppercase tracking-wider mb-2">Choisissez un scénario</div>
          <p className="text-gray-600 text-xs">
            {!teamSize || !phase
              ? 'Sélectionnez un format et une phase au-dessus pour voir les scénarios disponibles.'
              : matchingScenarios.length === 0
                ? 'Aucun scénario disponible pour cette combinaison.'
                : 'Cliquez sur un scénario dans la liste au-dessus pour le lancer.'}
          </p>
        </div>
      )}

      {/* ────────────────────────────────────────────────────── */}
      {/* Inline scenario player */}
      {/* ────────────────────────────────────────────────────── */}
      {launched && launchedScenario && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{launchedScenario.title}</h2>
            <p className="text-gray-400 text-sm">{launchedScenario.shortDescription}</p>
          </div>
          <Suspense
            fallback={
              <div className="border-2 border-gray-700 bg-gray-900 h-96 flex items-center justify-center">
                <span className="text-gray-500 text-sm uppercase tracking-wider">Chargement du scénario…</span>
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
