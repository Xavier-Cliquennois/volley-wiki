import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenarioScene } from './ScenarioScene';
import { CAMERA_PRESETS, useCameraControls } from '../3d/useCameraControls';
import type { CameraPresetKey } from '../3d/useCameraControls';
import type { Scenario } from './types';

type ScenarioPlayerProps = {
  scenario: Scenario;
};

type PlaybackMode = 'auto' | 'step';

// Find the active narrative step from the current timeline time
function findActiveStepIndex(steps: Scenario['steps'], time: number): number {
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    if (time >= steps[i].startTime) idx = i;
  }
  return idx;
}

// End time of a step = start time of the next step with a STRICTLY greater
// startTime (steps with the same startTime represent parallel actions and
// should play together). Falls back to the timeline end for the last step.
function getStepEndTime(scenario: Scenario, stepIdx: number): number {
  const currentStart = scenario.steps[stepIdx]?.startTime ?? 0;
  for (let i = stepIdx + 1; i < scenario.steps.length; i++) {
    if (scenario.steps[i].startTime > currentStart) return scenario.steps[i].startTime;
  }
  return scenario.timeline.reduce((max, a) => Math.max(max, a.time + a.duration), 0);
}

export default function ScenarioPlayer({ scenario }: ScenarioPlayerProps) {
  const controllerRef = useRef<gsap.core.Timeline | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerRefs = useRef<Record<string, any>>({});
  const stepStripRef = useRef<HTMLDivElement>(null);
  const stepBoundaryRef = useRef<number | null>(null);

  const [mode, setMode] = useState<PlaybackMode>('auto');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [showTrail, setShowTrail] = useState(true);
  const [showZones, setShowZones] = useState(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraPresetKey>('DEFAULT');

  const { animateToPreset } = useCameraControls(cameraRef);

  // Reset when scenario changes
  useEffect(() => {
    setIsPlaying(false);
    setHasStarted(false);
    setProgress(0);
    setActiveStepIdx(0);
    stepBoundaryRef.current = null;
    const initialCamera = scenario.defaultCamera ?? 'DEFAULT';
    setCurrentCameraPreset(initialCamera);
    animateToPreset(initialCamera, 0.01);
  }, [scenario.id, scenario.defaultCamera, animateToPreset]);

  const modeRef = useRef<PlaybackMode>('auto');
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const handleUpdate = useCallback((prog: number) => {
    setProgress(prog);
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    const time = ctrl.time();

    // Step mode: pause when reaching the boundary of the current step
    if (stepBoundaryRef.current !== null && time >= stepBoundaryRef.current) {
      ctrl.time(stepBoundaryRef.current);
      ctrl.pause();
      stepBoundaryRef.current = null;
      setIsPlaying(false);
    }

    // In step mode, the active step is driven by user clicks — do not let
    // time-based detection override it (would skip past parallel-start steps).
    if (modeRef.current === 'auto') {
      const idx = findActiveStepIndex(scenario.steps, ctrl.time());
      setActiveStepIdx(idx);
    }
  }, [scenario.steps]);

  // Auto-scroll the step strip to keep the active step visible
  useEffect(() => {
    const strip = stepStripRef.current;
    if (!strip) return;
    const activeChild = strip.children[activeStepIdx] as HTMLElement | undefined;
    if (activeChild) {
      activeChild.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeStepIdx]);

  const handlePresetChange = useCallback((preset: CameraPresetKey) => {
    animateToPreset(preset);
    setCurrentCameraPreset(preset);
  }, [animateToPreset]);

  // Play one step from start to its end then pause (used in step mode)
  const playSingleStep = useCallback((stepIdx: number) => {
    const ctrl = controllerRef.current;
    const step = scenario.steps[stepIdx];
    if (!ctrl || !step) return;
    ctrl.time(step.startTime);
    stepBoundaryRef.current = getStepEndTime(scenario, stepIdx);
    ctrl.play();
    setIsPlaying(true);
    setActiveStepIdx(stepIdx);
    if (!hasStarted) setHasStarted(true);
  }, [scenario, hasStarted]);

  // Play/Lancer always switches to auto mode — user requested behavior
  const togglePlay = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;

    if (isPlaying) {
      ctrl.pause();
      stepBoundaryRef.current = null;
      setIsPlaying(false);
      return;
    }

    // Switch to auto mode and play from current position (or restart if at end)
    setMode('auto');
    stepBoundaryRef.current = null;
    const totalDuration = ctrl.duration();
    if (ctrl.time() >= totalDuration - 0.01) {
      ctrl.play(0);
    } else {
      ctrl.play();
    }
    setIsPlaying(true);
    if (!hasStarted) setHasStarted(true);
  };

  const handleStart = () => {
    const ctrl = controllerRef.current;
    if (!ctrl || hasStarted) return;
    setMode('auto');
    stepBoundaryRef.current = null;
    ctrl.play(0);
    setIsPlaying(true);
    setHasStarted(true);
  };

  const restart = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    stepBoundaryRef.current = null;
    setMode('auto');
    ctrl.play(0);
    setIsPlaying(true);
    setHasStarted(true);
  };

  const jumpToStep = (stepIdx: number) => {
    const step = scenario.steps[stepIdx];
    if (!controllerRef.current || !step) return;
    // Clicking a card always activates step mode and plays that step
    setMode('step');
    playSingleStep(stepIdx);
  };

  const stepForward = () => {
    if (activeStepIdx < scenario.steps.length - 1) {
      if (mode === 'step') {
        playSingleStep(activeStepIdx + 1);
      } else {
        const next = scenario.steps[activeStepIdx + 1];
        if (next && controllerRef.current) {
          controllerRef.current.time(next.startTime);
          setActiveStepIdx(activeStepIdx + 1);
          if (!hasStarted) setHasStarted(true);
        }
      }
    }
  };

  const stepBackward = () => {
    if (activeStepIdx > 0) {
      if (mode === 'step') {
        playSingleStep(activeStepIdx - 1);
      } else {
        const prev = scenario.steps[activeStepIdx - 1];
        if (prev && controllerRef.current) {
          controllerRef.current.time(prev.startTime);
          setActiveStepIdx(activeStepIdx - 1);
          if (!hasStarted) setHasStarted(true);
        }
      }
    }
  };

  const handleModeChange = (next: PlaybackMode) => {
    if (next === mode) return;
    const ctrl = controllerRef.current;
    if (!ctrl) { setMode(next); return; }
    stepBoundaryRef.current = null;
    if (next === 'step') {
      ctrl.pause();
      setIsPlaying(false);
    } else {
      // Switch to auto: resume from current position
      ctrl.play();
      setIsPlaying(true);
      if (!hasStarted) setHasStarted(true);
    }
    setMode(next);
  };

  const cycleSpeed = () => {
    if (!controllerRef.current) return;
    const speeds = [1, 0.5, 0.25];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    controllerRef.current.timeScale(next);
    setSpeed(next);
  };

  const activeStep = scenario.steps[activeStepIdx];

  // Total timeline duration — used to position step markers on the progress bar
  const totalDuration = useMemo(
    () => scenario.timeline.reduce((max, a) => Math.max(max, a.time + a.duration), 0),
    [scenario.timeline]
  );

  const phaseLabel = useMemo(() => {
    switch (scenario.config.phase) {
      case 'attack': return 'Attaque';
      case 'defense': return 'Défense';
      case 'reception': return 'Réception';
    }
  }, [scenario.config.phase]);

  return (
    <div className="space-y-4">
      {/* Header — context badges + mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 border-2 border-yellow-400 text-yellow-400 text-xs uppercase tracking-widest">
            {scenario.config.teamSize}v{scenario.config.teamSize}
          </div>
          <div className="px-3 py-1 border-2 border-gray-700 text-gray-300 text-xs uppercase tracking-widest">
            {phaseLabel}
          </div>
          <div className="px-3 py-1 border border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
            {scenario.config.contextLabel}
          </div>
        </div>
        <div className="flex items-center border-2 border-gray-700">
          <button
            onClick={() => handleModeChange('auto')}
            className={`px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
              mode === 'auto'
                ? 'bg-yellow-400 text-black font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ▶ Auto
          </button>
          <button
            onClick={() => handleModeChange('step')}
            className={`px-3 py-2 text-xs uppercase tracking-wider transition-colors border-l-2 border-gray-700 ${
              mode === 'step'
                ? 'bg-yellow-400 text-black font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ⏯ Étape
          </button>
        </div>
      </div>

      {/* Main grid: 3D + active step (side-by-side desktop, stacked mobile) */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* 3D viewer */}
        <div className="border-2 border-gray-700 bg-gray-900 md:col-span-3">
          {/* Camera presets */}
          <div className="border-b-2 border-gray-700 px-3 py-2 flex items-center gap-1 overflow-x-auto">
            {(Object.keys(CAMERA_PRESETS) as CameraPresetKey[]).map(key => (
              <button
                key={key}
                onClick={() => handlePresetChange(key)}
                className={`px-2 py-1 text-xs border whitespace-nowrap transition-colors ${
                  currentCameraPreset === key
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'text-gray-400 border-gray-600 hover:border-gray-400'
                }`}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-[440px]">
            <Canvas shadows="percentage" camera={{ position: [0, 9, 18], fov: 50 }}>
              <ScenarioScene
                scenario={scenario}
                playerRefs={playerRefs}
                controllerRef={controllerRef}
                cameraRef={cameraRef}
                onUpdate={handleUpdate}
                showTrail={showTrail}
                showZones={showZones}
              />
            </Canvas>

            {/* Play overlay */}
            {!hasStarted && (
              <div
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer"
                onClick={handleStart}
              >
                <div className="w-20 h-20 bg-yellow-400 flex items-center justify-center border-2 border-yellow-600 mb-3">
                  <span className="text-4xl ml-1 text-black">▶</span>
                </div>
                <span className="text-white text-xs uppercase tracking-widest">
                  {mode === 'step' ? 'Lancer étape par étape' : 'Lancer la séquence'}
                </span>
              </div>
            )}
          </div>

          {/* Progress bar with clickable step markers */}
          <div className="relative h-6 bg-gray-800 border-t-2 border-gray-700">
            <div className="absolute inset-y-0 left-0 bg-yellow-400/30" style={{ width: `${progress * 100}%` }} />
            {scenario.steps.map((step, idx) => {
              const pct = totalDuration > 0 ? (step.startTime / totalDuration) * 100 : 0;
              const isActive = idx === activeStepIdx;
              const isPast = idx < activeStepIdx;
              return (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(idx)}
                  title={`Étape ${idx + 1} — ${step.title.replace(/^\d+\.\s*/, '')}`}
                  aria-label={`Étape ${idx + 1}`}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${pct}%` }}
                >
                  <span
                    className={`block w-3 h-3 border-2 transition-all ${
                      isActive
                        ? 'bg-yellow-400 border-yellow-300 scale-125'
                        : isPast
                          ? 'bg-yellow-600 border-yellow-700'
                          : 'bg-gray-700 border-gray-500 hover:bg-gray-500 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-900 border border-gray-600 text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="border-t-2 border-gray-700 px-3 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={cycleSpeed}
                className="px-3 py-2 text-xs border border-gray-600 text-gray-300 hover:border-gray-400 min-w-[48px] uppercase tracking-wider"
              >
                {speed}×
              </button>
              <button
                onClick={() => setShowTrail(t => !t)}
                title="Affiche une traînée derrière le ballon pour visualiser sa trajectoire"
                className={`px-3 py-2 text-xs border uppercase tracking-wider ${
                  showTrail ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                Traînée
              </button>
              <button
                onClick={() => setShowZones(z => !z)}
                title="Affiche les 6 zones FIVB sur le terrain"
                className={`px-3 py-2 text-xs border uppercase tracking-wider ${
                  showZones ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                Zones
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={stepBackward}
                disabled={activeStepIdx === 0}
                className="w-10 h-10 border border-gray-600 text-gray-300 hover:border-gray-400 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Étape précédente"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-yellow-400 border-2 border-yellow-600 text-black flex items-center justify-center text-lg font-bold"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={stepForward}
                disabled={activeStepIdx === scenario.steps.length - 1}
                className="w-10 h-10 border border-gray-600 text-gray-300 hover:border-gray-400 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Étape suivante"
              >
                ⏭
              </button>
              <button
                onClick={restart}
                className="w-10 h-10 border border-gray-600 text-gray-300 hover:border-gray-400 flex items-center justify-center"
                aria-label="Recommencer"
              >
                ↺
              </button>
            </div>
          </div>

          {/* Player legend */}
          <div className="border-t-2 border-gray-700 px-3 py-2 flex flex-wrap items-center gap-3">
            {scenario.players.map(p => (
              <div key={p.id} className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-500" style={{ backgroundColor: p.color }} />
                <span className="text-gray-400 text-xs">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active step card */}
        <div className="border-2 border-gray-700 bg-gray-900 p-4 md:p-6 md:col-span-2 flex flex-col">
          <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">
            Étape {activeStepIdx + 1} / {scenario.steps.length}
          </div>
          <h3 className="text-white text-xl md:text-2xl font-bold mb-3">
            {activeStep?.title.replace(/^\d+\.\s*/, '')}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed flex-1">
            {activeStep?.description}
          </p>
          {mode === 'step' && (
            <div className="mt-4 pt-4 border-t-2 border-gray-800 flex items-center gap-2">
              <button
                onClick={stepBackward}
                disabled={activeStepIdx === 0}
                className="px-3 py-2 text-xs border-2 border-gray-700 text-gray-300 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                ← Précédent
              </button>
              <button
                onClick={stepForward}
                disabled={activeStepIdx === scenario.steps.length - 1}
                className="flex-1 px-4 py-2 text-xs border-2 border-yellow-600 bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step timeline strip */}
      <div className="border-2 border-gray-700 bg-gray-900">
        <div className="border-b-2 border-gray-700 px-3 py-2 flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-widest">Timeline</span>
          <span className="text-gray-600 text-xs">cliquer pour sauter</span>
        </div>
        <div
          ref={stepStripRef}
          className="flex gap-2 p-3 overflow-x-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {scenario.steps.map((step, idx) => {
            const isActive = idx === activeStepIdx;
            const isPast = idx < activeStepIdx;
            return (
              <button
                key={step.id}
                onClick={() => jumpToStep(idx)}
                className={`flex-shrink-0 w-48 md:w-56 text-left p-3 border-2 transition-colors ${
                  isActive
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : isPast
                      ? 'border-gray-600 bg-gray-800 opacity-60'
                      : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className={`text-xs uppercase tracking-widest mb-1 ${isActive ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className={`text-sm font-bold mb-1 ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                  {step.title.replace(/^\d+\.\s*/, '')}
                </div>
                <div className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                  {step.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary card */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-2 border-gray-700 p-4 md:p-6">
          <div className="text-yellow-400 text-xs uppercase tracking-widest mb-3">Points clés</div>
          <ul className="space-y-2">
            {scenario.summary.keyPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-gray-200 text-sm leading-relaxed">
                <span className="text-yellow-400 font-bold flex-shrink-0">▸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-gray-800 p-4 md:p-6">
          <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Erreurs fréquentes</div>
          <ul className="space-y-2">
            {scenario.summary.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                <span className="text-gray-600 font-bold flex-shrink-0">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
