import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenarioScene } from './ScenarioScene';
import { CAMERA_PRESETS, useCameraControls } from '../3d/useCameraControls';
import type { CameraPresetKey } from '../3d/useCameraControls';
import type { Scenario } from './types';
import { resolvePlayerColor } from './data/_shared';

type ScenarioPlayerProps = {
  scenario: Scenario;
  hideHeader?: boolean;
};

type PlaybackMode = 'auto' | 'step';

function findActiveStepIndex(steps: Scenario['steps'], time: number): number {
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    if (time >= steps[i].startTime) idx = i;
  }
  return idx;
}

function getStepEndTime(scenario: Scenario, stepIdx: number): number {
  const currentStart = scenario.steps[stepIdx]?.startTime ?? 0;
  for (let i = stepIdx + 1; i < scenario.steps.length; i++) {
    if (scenario.steps[i].startTime > currentStart) return scenario.steps[i].startTime;
  }
  return scenario.timeline.reduce((max, a) => Math.max(max, a.time + a.duration), 0);
}

const btnSm: React.CSSProperties = {
  padding: '6px 10px', fontFamily: '"DM Mono", monospace', fontSize: 11,
  border: '2px solid var(--ink)', background: 'var(--cream)', color: 'var(--ink)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const btnActive: React.CSSProperties = { ...btnSm, background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)' };

