import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head } from '../seo/Head';
import { EditorCanvas } from '../editor/EditorCanvas';
import type { BrickMarker, PlayerBrickBadge, SmashSyncIndicator } from '../editor/EditorCanvas';
import { ContextSidebar } from '../editor/ContextSidebar';
import { ROLE_OPTIONS, buildDefaultEditorState } from '../editor/defaults';
import { compileScenario } from '../editor/compileScenario';
import { decompile } from '../editor/decompile';
import { exportJson, exportTypescript, importJson } from '../editor/serialize';
import { SCENARIOS } from '../scenarios/data';
import { TempoPicker } from '../editor/TempoPicker';
import { StepBlock } from '../editor/StepBlock';
import { CardReadiness } from '../editor/CardReadiness';
import { CardTimeline } from '../editor/CardTimeline';
import { StoryMode } from '../editor/StoryMode';
import {
  BRICK_BY_KIND,
  BRICK_CATEGORY_COLORS,
  brickAnchorPoints,
  createBrickWithDefaults,
  type BrickAction,
  type BrickKind,
} from '../editor/bricks';
import { computeBallSnapForJumpingBrick, computeSyncStatuses, isJumpingBrick } from '../editor/smashSync';
import { buildSmashSequence } from '../editor/smashSequence';
import type {
  EditorPlayer,
  EditorState,
  EditorStep,
  PoseName,
} from '../editor/types';
import type { BallCurve, PhaseKind, PlayerRole, TeamSize } from '../scenarios/types';

const ScenarioPlayer = lazy(() => import('../scenarios/ScenarioPlayer'));

const POSE_OPTIONS: PoseName[] = ['READY', 'BUMP', 'SET', 'SPIKE', 'ARM_SPIKE', 'RESET'];

// Ball-to-player snap radius in metres. When the author drops the ball within
// this distance of a teammate, the ball locks onto that player and follows
// them. Larger than the auto-pose contact radius (0.9) so the snap is forgiving.
const BALL_SNAP_RADIUS = 1.0;

const monoLabel: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
  marginBottom: 6,
  display: 'block',
};

const card: React.CSSProperties = {
  border: '3px solid var(--ink)',
  background: 'var(--paper)',
  boxShadow: 'var(--shadow-sm)',
  padding: '16px 18px',
};

const input: React.CSSProperties = {
  width: '100%',
  border: '2px solid var(--ink)',
  background: 'var(--cream)',
  fontFamily: '"DM Mono", monospace',
  fontSize: 12,
  padding: '6px 8px',
  color: 'var(--ink)',
};

const btn: React.CSSProperties = {
  border: '2.5px solid var(--ink)',
  background: 'var(--cream)',
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.06em',
  padding: '8px 14px',
  cursor: 'pointer',
  color: 'var(--ink)',
};

const btnActive: React.CSSProperties = {
  ...btn,
  background: 'var(--orange)',
  color: '#fff',
  boxShadow: '2px 2px 0 var(--ink)',
  transform: 'translate(-1px, -1px)',
};

type Selection = { kind: 'player'; id: string } | { kind: 'ball' } | null;

