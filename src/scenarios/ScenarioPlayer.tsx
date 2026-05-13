import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenarioScene } from './ScenarioScene';
import { CAMERA_PRESETS, useCameraControls } from '../3d/useCameraControls';
import type { CameraPresetKey } from '../3d/useCameraControls';
import type { PhaseKind, Scenario, ScenarioStep, TeamSize } from './types';
import { resolvePlayerColor } from './data/_shared';
import { CONFIGURATIONS } from '../pages/Positions';

// Guide pointers used by the per-step deep-dive link. Slugs match the routes
// registered in App.tsx (`/guides/:slug`).
type GuideRef = { slug: string; label: string };
const GUIDE_RECEPTION: GuideRef = { slug: 'reception', label: 'Guide de la réception' };
const GUIDE_SERVICE: GuideRef = { slug: 'service', label: 'Guide du service' };
const GUIDE_ATTAQUE: GuideRef = { slug: 'attaque', label: "Guide de l'attaque" };
const GUIDE_CONTRE: GuideRef = { slug: 'contre', label: 'Guide du contre' };
const GUIDE_DEFENSE: GuideRef = { slug: 'positionnement-defense', label: 'Guide du positionnement défensif' };

// In a defense scenario the reader's own role is defending — so opponent
// actions ("réception adverse", "frappe adverse") point back to the defense
// guide, not to the reception/attack guide.
const PHASE_GUIDE: Record<PhaseKind, GuideRef> = {
  attack: GUIDE_ATTAQUE,
  reception: GUIDE_RECEPTION,
  defense: GUIDE_DEFENSE,
};

// Map the raw "rest" segment of a scenario id (e.g. "5-1-p1", "vs-z4",
// "losange") onto a Positions formation id that the guides actually
// understand. Tries the full string first, then progressively drops trailing
// `-X` segments — that's how `5-1-p1` collapses to the canonical `5-1`.
// Returns null when no known formation matches.
function matchKnownConfig(teamSize: TeamSize, raw: string | undefined): string | null {
  if (!raw) return null;
  const known = CONFIGURATIONS[teamSize].map(c => c.id);
  let candidate = raw;
  while (candidate.length > 0) {
    if (known.includes(candidate)) return candidate;
    const cut = candidate.lastIndexOf('-');
    if (cut < 0) return null;
    candidate = candidate.slice(0, cut);
  }
  return null;
}

// Build a guide URL that carries the scenario's format when the target guide
// actually reads it. `positionnement-defense` lives at /:size/:config (both as
// path segments); `reception` reads ?size= as a UI hint; other guides ignore params.
const SIZE_TO_SLUG = { 4: '4v4', 5: '5v5', 6: '6v6' } as const;
const SIZE_AWARE_GUIDES = new Set(['reception']);

function guideHref(guide: GuideRef, scenario: Scenario): string {
  const sizeSlug = SIZE_TO_SLUG[scenario.config.teamSize];

  if (guide.slug === 'positionnement-defense') {
    const match = scenario.id.match(/^\d+v\d+-(?:attack|defense|reception)-(.+)$/);
    const config = matchKnownConfig(scenario.config.teamSize, match?.[1]);
    return config
      ? `/guides/positionnement-defense/${sizeSlug}/${config}`
      : `/guides/positionnement-defense/${sizeSlug}`;
  }

  if (SIZE_AWARE_GUIDES.has(guide.slug)) {
    return `/guides/${guide.slug}?size=${scenario.config.teamSize}`;
  }

  return `/guides/${guide.slug}`;
}

