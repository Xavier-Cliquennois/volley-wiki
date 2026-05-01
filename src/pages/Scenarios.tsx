import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SCENARIOS } from '../scenarios/data';
import type { PhaseKind, TeamSize } from '../scenarios/types';

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
  const navigate = useNavigate();
  const [showCustom, setShowCustom] = useState(false);

  // Custom form state
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [phase, setPhase] = useState<PhaseKind | null>(null);
  const [contextChoice, setContextChoice] = useState<string | null>(null);

  // Filter scenarios that match the chosen team size + phase to suggest as the "context" choices
  const matchingScenarios = useMemo(() => {
    if (!teamSize || !phase) return [];
    return SCENARIOS.filter(s => s.config.teamSize === teamSize && s.config.phase === phase);
  }, [teamSize, phase]);

  const resetCustom = () => {
    setTeamSize(null);
    setPhase(null);
    setContextChoice(null);
  };

  const handleLaunch = () => {
    if (contextChoice) navigate(`/scenarios/${contextChoice}`);
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Tactique</div>
        <h1 className="text-4xl font-bold text-white mb-3">Scénarios de jeu</h1>
        <p className="text-gray-400">
          Visualisez des situations concrètes en 3D avec narration étape par étape.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowCustom(false)}
          className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
            !showCustom
              ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
              : 'border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          Galerie
        </button>
        <button
          onClick={() => setShowCustom(true)}
          className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
            showCustom
              ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
              : 'border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          Choix guidé →
        </button>
      </div>

      {!showCustom ? (
        // Gallery
        <div className="grid sm:grid-cols-2 gap-4">
          {SCENARIOS.map(s => (
            <Link
              key={s.id}
              to={`/scenarios/${s.id}`}
              className="border-2 border-gray-700 hover:border-yellow-400 p-6 transition-colors group flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl flex-shrink-0">{PHASE_ICONS[s.config.phase]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-xs uppercase tracking-widest">
                      {s.config.teamSize}v{s.config.teamSize}
                    </span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">
                      {PHASE_LABELS[s.config.phase]}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">
                    {s.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm flex-1">{s.shortDescription}</p>
              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-600 text-xs uppercase tracking-wider">{s.config.contextLabel}</span>
                <span className="text-yellow-400 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Lancer →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Custom guided form
        <div className="border-2 border-gray-700 p-6 space-y-6">
          <div className="text-yellow-400 text-xs uppercase tracking-widest">Choix guidé</div>

          {/* Step 1: team size */}
          <div className="space-y-3">
            <div className="text-white text-sm font-bold uppercase tracking-wider">
              1 · Combien de joueurs par équipe ?
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([4, 5, 6] as TeamSize[]).map(n => (
                <button
                  key={n}
                  onClick={() => { setTeamSize(n); setPhase(null); setContextChoice(null); }}
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
                    onClick={() => { setPhase(p); setContextChoice(null); }}
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
                      onClick={() => setContextChoice(s.id)}
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
                  Aucun scénario disponible pour cette combinaison pour l'instant. D'autres viendront —
                  essayez la galerie en attendant.
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {(teamSize !== null || phase !== null || contextChoice !== null) && (
            <div className="border-t-2 border-gray-800 pt-6 flex flex-wrap gap-2 justify-between items-center">
              <button
                onClick={resetCustom}
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
    </div>
  );
}