export default function ScenarioEditor() {
  const [state, setState] = useState<EditorState>(() => buildDefaultEditorState(6));
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [selection, setSelection] = useState<Selection>(null);
  const [showOtherBricks, setShowOtherBricks] = useState(true);
  const selectedPlayerId = selection?.kind === 'player' ? selection.id : null;
  const [exportFormat, setExportFormat] = useState<'json' | 'ts'>('json');
  const [importError, setImportError] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingFormatChange, setPendingFormatChange] = useState<TeamSize | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelFormatChangeRef = useRef<HTMLButtonElement>(null);

  const activeStep = state.steps[activeStepIdx];

  // Mutating helper: every author edit goes through here so we can flip the
  // dirty flag in a single place. Format changes and imports bypass this and
  // reset isDirty themselves.
  const applyMutation = useCallback((mutate: (prev: EditorState) => EditorState) => {
    setState(mutate);
    setIsDirty(true);
  }, []);

  // -- Step navigation ---------------------------------------------------
  const goToStep = (idx: number) => {
    setActiveStepIdx(Math.max(0, Math.min(state.steps.length - 1, idx)));
  };

  // -- Mutations ---------------------------------------------------------
  const updateActiveStep = useCallback((mutate: (s: EditorStep) => EditorStep) => {
    applyMutation(prev => {
      const next = { ...prev, steps: prev.steps.slice() };
      next.steps[activeStepIdx] = mutate(prev.steps[activeStepIdx]);
      return next;
    });
  }, [activeStepIdx, applyMutation]);

  const onMovePlayer = useCallback((id: string, x: number, z: number) => {
    applyMutation(prev => {
      const step = prev.steps[activeStepIdx];
      const movedPos: [number, number, number] = [x, step.snapshot.positions[id]?.[1] ?? 0, z];
      const nextPositions = { ...step.snapshot.positions, [id]: movedPos };
      // If the ball is being carried by this player, drag it along (XZ only —
      // the author's chosen Y stays).
      const carrying = step.snapshot.ballAttachedTo === id;
      const nextBallPos: [number, number, number] = carrying
        ? [x, step.snapshot.ballPosition[1], z]
        : step.snapshot.ballPosition;
      const nextPoses = recomputeContactPose(prev, step.snapshot.poses, nextPositions, nextBallPos);
      const steps = prev.steps.slice();
      steps[activeStepIdx] = {
        ...step,
        snapshot: { ...step.snapshot, positions: nextPositions, ballPosition: nextBallPos, poses: nextPoses },
      };
      return { ...prev, steps };
    });
  }, [activeStepIdx, applyMutation]);

  const onMoveBall = useCallback((x: number, z: number) => {
    applyMutation(prev => {
      const step = prev.steps[activeStepIdx];
      // Snap to the closest player within BALL_SNAP_RADIUS — when found, the
      // ball coordinates jump to that player's XZ and ballAttachedTo is set.
      // Otherwise the attachment is cleared and the ball stays at the dropped XZ.
      let snapTo: string | undefined;
      let snapPos: [number, number, number] = [x, step.snapshot.ballPosition[1], z];
      let bestDist = BALL_SNAP_RADIUS;
      for (const player of prev.players) {
        if (player.role === 'opponent') continue; // only our team carries
        const pp = step.snapshot.positions[player.id];
        if (!pp) continue;
        const d = Math.hypot(pp[0] - x, pp[2] - z);
        if (d < bestDist) {
          bestDist = d;
          snapTo = player.id;
          snapPos = [pp[0], step.snapshot.ballPosition[1], pp[2]];
        }
      }
      const nextPoses = recomputeContactPose(prev, step.snapshot.poses, step.snapshot.positions, snapPos);
      const steps = prev.steps.slice();
      steps[activeStepIdx] = {
        ...step,
        snapshot: {
          ...step.snapshot,
          ballPosition: snapPos,
          poses: nextPoses,
          ballAttachedTo: snapTo,
        },
      };
      return { ...prev, steps };
    });
  }, [activeStepIdx, applyMutation]);

  const setBallHeight = (height: number) => {
    updateActiveStep(s => ({
      ...s,
      snapshot: {
        ...s.snapshot,
        ballPosition: [s.snapshot.ballPosition[0], height, s.snapshot.ballPosition[2]],
      },
    }));
  };

  // -- Ball trajectory ---------------------------------------------------
  const setBallCurve = (curve: BallCurve) => {
    updateActiveStep(s => ({
      ...s,
      ballTrajectory: { ...(s.ballTrajectory ?? { curve: 'arc' }), curve },
    }));
  };

  const setBallApex = (apex: number) => {
    updateActiveStep(s => ({
      ...s,
      ballTrajectory: { curve: s.ballTrajectory?.curve ?? 'arc', apex },
    }));
  };

  // -- Bricks ------------------------------------------------------------
  // One brick per player per card: posing a new brick replaces the existing
  // one for that player. The author can never end up with two SMASHes on the
  // same R4 in the same transition.
  //
  // When the brick is a jumping one (smash/feinte/jump_serve/bloc) AND we
  // have a previous step, also snap the previous step's ball position to the
  // impact XZ — that's the silent auto-sync that makes the smash "just work"
  // without manual ball positioning. See src/editor/smashSync.ts.
  const addBrick = useCallback((kind: BrickKind, playerId: string) => {
    applyMutation(prev => {
      const step = prev.steps[activeStepIdx];
      if (!step) return prev;
      const playerPos = step.snapshot.positions[playerId] ?? [0, 0, 0];
      const others = (step.actions ?? []).filter(a => a.playerId !== playerId);
      const brickId = nextBrickId(others);
      const brick = createBrickWithDefaults(kind, brickId, playerId, playerPos);
      const steps = prev.steps.slice();
      steps[activeStepIdx] = { ...step, actions: [...others, brick] };

      // Auto-sync: realign previous step's ball position so it lines up with
      // the impact XZ. Only triggers for jumping bricks AND when we have a
      // previous step to mutate. Y is preserved. We skip when the step
      // already has another jumping brick (decoy jumpers shouldn't reposition
      // the ball — only the FIRST jumper drives the alignment).
      if (isJumpingBrick(brick) && activeStepIdx > 0) {
        const alreadyHasJumper = others.some(b => isJumpingBrick(b));
        if (!alreadyHasJumper) {
          const prevStep = prev.steps[activeStepIdx - 1];
          const snapped = computeBallSnapForJumpingBrick(brick, prevStep);
          if (snapped) {
            steps[activeStepIdx - 1] = {
              ...prevStep,
              snapshot: { ...prevStep.snapshot, ballPosition: snapped },
            };
          }
        }
      }
      return { ...prev, steps };
    });
  }, [activeStepIdx, applyMutation]);

  // One-click macro: insert two well-synced steps right after the active card,
  // forming a complete "pass → smash" sequence for the given attacker. The
  // generated steps use the same ball-split / contactAtRatio mechanism as a
  // manually-added SMASH brick, so the spike compiles to a properly-timed
  // jump-and-hit. Author can still tweak any step afterwards.
  const insertSmashSequence = useCallback((attackerId: string) => {
    applyMutation(prev => {
      const baseStep = prev.steps[activeStepIdx];
      if (!baseStep) return prev;
      const [passId, smashId] = reserveStepIds(prev.steps, 2);
      const { passStep, smashStep } = buildSmashSequence(attackerId, baseStep, prev, passId, smashId);
      const steps = [
        ...prev.steps.slice(0, activeStepIdx + 1),
        passStep,
        smashStep,
        ...prev.steps.slice(activeStepIdx + 1),
      ];
      return { ...prev, steps };
    });
    // Jump to the smash card so the author sees the result of their click.
    setActiveStepIdx(activeStepIdx + 2);
  }, [activeStepIdx, applyMutation]);

  const removeBrick = useCallback((brickId: string) => {
    applyMutation(prev => {
      const step = prev.steps[activeStepIdx];
      if (!step?.actions) return prev;
      const steps = prev.steps.slice();
      const remaining = step.actions.filter(b => b.id !== brickId);
      steps[activeStepIdx] = { ...step, actions: remaining.length > 0 ? remaining : undefined };
      return { ...prev, steps };
    });
  }, [activeStepIdx, applyMutation]);

  // Drag a brick anchor (impact/to) on the 2D canvas.
  const moveBrickMarker = useCallback((brickId: string, anchorKey: string, x: number, z: number) => {
    applyMutation(prev => {
      const step = prev.steps[activeStepIdx];
      if (!step?.actions) return prev;
      const steps = prev.steps.slice();
      steps[activeStepIdx] = {
        ...step,
        actions: step.actions.map(b => {
          if (b.id !== brickId) return b;
          // anchorKey is the brick field name we're patching. Its presence on
          // the brick variant is guaranteed by brickAnchorPoints upstream.
          if (anchorKey === 'impact' && 'impact' in b) {
            return { ...b, impact: [x, b.impact[1], z] } as BrickAction;
          }
          if (anchorKey === 'to' && 'to' in b) {
            return { ...b, to: [x, b.to[1], z] } as BrickAction;
          }
          return b;
        }),
      };
      return { ...prev, steps };
    });
  }, [activeStepIdx, applyMutation]);

  const addStep = () => {
    applyMutation(prev => {
      const last = prev.steps[prev.steps.length - 1];
      const newId = `s${prev.steps.length + 1}`;
      const idx = prev.steps.length;
      const newStep: EditorStep = {
        id: newId,
        title: `${idx + 1}. Nouvelle carte`,
        description: '',
        tempo: 'standard',
        snapshot: {
          // Copy previous positions so the author only edits what changes.
          positions: { ...last.snapshot.positions },
          ballPosition: [...last.snapshot.ballPosition] as [number, number, number],
        },
      };
      return { ...prev, steps: [...prev.steps, newStep] };
    });
    setActiveStepIdx(state.steps.length);
  };

  const duplicateStep = () => {
    applyMutation(prev => {
      const src = prev.steps[activeStepIdx];
      const newId = `s${prev.steps.length + 1}`;
      const copy: EditorStep = {
        ...src,
        id: newId,
        title: `${prev.steps.length + 1}. Copie de ${src.title.replace(/^\d+\.\s*/, '')}`,
        snapshot: {
          positions: { ...src.snapshot.positions },
          ballPosition: [...src.snapshot.ballPosition] as [number, number, number],
          poses: src.snapshot.poses ? { ...src.snapshot.poses } : undefined,
        },
      };
      const steps = [...prev.steps.slice(0, activeStepIdx + 1), copy, ...prev.steps.slice(activeStepIdx + 1)];
      return { ...prev, steps };
    });
    setActiveStepIdx(activeStepIdx + 1);
  };

  const deleteStep = () => {
    if (state.steps.length <= 1) return;
    if (!confirm('Supprimer cette carte ?')) return;
    applyMutation(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== activeStepIdx),
    }));
    setActiveStepIdx(Math.max(0, activeStepIdx - 1));
  };

  const moveStep = (direction: -1 | 1) => {
    const target = activeStepIdx + direction;
    if (target < 0 || target >= state.steps.length) return;
    applyMutation(prev => {
      const steps = prev.steps.slice();
      [steps[activeStepIdx], steps[target]] = [steps[target], steps[activeStepIdx]];
      return { ...prev, steps };
    });
    setActiveStepIdx(target);
  };

  // -- Players -----------------------------------------------------------
  const addPlayer = (role: PlayerRole) => {
    const opt = ROLE_OPTIONS.find(o => o.value === role) ?? ROLE_OPTIONS[0];
    applyMutation(prev => {
      const id = nextPlayerId(prev.players, role);
      const newPlayer: EditorPlayer = { id, label: `${opt.label} (${id})`, role, color: opt.color };
      // Spawn at a sensible default position depending on side.
      const spawnPos: [number, number, number] = role === 'opponent' ? [0, 0, -1] : [0, 0, 1];
      const steps = prev.steps.map(s => ({
        ...s,
        snapshot: { ...s.snapshot, positions: { ...s.snapshot.positions, [id]: spawnPos } },
      }));
      return { ...prev, players: [...prev.players, newPlayer], steps };
    });
  };

  const removePlayer = (id: string) => {
    applyMutation(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id),
      steps: prev.steps.map(s => {
        const positions = Object.fromEntries(Object.entries(s.snapshot.positions).filter(([k]) => k !== id));
        const poses = s.snapshot.poses;
        const nextPoses = poses ? Object.fromEntries(Object.entries(poses).filter(([k]) => k !== id)) : undefined;
        // Drop bricks owned by the removed player — leaving them orphan would
        // crash the runtime when expandBrick tries to address a missing playerRef.
        const remainingActions = s.actions?.filter(a => a.playerId !== id);
        return {
          ...s,
          snapshot: { ...s.snapshot, positions, poses: nextPoses },
          actions: remainingActions && remainingActions.length > 0 ? remainingActions : undefined,
        };
      }),
    }));
    if (selectedPlayerId === id) setSelection(null);
  };

  const updatePlayer = (id: string, patch: Partial<EditorPlayer>) => {
    applyMutation(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, ...patch } : p),
    }));
  };

  const setPose = (id: string, pose: PoseName | '') => {
    updateActiveStep(s => {
      const current = s.snapshot.poses ?? {};
      const nextPoses = { ...current };
      if (pose === '') delete nextPoses[id];
      else nextPoses[id] = pose;
      return { ...s, snapshot: { ...s.snapshot, poses: Object.keys(nextPoses).length > 0 ? nextPoses : undefined } };
    });
  };

  // -- Metadata ----------------------------------------------------------
  const updateMetadata = (patch: Partial<EditorState['metadata']>) => {
    applyMutation(prev => ({ ...prev, metadata: { ...prev.metadata, ...patch } }));
  };

  // Replace the entire state with the defaults for the new format. This wipes
  // every card and re-creates the standard roster — the caller is responsible
  // for warning the user when there are unsaved edits.
  const applyFormatChange = useCallback((size: TeamSize) => {
    setState(buildDefaultEditorState(size));
    setActiveStepIdx(0);
    setSelection(null);
    setIsDirty(false);
    setPendingFormatChange(null);
  }, []);

  const changeTeamSize = (size: TeamSize) => {
    if (size === state.metadata.teamSize) return;
    if (isDirty) {
      setPendingFormatChange(size);
    } else {
      applyFormatChange(size);
    }
  };

  // -- Summary lists -----------------------------------------------------
  const updateSummary = (field: 'keyPoints' | 'commonMistakes', value: string) => {
    applyMutation(prev => ({
      ...prev,
      summary: { ...prev.summary, [field]: value.split('\n') },
    }));
  };

  // -- Brick markers + badges for the canvas -----------------------------
  // Each marker is one anchor point (impact/to) of a brick — coloured by
  // category, tagged with the first letter of the kind. Markers for the
  // selected player's brick are ALWAYS shown; markers for other players'
  // bricks are conditioned on the showOtherBricks toggle so the canvas
  // doesn't get crowded.
  const brickMarkers: BrickMarker[] = useMemo(() => {
    if (!activeStep?.actions) return [];
    const markers: BrickMarker[] = [];
    for (const brick of activeStep.actions) {
      const isSelectedPlayer = brick.playerId === selectedPlayerId;
      if (!isSelectedPlayer && !showOtherBricks) continue;
      const meta = BRICK_BY_KIND[brick.kind];
      const color = BRICK_CATEGORY_COLORS[meta.category];
      for (const point of brickAnchorPoints(brick)) {
        markers.push({
          brickId: brick.id,
          anchorKey: point.key,
          position: point.pos,
          color,
          tag: brick.kind[0],
          playerId: brick.playerId,
        });
      }
    }
    return markers;
  }, [activeStep, selectedPlayerId, showOtherBricks]);

  // Badge under each player circle that owns a brick. Same visibility rule
  // as markers: always for the selected player, conditional for the rest.
  const brickBadges: PlayerBrickBadge[] = useMemo(() => {
    if (!activeStep?.actions) return [];
    const out: PlayerBrickBadge[] = [];
    for (const brick of activeStep.actions) {
      const isSelectedPlayer = brick.playerId === selectedPlayerId;
      if (!isSelectedPlayer && !showOtherBricks) continue;
      const meta = BRICK_BY_KIND[brick.kind];
      out.push({
        playerId: brick.playerId,
        label: meta.label,
        color: BRICK_CATEGORY_COLORS[meta.category],
      });
    }
    return out;
  }, [activeStep, selectedPlayerId, showOtherBricks]);

  // Brick currently posed on the selected player (if any) — drives the sidebar.
  const selectedPlayerBrick = useMemo(() => {
    if (!selectedPlayerId || !activeStep?.actions) return null;
    return activeStep.actions.find(a => a.playerId === selectedPlayerId) ?? null;
  }, [selectedPlayerId, activeStep]);

  const selectedPlayer = useMemo(
    () => state.players.find(p => p.id === selectedPlayerId) ?? null,
    [state.players, selectedPlayerId],
  );

  // Movement context for the canvas overlay: positions from the previous step
  // (so we can draw ghosts + arrows) and per-player arrow colours derived
  // from each player's brick category.
  const previousSnapshot = activeStepIdx > 0 ? state.steps[activeStepIdx - 1].snapshot : null;
  const previousStep = activeStepIdx > 0 ? state.steps[activeStepIdx - 1] : null;

  // Smash sync indicators — list every jumping brick on the active step and
  // tell the canvas whether each one is properly aligned with the previous
  // step's ball position. Empty when activeStepIdx === 0.
  const smashSyncIndicators: SmashSyncIndicator[] = useMemo(() => {
    return computeSyncStatuses(activeStep ?? null, previousStep);
  }, [activeStep, previousStep]);

  // Movement arrows use the player's OWN colour, so the eye can immediately
  // tie an arrow to its jersey on the canvas. Brick category info is already
  // conveyed by the brick marker ring + the badge under the player.
  const arrowColors = useMemo(() => {
    const out: Record<string, string> = {};
    for (const player of state.players) {
      out[player.id] = player.color;
    }
    return out;
  }, [state.players]);

  // Wrappers that drive add/remove via the sidebar API (bound to the
  // currently-selected player so the sidebar doesn't need to know its id).
  const addBrickForSelected = useCallback((kind: BrickKind) => {
    if (selectedPlayerId) addBrick(kind, selectedPlayerId);
  }, [selectedPlayerId, addBrick]);

  const removeBrickForSelected = useCallback(() => {
    if (selectedPlayerBrick) removeBrick(selectedPlayerBrick.id);
  }, [selectedPlayerBrick, removeBrick]);

  const insertSmashSequenceForSelected = useCallback(() => {
    if (selectedPlayerId) insertSmashSequence(selectedPlayerId);
  }, [selectedPlayerId, insertSmashSequence]);

  // -- Compile + export --------------------------------------------------
  const compiled = useMemo(() => compileScenario(state), [state]);

  // Force the 3D preview to remount whenever the scenario data settles. gsap
  // captures initial positions when the timeline is built and doesn't notice
  // when only inner data (positions, poses) changes while scenario.id is
  // stable — so the only reliable way to pick up edits is to remount.
  // Debounced so a drag doesn't remount the scene on every pixel.
  const [previewKey, setPreviewKey] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setPreviewKey(k => k + 1), 250);
    return () => window.clearTimeout(t);
  }, [compiled]);

  // Modal accessibility: focus Cancel on open, dismiss on Escape. Without this,
  // the dialog announces as modal but offers no keyboard exit.
  useEffect(() => {
    if (pendingFormatChange === null) return;
    cancelFormatChangeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPendingFormatChange(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pendingFormatChange]);

  const exportedText = useMemo(() => {
    return exportFormat === 'json' ? exportJson(state) : exportTypescript(state);
  }, [state, exportFormat]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportedText);
      alert('Copié dans le presse-papier.');
    } catch {
      alert('La copie automatique a échoué — sélectionnez le texte manuellement.');
    }
  };

  const downloadExport = () => {
    const blob = new Blob([exportedText], { type: exportFormat === 'json' ? 'application/json' : 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.metadata.id || 'scenario'}.${exportFormat === 'json' ? 'json' : 'ts'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applyImport = () => {
    try {
      const next = importJson(importText);
      setState(next);
      setActiveStepIdx(0);
      setSelection(null);
      setImportError(null);
      setImportText('');
      setIsDirty(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import impossible.');
    }
  };

  // Decompile a project Scenario into an editable EditorState. Used to migrate
  // handwritten scenarios without rewriting their .ts files: load → tweak →
  // re-export to TypeScript.
  //
  // Decompile is lossy on bricks (handwritten scenarios have none, so it's
  // free for them — but the warning matters for any future scenario that
  // already used bricks before being re-loaded through this path).
  const loadFromProject = (scenarioId: string) => {
    if (!scenarioId) return;
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    if (isDirty && !confirm('Charger ce scénario va écraser tes modifications en cours. Continuer ?')) return;
    const next = decompile(scenario);
    setState(next);
    setActiveStepIdx(0);
    setSelection(null);
    setImportError(null);
    setIsDirty(false);
  };

  const handleFile = (file: File) => {
    file.text().then(text => {
      setImportText(text);
      try {
        const next = importJson(text);
        setState(next);
        setActiveStepIdx(0);
        setSelection(null);
        setImportError(null);
        setIsDirty(false);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import impossible.');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Head
        title="Éditeur de scénarios — Volley-Wiki (interne)"
        description="Outil interne de création de scénarios. Non indexé."
        path="/editor"
        noindex
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--pink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>✎ OUTIL INTERNE</span>
            {isDirty && (
              <span style={{ padding: '2px 8px', border: '2px solid var(--ink)', background: 'var(--yellow)', color: 'var(--ink)', fontSize: 9, letterSpacing: '0.14em' }}>
                MODIFIÉ
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', margin: '0 0 6px 0', letterSpacing: '0.03em' }}>
            ÉDITEUR DE SCÉNARIOS
          </h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
            Placez les joueurs sur le terrain, remplissez la carte, puis ajoutez la suivante. Le code à coller dans le projet est généré en bas de page.
          </p>
        </div>
        <button
          onClick={() => setStoryOpen(true)}
          disabled={state.steps.length === 0}
          title="Lire le scénario carte par carte en plein écran"
          style={{
            border: '2.5px solid var(--ink)',
            background: 'var(--paper)',
            color: 'var(--ink)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.08em',
            padding: '10px 16px',
            cursor: state.steps.length === 0 ? 'not-allowed' : 'pointer',
            opacity: state.steps.length === 0 ? 0.4 : 1,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '2px 2px 0 var(--ink)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14 }}>▶</span>
          MODE RACONTE
        </button>
      </div>

      {/* Quick-open: load any project scenario into the editor */}
      <div style={{ ...card, padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ ...monoLabel, marginBottom: 0, flexShrink: 0 }}>Charger un scénario du projet :</span>
          <select
            style={{ ...input, padding: '5px 7px', flex: '1 1 280px', minWidth: 220 }}
            defaultValue=""
            onChange={e => { loadFromProject(e.target.value); e.target.value = ''; }}
          >
            <option value="" disabled>— choisir un scénario —</option>
            {SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metadata */}
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div>
            <span style={monoLabel}>ID</span>
            <input style={input} value={state.metadata.id} onChange={e => updateMetadata({ id: e.target.value })} placeholder="6v6-attack-foo" />
          </div>
          <div>
            <span style={monoLabel}>Titre</span>
            <input style={input} value={state.metadata.title} onChange={e => updateMetadata({ title: e.target.value })} />
          </div>
          <div>
            <span style={monoLabel}>Format</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {([4, 5, 6] as TeamSize[]).map(n => (
                <button key={n} style={state.metadata.teamSize === n ? btnActive : btn} onClick={() => changeTeamSize(n)}>
                  {n}v{n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={monoLabel}>Phase</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['attack', 'defense', 'reception'] as PhaseKind[]).map(p => (
                <button key={p} style={state.metadata.phase === p ? btnActive : btn} onClick={() => updateMetadata({ phase: p })}>
                  {p === 'attack' ? 'Att.' : p === 'defense' ? 'Déf.' : 'Réc.'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={monoLabel}>Description courte</span>
            <input style={input} value={state.metadata.shortDescription} onChange={e => updateMetadata({ shortDescription: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={monoLabel}>Contexte (badge)</span>
            <input style={input} value={state.metadata.contextLabel} onChange={e => updateMetadata({ contextLabel: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Players panel */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: 0, letterSpacing: '0.06em' }}>
            JOUEURS ({state.players.length})
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ROLE_OPTIONS.map(opt => (
              <button key={opt.value} style={btn} onClick={() => addPlayer(opt.value)}>
                + {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
          {state.players.map(p => {
            const pose = activeStep?.snapshot.poses?.[p.id];
            return (
              <div key={p.id} style={{ border: '2px solid var(--ink)', padding: '8px 10px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: p.color, border: '2px solid var(--ink)', flexShrink: 0 }} />
                  <input style={{ ...input, padding: '4px 6px', fontSize: 11 }} value={p.id} onChange={e => updatePlayer(p.id, { id: e.target.value })} />
                  <button style={{ ...btn, padding: '4px 10px', fontSize: 10 }} onClick={() => removePlayer(p.id)} title="Supprimer">×</button>
                </div>
                <input style={{ ...input, padding: '4px 6px', fontSize: 11 }} value={p.label} onChange={e => updatePlayer(p.id, { label: e.target.value })} placeholder="Libellé" />
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
                  <label style={{ flexShrink: 0, opacity: 0.7 }}>Pose :</label>
                  <select
                    style={{ ...input, padding: '4px 6px', fontSize: 11 }}
                    value={pose ?? ''}
                    onChange={e => setPose(p.id, e.target.value as PoseName | '')}
                  >
                    <option value="">— aucune —</option>
                    {POSE_OPTIONS.map(po => <option key={po} value={po}>{po}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step editor */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: 0, letterSpacing: '0.06em' }}>
            CARTE {activeStepIdx + 1} / {state.steps.length}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button style={btn} onClick={() => goToStep(activeStepIdx - 1)} disabled={activeStepIdx === 0}>◀ Préc.</button>
            <button style={btn} onClick={() => goToStep(activeStepIdx + 1)} disabled={activeStepIdx >= state.steps.length - 1}>Suiv. ▶</button>
            <button style={btn} onClick={() => moveStep(-1)} disabled={activeStepIdx === 0}>↑</button>
            <button style={btn} onClick={() => moveStep(1)} disabled={activeStepIdx >= state.steps.length - 1}>↓</button>
            <button style={btn} onClick={duplicateStep}>Dupliquer</button>
            <button style={btn} onClick={deleteStep} disabled={state.steps.length <= 1}>Supprimer</button>
            <button style={btnActive} onClick={addStep}>+ Nouvelle carte</button>
          </div>
        </div>

        {activeStep && (
          <>
          {/* Top row: terrain left (wide, dominant) + contextual sidebar right.
              The sidebar adapts to the selection (player / ball / nothing) so
              the secondary controls live inline with what the author touches. */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 16, alignItems: 'stretch' }}>
            <div style={{ minWidth: 0 }}>
              <EditorCanvas
                players={state.players}
                positions={activeStep.snapshot.positions}
                ballPosition={activeStep.snapshot.ballPosition}
                selection={selection}
                onSelect={setSelection}
                onMovePlayer={onMovePlayer}
                onMoveBall={onMoveBall}
                brickMarkers={brickMarkers}
                onMoveBrickMarker={moveBrickMarker}
                brickBadges={brickBadges}
                previousPositions={previousSnapshot?.positions}
                previousBallPosition={previousSnapshot?.ballPosition}
                arrowColors={arrowColors}
                ballAttachedTo={activeStep.snapshot.ballAttachedTo}
                smashSyncIndicators={smashSyncIndicators}
              />
            </div>
            <ContextSidebar
              selectedPlayer={selectedPlayer}
              ballSelected={selection?.kind === 'ball'}
              playerBrick={selectedPlayerBrick}
              ballHeight={activeStep.snapshot.ballPosition[1]}
              ballTrajectory={activeStep.ballTrajectory}
              previousBallHeight={previousSnapshot?.ballPosition[1]}
              showBallTrajectory={activeStepIdx > 0}
              showOtherBricks={showOtherBricks}
              onToggleShowOtherBricks={setShowOtherBricks}
              onAddBrick={addBrickForSelected}
              onRemoveBrick={removeBrickForSelected}
              onInsertSmashSequence={insertSmashSequenceForSelected}
              onSetBallHeight={setBallHeight}
              onSetBallCurve={setBallCurve}
              onSetBallApex={setBallApex}
            />
          </div>

          {/* Bottom strip: title + description on the left, tempo on the right.
              Side-by-side to keep the eye close to the canvas above. */}
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 14, alignItems: 'start' }}>
            <StepBlock number={1} title="Décris ce qui se passe">
              <div>
                <span style={monoLabel}>Titre de la carte</span>
                <input
                  style={input}
                  value={activeStep.title}
                  onChange={e => updateActiveStep(s => ({ ...s, title: e.target.value }))}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={monoLabel}>Description</span>
                <textarea
                  style={{ ...input, minHeight: 90, lineHeight: 1.5, resize: 'vertical' }}
                  value={activeStep.description}
                  onChange={e => updateActiveStep(s => ({ ...s, description: e.target.value }))}
                />
              </div>
            </StepBlock>

            <StepBlock number={2} title="Tempo">
              <TempoPicker
                value={activeStep.tempo}
                onChange={t => updateActiveStep(s => ({ ...s, tempo: t }))}
                isFirstStep={activeStepIdx === 0}
              />
            </StepBlock>
          </div>

          {/* Per-card readiness checklist — appears below the two columns and
              spells out exactly what's required vs optional. The "+ Nouvelle
              carte" button is mirrored here as the natural next step. */}
          <CardReadiness
            step={activeStep}
            playerCount={state.players.length}
            onAddNext={addStep}
          />
          </>
        )}

        {/* Visual timeline of cards (replaces the previous text-only strip) */}
        <div style={{ marginTop: 14 }}>
          <CardTimeline steps={state.steps} activeIdx={activeStepIdx} onJump={goToStep} />
        </div>
      </div>

      {/* Summary editor */}
      <div style={card}>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: '0 0 10px 0', letterSpacing: '0.06em' }}>
          RÉSUMÉ FINAL
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div>
            <span style={monoLabel}>Points clés (un par ligne)</span>
            <textarea
              style={{ ...input, minHeight: 100, lineHeight: 1.5, resize: 'vertical' }}
              value={state.summary.keyPoints.join('\n')}
              onChange={e => updateSummary('keyPoints', e.target.value)}
            />
          </div>
          <div>
            <span style={monoLabel}>Erreurs fréquentes (une par ligne)</span>
            <textarea
              style={{ ...input, minHeight: 100, lineHeight: 1.5, resize: 'vertical' }}
              value={state.summary.commonMistakes.join('\n')}
              onChange={e => updateSummary('commonMistakes', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div style={card}>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: '0 0 10px 0', letterSpacing: '0.06em' }}>
          APERÇU 3D
        </h2>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Chargement…</div>}>
          <ScenarioPlayer key={`preview-${previewKey}`} scenario={compiled} hideHeader disableAutoFill />
        </Suspense>
      </div>

      {/* Import / Export */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: 0, letterSpacing: '0.06em' }}>EXPORT / IMPORT</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={exportFormat === 'json' ? btnActive : btn} onClick={() => setExportFormat('json')}>JSON</button>
            <button style={exportFormat === 'ts' ? btnActive : btn} onClick={() => setExportFormat('ts')}>TypeScript</button>
          </div>
        </div>

        <textarea
          style={{ ...input, minHeight: 220, fontSize: 11, lineHeight: 1.4, resize: 'vertical' }}
          value={exportedText}
          readOnly
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button style={btnActive} onClick={copyExport}>Copier</button>
          <button style={btn} onClick={downloadExport}>Télécharger</button>
        </div>

        <div style={{ marginTop: 18, borderTop: '2px dashed rgba(26,24,18,0.18)', paddingTop: 14 }}>
          <span style={monoLabel}>Importer une configuration (JSON)</span>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
            <button style={btn} onClick={() => fileInputRef.current?.click()}>Choisir un fichier…</button>
            <button style={btnActive} onClick={applyImport} disabled={!importText.trim()}>Appliquer le JSON ci-dessous</button>
          </div>
          <textarea
            style={{ ...input, minHeight: 100, fontSize: 11, lineHeight: 1.4, resize: 'vertical' }}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Collez ici un JSON exporté précédemment…"
          />
          {importError && (
            <div style={{ marginTop: 8, color: 'var(--orange)', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>
              Erreur : {importError}
            </div>
          )}
        </div>
      </div>

      {/* Story mode — full-screen narrative reader for the whole scenario */}
      {storyOpen && (
        <StoryMode
          steps={state.steps}
          startAt={activeStepIdx}
          onClose={() => setStoryOpen(false)}
        />
      )}

      {/* Confirmation modal — changing format wipes every player and card. */}
      {pendingFormatChange !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="format-change-title"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(26,24,18,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            zIndex: 100,
          }}
          onClick={() => setPendingFormatChange(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 520, width: '100%',
              background: 'var(--paper)',
              border: '3px solid var(--ink)',
              boxShadow: 'var(--shadow)',
              padding: '24px 26px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}
          >
            <h3 id="format-change-title" style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, letterSpacing: '0.04em', margin: 0 }}>
              CHANGER POUR {pendingFormatChange}v{pendingFormatChange} ?
            </h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--ink)' }}>
              Cela va <strong>remplacer la liste des joueurs</strong> par la formation par défaut du {pendingFormatChange}v{pendingFormatChange} et <strong>réinitialiser toutes les cartes</strong>. Vos modifications en cours seront perdues.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button ref={cancelFormatChangeRef} style={btn} onClick={() => setPendingFormatChange(null)}>Annuler</button>
              <button style={btnActive} onClick={() => applyFormatChange(pendingFormatChange)}>
                Confirmer — repartir de zéro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function nextPlayerId(existing: { id: string }[], role: PlayerRole): string {
  const prefix = role === 'opponent' ? 'OPP' : role.slice(0, 2).toUpperCase();
  let i = 1;
  while (existing.some(p => p.id === `${prefix}${i}`)) i++;
  return `${prefix}${i}`;
}

function nextBrickId(existing: { id: string }[]): string {
  let i = 1;
  while (existing.some(b => b.id === `b${i}`)) i++;
  return `b${i}`;
}

// Reserve `count` step ids that won't collide with any existing one. Each
// returned id is checked individually (rather than `first + offset`) so a gap
// like [s1, s3] correctly produces [s2, s4] for count=2 instead of {s2, s3}.
function reserveStepIds(existing: { id: string }[], count: number): string[] {
  const ids: string[] = [];
  let i = 1;
  while (ids.length < count) {
    const candidate = `s${i++}`;
    if (!existing.some(s => s.id === candidate)) ids.push(candidate);
  }
  return ids;
}


// Auto-pose policy when the ball sits on top of a teammate:
// - Player at the net (|z| < 1.5m) → SPIKE on attack, ARM_SPIKE (block) on defense/reception
// - Player away from the net → SET (passe haute)
// Opponents and balls that are airborne too high (y > 3.5m) are ignored — those
// are typically arc trajectories, not contact moments.
const HIT_RADIUS = 0.9;
const NET_ZONE_Z = 1.5;
const MAX_CONTACT_HEIGHT = 3.5;
const AUTO_POSES: ReadonlySet<PoseName> = new Set(['SET', 'BUMP', 'SPIKE', 'ARM_SPIKE']);

function recomputeContactPose(
  state: EditorState,
  prevPoses: Record<string, PoseName> | undefined,
  positions: Record<string, [number, number, number]>,
  ballPosition: [number, number, number],
): Record<string, PoseName> | undefined {
  // Start by clearing any previous auto-contact poses — only manual READY/RESET stay.
  const next: Record<string, PoseName> = {};
  if (prevPoses) {
    for (const [id, pose] of Object.entries(prevPoses)) {
      if (!AUTO_POSES.has(pose)) next[id] = pose;
    }
  }

  if (ballPosition[1] <= MAX_CONTACT_HEIGHT) {
    let hitId: string | null = null;
    let hitPos: [number, number, number] | null = null;
    let minDist = HIT_RADIUS;
    for (const player of state.players) {
      if (player.role === 'opponent') continue;
      const pos = positions[player.id];
      if (!pos) continue;
      const d = Math.hypot(pos[0] - ballPosition[0], pos[2] - ballPosition[2]);
      if (d < minDist) {
        minDist = d;
        hitId = player.id;
        hitPos = pos;
      }
    }
    if (hitId && hitPos) {
      const atNet = Math.abs(hitPos[2]) < NET_ZONE_Z;
      const phase = state.metadata.phase;
      next[hitId] = atNet
        ? (phase === 'attack' ? 'SPIKE' : 'ARM_SPIKE')
        : 'SET';
    }
  }

  return Object.keys(next).length > 0 ? next : undefined;
}