// Heuristic: pick the most relevant guide for a step from keywords in its
// title + description. The scenario phase disambiguates ambiguous keywords
// (e.g. a "frappe" mentioned in a defense scenario describes the opponent).
function inferStepGuide(step: ScenarioStep, phase: PhaseKind): GuideRef | null {
  const text = `${step.title} ${step.description}`.toLowerCase();

  // Offensive transition after defending → attack guide, regardless of phase.
  if (/contre-attaque|contre attaque/.test(text)) return GUIDE_ATTAQUE;

  // Anything tagged as the opponent's action belongs to the reader's role.
  if (/\badvers/.test(text)) return PHASE_GUIDE[phase];

  // In defense scenarios, attack-related verbs without "adverse" usually
  // still describe what the attacker is doing — route to defense guide so
  // the reader gets advice on positioning, not on hitting.
  if (phase === 'defense' && /frapp|smash|spike|\battaqu/.test(text)) return GUIDE_DEFENSE;

  if (/r[ée]ception|manchette|plateforme/.test(text)) return GUIDE_RECEPTION;
  if (/\bservice\b|servir|jump float|jump topspin/.test(text)) return GUIDE_SERVICE;
  if (/frapp|smash|spike|course d'élan|approche|\battaqu|\bélan\b/.test(text)) return GUIDE_ATTAQUE;
  if (/contre|\bbloc\b|block/.test(text)) return GUIDE_CONTRE;
  if (/d[ée]fens|positionn|couverture|placement/.test(text)) return GUIDE_DEFENSE;
  return null;
}

type ScenarioPlayerProps = {
  scenario: Scenario;
  hideHeader?: boolean;
  // When true, ScenarioScene renders only the players declared in scenario.players
  // and skips the automatic opponent fillers + the implicit "ball source" filler.
  // Used by the in-app scenario editor so the preview matches the authored data.
  disableAutoFill?: boolean;
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

export default function ScenarioPlayer({ scenario, hideHeader = false, disableAutoFill = false }: ScenarioPlayerProps) {
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
    // gsap stops firing onUpdate after the timeline completes but leaves
    // React's isPlaying = true. Catch the last frame and flip it off so the
    // play button can switch to the replay state.
    if (prog >= 0.999) setIsPlaying(false);
    // Keep the active step in sync with the playhead regardless of mode —
    // in step mode this is what advances the timeline + prev/next state
    // after the player stops at a boundary.
    setActiveStepIdx(findActiveStepIndex(scenario.steps, ctrl.time()));
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

  const isAtEnd = !isPlaying && progress >= 0.999;

  // Replay from the very beginning, respecting the current mode so step mode
  // never silently falls back to auto.
  const replayFromStart = useCallback(() => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    stepBoundaryRef.current = null;
    // Force the step strip back to the leftmost position. The activeStepIdx
    // useEffect only scrolls when the index changes, so if we're already on
    // step 0 (e.g. fast double-replay) the scroll wouldn't fire on its own.
    stepStripRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    if (mode === 'step') {
      playSingleStep(0);
      return;
    }
    ctrl.play(0);
    setIsPlaying(true);
    if (!hasStarted) setHasStarted(true);
  }, [mode, playSingleStep, hasStarted]);

  const togglePlay = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    if (isPlaying) {
      ctrl.pause();
      stepBoundaryRef.current = null;
      setIsPlaying(false);
      return;
    }
    // Timeline finished → the play button is now a replay button.
    if (isAtEnd) {
      replayFromStart();
      return;
    }
    // In step mode, play until the next step boundary and stop there —
    // do not silently fall back to auto.
    if (mode === 'step') {
      const currentIdx = findActiveStepIndex(scenario.steps, ctrl.time());
      const stepEnd = getStepEndTime(scenario, currentIdx);
      if (ctrl.time() >= stepEnd - 0.01) {
        // sitting at the boundary already → replay this step from its start
        playSingleStep(currentIdx);
        return;
      }
      stepBoundaryRef.current = stepEnd;
      ctrl.play();
      setIsPlaying(true);
      if (!hasStarted) setHasStarted(true);
      return;
    }
    stepBoundaryRef.current = null;
    ctrl.play();
    setIsPlaying(true);
    if (!hasStarted) setHasStarted(true);
  };

  const handleStart = () => {
    if (hasStarted) return;
    replayFromStart();
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

      {/* Header — context badges (mode toggle moved into the controls row below) */}
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

      {/* 3D viewer — full width */}
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

          {/* Canvas — height-capped so the timeline strip below stays visible
              when the viewer is pinned to the top of the viewport. The outer
              flex container spans the full card width so the start overlay
              ("voile gris") also covers the full width; the inner box keeps
              the 4/3 aspect of the 3D scene and gets centered. */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'min(55vh, calc(100vh - 360px), 600px)',
            minHeight: 280,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--paper)',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', height: '100%', aspectRatio: '4/3', maxWidth: '100%' }}>
              <Canvas shadows="percentage" camera={{ position: [0, 9, 18], fov: 50 }}>
                <ScenarioScene
                  scenario={scenario}
                  playerRefs={playerRefs}
                  controllerRef={controllerRef}
                  cameraRef={cameraRef}
                  onUpdate={handleUpdate}
                  showTrail={showTrail}
                  showZones={showZones}
                  disableAutoFill={disableAutoFill}
                />
              </Canvas>
            </div>

            {/* Play overlay — spans the outer container so the dark veil
                covers the full card width, not just the centered canvas. */}
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

          {/* Progress bar with clickable step markers
              Markers stay inside the bar (no clipping at t=0 or t=end) and
              duplicates that share a startTime get nudged apart so they
              don't superpose. */}
          <div style={{ position: 'relative', height: 24, background: 'var(--paper)', borderTop: '2px solid var(--ink)' }}>
            <div style={{ position: 'absolute', inset: 0, right: 'auto', background: 'rgba(226,84,46,0.25)', width: `${progress * 100}%` }} />
            {(() => {
              const MARKER = 12; // marker visual size in px
              const GAP = 4;     // gap between stacked markers in px
              const STEP = MARKER + GAP;
              // Group steps by startTime to spread duplicates around the cluster centre.
              const groups = new Map<number, number[]>();
              scenario.steps.forEach((s, i) => {
                const arr = groups.get(s.startTime) ?? [];
                arr.push(i);
                groups.set(s.startTime, arr);
              });
              const offsets = new Map<number, number>();
              groups.forEach(indices => {
                const n = indices.length;
                indices.forEach((idx, k) => {
                  // centre the cluster: e.g. n=2 → [-0.5, +0.5] × STEP; n=3 → [-1, 0, +1] × STEP
                  offsets.set(idx, (k - (n - 1) / 2) * STEP);
                });
              });
              return scenario.steps.map((step, idx) => {
                const pct = totalDuration > 0 ? (step.startTime / totalDuration) * 100 : 0;
                const offsetPx = offsets.get(idx) ?? 0;
                const isActive = idx === activeStepIdx;
                const isPast = idx < activeStepIdx;
                // Keep the marker fully inside the bar by clamping its centre
                // to [MARKER/2 + |offset| margin, 100% − same].
                const edge = MARKER / 2;
                const left = `clamp(${edge}px, calc(${pct}% + ${offsetPx}px), calc(100% - ${edge}px))`;
                return (
                  <button
                    key={step.id}
                    onClick={() => jumpToStep(idx)}
                    title={`Étape ${idx + 1} — ${step.title.replace(/^\d+\.\s*/, '')}`}
                    aria-label={`Étape ${idx + 1}`}
                    style={{ position: 'absolute', top: '50%', left, transform: 'translate(-50%, -50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <span style={{
                      display: 'block', width: MARKER, height: MARKER,
                      border: '2px solid var(--ink)',
                      background: isActive ? 'var(--orange)' : isPast ? 'rgba(226,84,46,0.5)' : 'var(--cream)',
                      transform: isActive ? 'scale(1.3)' : 'scale(1)',
                      transition: 'all 0.15s',
                    }} />
                  </button>
                );
              });
            })()}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--ink)', background: 'var(--cream)' }} role="group" aria-label="Mode de lecture">
                <button
                  onClick={() => handleModeChange('auto')}
                  style={{
                    padding: '6px 12px',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 11,
                    border: 'none',
                    background: mode === 'auto' ? 'var(--orange)' : 'transparent',
                    color: mode === 'auto' ? '#fff' : 'var(--ink)',
                    cursor: 'pointer',
                  }}
                  aria-pressed={mode === 'auto'}
                >
                  ▶ Auto
                </button>
                <button
                  onClick={() => handleModeChange('step')}
                  style={{
                    padding: '6px 12px',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 11,
                    border: 'none',
                    borderLeft: '2px solid var(--ink)',
                    background: mode === 'step' ? 'var(--orange)' : 'transparent',
                    color: mode === 'step' ? '#fff' : 'var(--ink)',
                    cursor: 'pointer',
                  }}
                  aria-pressed={mode === 'step'}
                >
                  ⏯ Étape
                </button>
              </div>
              <button
                onClick={stepBackward}
                disabled={activeStepIdx === 0}
                style={{ ...btnSm, width: 38, height: 38, opacity: activeStepIdx === 0 ? 0.3 : 1 }}
                aria-label="Étape précédente"
              >⏮</button>
              <button
                onClick={togglePlay}
                style={{ width: 48, height: 48, background: 'var(--orange)', border: '2.5px solid var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                aria-label={isPlaying ? 'Pause' : isAtEnd ? 'Recommencer' : 'Lecture'}
              >
                {isPlaying ? '⏸' : isAtEnd ? '↺' : '▶'}
              </button>
              <button
                onClick={stepForward}
                disabled={activeStepIdx === scenario.steps.length - 1}
                style={{ ...btnSm, width: 38, height: 38, opacity: activeStepIdx === scenario.steps.length - 1 ? 0.3 : 1 }}
                aria-label="Étape suivante"
              >⏭</button>
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
            const guide = inferStepGuide(step, scenario.config.phase);
            return (
              <div
                key={step.id}
                style={{
                  flexShrink: 0, width: 220,
                  border: `2.5px solid ${isActive ? 'var(--orange)' : 'var(--ink)'}`,
                  background: isActive ? 'rgba(226,84,46,0.08)' : isPast ? 'var(--paper)' : 'var(--cream)',
                  opacity: isPast && !isActive ? 0.55 : 1,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <button
                  onClick={() => jumpToStep(idx)}
                  style={{
                    flex: 1, textAlign: 'left', padding: '10px 12px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'inherit', font: 'inherit',
                  }}
                >
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? 'var(--orange)' : 'var(--ink)', opacity: isActive ? 1 : 0.4, marginBottom: 4 }}>
                    {String(idx + 1).padStart(2, '0')} / {String(scenario.steps.length).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: isActive ? 'var(--orange)' : 'var(--ink)', marginBottom: 4, letterSpacing: '0.04em' }}>
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink)', opacity: 0.7, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {step.description}
                  </div>
                </button>
                {guide && (
                  <a
                    href={guideHref(guide, scenario)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderTop: '1.5px dashed rgba(26,24,18,0.3)',
                      fontSize: 13, lineHeight: 1.3,
                      color: 'var(--orange)', textDecoration: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{guide.label}</span>
                    <span aria-hidden="true" style={{ fontFamily: '"DM Mono", monospace' }}>↗</span>
                  </a>
                )}
              </div>
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