export default function ScenarioPlayer({ scenario, hideHeader = false }: ScenarioPlayerProps) {
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
    if (stepBoundaryRef.current !== null && time >= stepBoundaryRef.current) {
      ctrl.time(stepBoundaryRef.current);
      ctrl.pause();
      stepBoundaryRef.current = null;
      setIsPlaying(false);
    }
    if (modeRef.current === 'auto') {
      const idx = findActiveStepIndex(scenario.steps, ctrl.time());
      setActiveStepIdx(idx);
    }
  }, [scenario.steps]);

  useEffect(() => {
    const strip = stepStripRef.current;
    if (!strip) return;
    const activeChild = strip.children[activeStepIdx] as HTMLElement | undefined;
    if (!activeChild) return;
    const targetLeft = activeChild.offsetLeft - (strip.clientWidth - activeChild.clientWidth) / 2;
    strip.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [activeStepIdx]);

  const handlePresetChange = useCallback((preset: CameraPresetKey) => {
    animateToPreset(preset);
    setCurrentCameraPreset(preset);
  }, [animateToPreset]);

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

  const togglePlay = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    if (isPlaying) {
      ctrl.pause();
      stepBoundaryRef.current = null;
      setIsPlaying(false);
      return;
    }
    setMode('auto');
    stepBoundaryRef.current = null;
    const totalDuration = ctrl.duration();
    if (ctrl.time() >= totalDuration - 0.01) { ctrl.play(0); } else { ctrl.play(); }
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
    setMode('step');
    playSingleStep(stepIdx);
  };

  const stepForward = () => {
    if (activeStepIdx < scenario.steps.length - 1) {
      if (mode === 'step') { playSingleStep(activeStepIdx + 1); }
      else {
        const next = scenario.steps[activeStepIdx + 1];
        if (next && controllerRef.current) { controllerRef.current.time(next.startTime); setActiveStepIdx(activeStepIdx + 1); if (!hasStarted) setHasStarted(true); }
      }
    }
  };

  const stepBackward = () => {
    if (activeStepIdx > 0) {
      if (mode === 'step') { playSingleStep(activeStepIdx - 1); }
      else {
        const prev = scenario.steps[activeStepIdx - 1];
        if (prev && controllerRef.current) { controllerRef.current.time(prev.startTime); setActiveStepIdx(activeStepIdx - 1); if (!hasStarted) setHasStarted(true); }
      }
    }
  };

  const handleModeChange = (next: PlaybackMode) => {
    if (next === mode) return;
    const ctrl = controllerRef.current;
    if (!ctrl) { setMode(next); return; }
    stepBoundaryRef.current = null;
    if (next === 'step') { ctrl.pause(); setIsPlaying(false); }
    else { ctrl.play(); setIsPlaying(true); if (!hasStarted) setHasStarted(true); }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header — context badges + mode toggle */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: hideHeader ? 'flex-end' : 'space-between' }}>
        {!hideHeader && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
            <div style={{ padding: '3px 12px', border: '2.5px solid var(--orange)', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)' }}>
              {scenario.config.teamSize}v{scenario.config.teamSize}
            </div>
            <div style={{ padding: '3px 12px', border: '2px solid var(--ink)', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)' }}>
              {phaseLabel}
            </div>
            <div style={{ padding: '3px 12px', border: '1.5px solid var(--ink)', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>
              {scenario.config.contextLabel}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', border: '2.5px solid var(--ink)' }}>
          <button
            onClick={() => handleModeChange('auto')}
            style={mode === 'auto' ? { ...btnActive, padding: '6px 12px' } : { ...btnSm, padding: '6px 12px' }}
          >
            ▶ Auto
          </button>
          <button
            onClick={() => handleModeChange('step')}
            style={{ ...(mode === 'step' ? btnActive : btnSm), padding: '6px 12px', borderLeft: '2px solid var(--ink)' }}
          >
            ⏯ Étape
          </button>
        </div>
      </div>

      {/* Main grid: 3D + active step */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 14 }}>
        {/* 3D viewer */}
        <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow)' }}>
          {/* Camera presets */}
          <div style={{ borderBottom: '2px solid var(--ink)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', background: 'var(--cream)' }}>
            {(Object.keys(CAMERA_PRESETS) as CameraPresetKey[]).map(key => (
              <button
                key={key}
                onClick={() => handlePresetChange(key)}
                style={{
                  padding: '3px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em',
                  border: '1.5px solid var(--ink)', whiteSpace: 'nowrap', cursor: 'pointer',
                  background: currentCameraPreset === key ? 'var(--orange)' : 'var(--cream)',
                  color: currentCameraPreset === key ? '#fff' : 'var(--ink)',
                }}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div style={{ position: 'relative', aspectRatio: '4/3' }}>
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
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(26,24,18,0.72)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleStart}
              >
                <div style={{
                  width: 72, height: 72, background: 'var(--orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2.5px solid var(--ink)', boxShadow: 'var(--shadow)', marginBottom: 12,
                }}>
                  <span style={{ fontSize: 36, marginLeft: 4, color: '#fff' }}>▶</span>
                </div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream)' }}>
                  {mode === 'step' ? 'Lancer étape par étape' : 'Lancer la séquence'}
                </span>
              </div>
            )}
          </div>

          {/* Progress bar with clickable step markers */}
          <div style={{ position: 'relative', height: 24, background: 'var(--paper)', borderTop: '2px solid var(--ink)' }}>
            <div style={{ position: 'absolute', inset: 0, right: 'auto', background: 'rgba(226,84,46,0.25)', width: `${progress * 100}%` }} />
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
                  style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <span style={{
                    display: 'block', width: 12, height: 12,
                    border: '2px solid var(--ink)',
                    background: isActive ? 'var(--orange)' : isPast ? 'rgba(226,84,46,0.5)' : 'var(--cream)',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }} />
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ borderTop: '2px solid var(--ink)', padding: '10px 12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'var(--cream)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={cycleSpeed} style={{ ...btnSm, minWidth: 44, fontFamily: '"Bungee", sans-serif', fontSize: 10 }}>
                {speed}×
              </button>
              <button
                onClick={() => setShowTrail(t => !t)}
                title="Affiche une traînée derrière le ballon pour visualiser sa trajectoire"
                style={showTrail ? { ...btnActive, padding: '4px 10px' } : { ...btnSm, padding: '4px 10px' }}
              >
                Traînée
              </button>
              <button
                onClick={() => setShowZones(z => !z)}
                title="Affiche les 6 zones FIVB sur le terrain"
                style={showZones ? { ...btnActive, padding: '4px 10px' } : { ...btnSm, padding: '4px 10px' }}
              >
                Zones
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={stepBackward}
                disabled={activeStepIdx === 0}
                style={{ ...btnSm, width: 38, height: 38, opacity: activeStepIdx === 0 ? 0.3 : 1 }}
                aria-label="Étape précédente"
              >⏮</button>
              <button
                onClick={togglePlay}
                style={{ width: 48, height: 48, background: 'var(--orange)', border: '2.5px solid var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={stepForward}
                disabled={activeStepIdx === scenario.steps.length - 1}
                style={{ ...btnSm, width: 38, height: 38, opacity: activeStepIdx === scenario.steps.length - 1 ? 0.3 : 1 }}
                aria-label="Étape suivante"
              >⏭</button>
              <button onClick={restart} style={{ ...btnSm, width: 38, height: 38 }} aria-label="Recommencer">↺</button>
            </div>
          </div>

          {/* Player legend — opponents excluded (all grey, no added value) */}
          <div style={{ borderTop: '2px solid var(--ink)', padding: '6px 12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, background: 'var(--cream)' }}>
            {scenario.players.filter(p => p.role !== 'opponent').map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 12, height: 12, border: '1.5px solid var(--ink)', backgroundColor: resolvePlayerColor(p) }} />
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.75 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active step card */}
        <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '20px 22px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 8 }}>
            Étape {activeStepIdx + 1} / {scenario.steps.length}
          </div>
          <h3 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(16px, 2vw, 22px)', color: 'var(--ink)', margin: '0 0 12px 0' }}>
            {activeStep?.title.replace(/^\d+\.\s*/, '')}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6, flex: 1, margin: 0 }}>
            {activeStep?.description}
          </p>
          {mode === 'step' && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '2px solid var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={stepBackward}
                disabled={activeStepIdx === 0}
                style={{ ...btnSm, padding: '6px 12px', opacity: activeStepIdx === 0 ? 0.3 : 1, fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.08em' }}
              >
                ← Précédent
              </button>
              <button
                onClick={stepForward}
                disabled={activeStepIdx === scenario.steps.length - 1}
                style={{ flex: 1, padding: '8px 14px', border: '2.5px solid var(--ink)', background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer', opacity: activeStepIdx === scenario.steps.length - 1 ? 0.3 : 1, boxShadow: 'var(--shadow-sm)' }}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step timeline strip */}
      <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ borderBottom: '2px solid var(--ink)', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)' }}>
          <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink)' }}>Timeline</span>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.4 }}>cliquer pour sauter</span>
        </div>
        <div
          ref={stepStripRef}
          style={{ display: 'flex', gap: 8, padding: 10, overflowX: 'auto', scrollbarWidth: 'thin' }}
        >
          {scenario.steps.map((step, idx) => {
            const isActive = idx === activeStepIdx;
            const isPast = idx < activeStepIdx;
            return (
              <button
                key={step.id}
                onClick={() => jumpToStep(idx)}
                style={{
                  flexShrink: 0, width: 192, textAlign: 'left', padding: '10px 12px',
                  border: `2.5px solid ${isActive ? 'var(--orange)' : 'var(--ink)'}`,
                  background: isActive ? 'rgba(226,84,46,0.08)' : isPast ? 'var(--paper)' : 'var(--cream)',
                  opacity: isPast && !isActive ? 0.55 : 1,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? 'var(--orange)' : 'var(--ink)', opacity: isActive ? 1 : 0.4, marginBottom: 4 }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: isActive ? 'var(--orange)' : 'var(--ink)', marginBottom: 4, letterSpacing: '0.04em' }}>
                  {step.title.replace(/^\d+\.\s*/, '')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink)', opacity: 0.65, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {step.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        <div style={{ border: '2.5px solid var(--ink)', padding: '18px 20px', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 12 }}>Points clés</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scenario.summary.keyPoints.map((point, idx) => (
              <li key={idx} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>▸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ border: '2px solid var(--ink)', padding: '18px 20px', background: 'var(--cream)', opacity: 0.9 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 12 }}>Erreurs fréquentes</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scenario.summary.commonMistakes.map((mistake, idx) => (
              <li key={idx} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--ink)', opacity: 0.75, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--orange)', fontWeight: 700, flexShrink: 0 }}>✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
