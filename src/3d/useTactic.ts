import { useEffectEvent, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import type { BallWithTrailRef } from './BallWithTrail';
import type { PlayerRef } from './Player';
import type { TimelineAction } from '../scenarios/types';

export type TacticScript = {
  id: string;
  timeline: readonly TimelineAction[];
};

export type PlayerRefMap = Record<string, PlayerRef | null>;

export const useTactic = (
  playerRefs: React.MutableRefObject<PlayerRefMap>,
  ballRef: React.RefObject<BallWithTrailRef | null>,
  script: TacticScript,
  onUpdate?: (progress: number, actionIndex: number) => void,
  onImpact?: (position: THREE.Vector3) => void,
  autoplay: boolean = false
) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMountedRef = useRef(true);

  // The timeline is rebuilt only when the script changes. The callbacks are
  // read through effect events so the timeline always reaches the latest ones
  // without being rebuilt when their identity changes.
  const hasImpactHandler = onImpact !== undefined;
  const emitUpdate = useEffectEvent((progress: number, actionIndex: number) => {
    onUpdate?.(progress, actionIndex);
  });
  const emitImpact = useEffectEvent((position: THREE.Vector3) => {
    onImpact?.(position);
  });

  useLayoutEffect(() => {
    if (!script?.timeline) return;
    isMountedRef.current = true;
    if (timelineRef.current) timelineRef.current.kill();

    const initialPositions: Record<string, { x: number; y: number; z: number }> = {};
    const initialRotations: Record<string, number> = {};
    Object.keys(playerRefs.current).forEach(id => {
      const p = playerRefs.current[id];
      if (p?.group?.current) {
        initialPositions[id] = { x: p.group.current.position.x, y: p.group.current.position.y, z: p.group.current.position.z };
        initialRotations[id] = p.group.current.rotation.y;
      }
    });

    const ballMesh = ballRef.current?.mesh;
    const initialBallPos = ballMesh ? { x: ballMesh.position.x, y: ballMesh.position.y, z: ballMesh.position.z } : null;

    const resetScene = () => {
      Object.keys(playerRefs.current).forEach(id => {
        const p = playerRefs.current[id];
        if (p) {
          if (p.rightShoulder?.current && p.leftShoulder?.current) {
            p.rightShoulder.current.rotation.x = 0; p.rightShoulder.current.rotation.z = 0;
            p.leftShoulder.current.rotation.x = 0; p.leftShoulder.current.rotation.z = 0;
          }
          if (p.group?.current && initialPositions[id]) {
            p.group.current.position.x = initialPositions[id].x;
            p.group.current.position.y = initialPositions[id].y;
            p.group.current.position.z = initialPositions[id].z;
          }
          if (p.group?.current && initialRotations[id] !== undefined) {
            p.group.current.rotation.y = initialRotations[id];
          }
        }
      });
      if (ballRef.current && initialBallPos) {
        const mesh = ballRef.current.mesh;
        if (mesh) { mesh.position.x = initialBallPos.x; mesh.position.y = initialBallPos.y; mesh.position.z = initialBallPos.z; }
        ballRef.current.resetTrail([initialBallPos.x, initialBallPos.y, initialBallPos.z]);
      }
    };

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        if (!isMountedRef.current || !timelineRef.current) return;
        const time = timelineRef.current.time();
        let currentIndex = 0;
        for (let i = 0; i < script.timeline.length; i++) {
          if (time >= script.timeline[i].time) currentIndex = i;
        }
        emitUpdate(timelineRef.current.progress(), currentIndex);
      },
      onComplete: () => { if (isMountedRef.current) resetScene(); },
      onStart: () => { if (isMountedRef.current) resetScene(); },
    });

    timelineRef.current = tl;
    tl.call(() => resetScene(), [], 0);

    script.timeline.forEach((action) => {
      if (action.type === 'ball_move') {
        const mesh = ballRef.current?.mesh;
        if (mesh) {
          // Resolve trajectory: explicit curve+apex wins, otherwise fall back to legacy arc.
          const explicitCurve: 'arc' | 'flat' | 'floater' | null = action.curve ?? null;
          const curve: 'arc' | 'flat' | 'floater' = explicitCurve
            ?? (action.arc === false ? 'flat' : 'arc');
          const apex = action.apex
            ?? (typeof action.arc === 'number' ? action.arc : Math.max(action.from[1], action.to[1], 2.5));

          // A carried ball moves with the player holding it, at his pace.
          const groundEase = action.carried ? 'power1.inOut' : 'none';
          tl.to(mesh.position, { x: action.to[0], z: action.to[2], duration: action.duration, ease: groundEase }, action.time);

          if (curve === 'flat') {
            tl.to(mesh.position, { y: action.to[1], duration: action.duration, ease: groundEase }, action.time);
          } else if (curve === 'floater') {
            // Slow rise, then sharp drop — the signature of a float serve that « tombe » brusquement.
            tl.to(mesh.position, { y: apex, duration: action.duration * 0.7, ease: 'power1.out' }, action.time);
            tl.to(mesh.position, { y: action.to[1], duration: action.duration * 0.3, ease: 'power3.in' }, action.time + action.duration * 0.7);
          } else {
            // Constant-gravity parabola. The horizontal motion is linear, so
            // the ball reaches the apex at the fraction of the flight where
            // rise and fall times match the heights climbed and dropped
            // (t ∝ √h): a ball dropped from its apex falls straight away, a
            // set climbing onto a high hand peaks late.
            const peak = Math.max(apex, action.from[1], action.to[1]);
            const rise = Math.sqrt(peak - action.from[1]);
            const fall = Math.sqrt(peak - action.to[1]);
            const apexAt = rise + fall > 0 ? rise / (rise + fall) : 0.5;
            const riseDur = action.duration * apexAt;
            const fallDur = action.duration - riseDur;
            if (riseDur > 0) {
              tl.to(mesh.position, { y: peak, duration: riseDur, ease: 'power1.out' }, action.time);
            }
            if (fallDur > 0) {
              tl.to(mesh.position, { y: action.to[1], duration: fallDur, ease: 'power1.in' }, action.time + riseDur);
            }
          }

          if (hasImpactHandler) {
            tl.call(() => { if (!isMountedRef.current) return; const m = ballRef.current?.mesh; if (m) emitImpact(m.position); }, [], action.time + action.duration);
          }
        }
      }
      if (action.type === 'player_move') {
        const p = playerRefs.current[action.id];
        if (p?.group?.current) {
          tl.to(p.group.current.position, { x: action.to[0], y: action.to[1], z: action.to[2], duration: action.duration, ease: 'power1.inOut' }, action.time);
        }
      }
      if (action.type === 'player_face') {
        const p = playerRefs.current[action.id];
        if (p?.group?.current) {
          tl.to(p.group.current.rotation, { y: action.rotation, duration: action.duration, ease: 'power1.inOut' }, action.time);
        }
      }
      if (action.type === 'player_pose') {
        const p = playerRefs.current[action.id];
        if (p) {
          const arms = (rx: number, rz: number, lx: number, lz: number) => {
            tl.to(p.rightShoulder.current.rotation, { x: rx, z: rz, duration: action.duration }, action.time);
            tl.to(p.leftShoulder.current.rotation, { x: lx, z: lz, duration: action.duration }, action.time);
          };
          if (hasImpactHandler && ['BUMP', 'SET', 'SPIKE'].includes(action.pose)) {
            tl.call(() => { if (!isMountedRef.current) return; const m = ballRef.current?.mesh; if (m) emitImpact(m.position); }, [], action.time);
          }
          switch (action.pose) {
            case 'BUMP': arms(-Math.PI / 3, Math.PI / 12, -Math.PI / 3, -Math.PI / 12); break;
            case 'SET': arms(-Math.PI * 0.65, Math.PI / 6, -Math.PI * 0.65, -Math.PI / 6); break;
            case 'ARM_SPIKE': arms(-Math.PI * 1.1, 0.2, -Math.PI * 0.7, 0); break;
            // The strike whips the arm from the cocked ARM_SPIKE position over
            // the top and finishes down in front of the body.
            case 'SPIKE': arms(-Math.PI / 6, -0.3, 0, 0); break;
            case 'READY': arms(-Math.PI / 8, 0, -Math.PI / 8, 0); break;
            case 'RESET': arms(0, 0, 0, 0); break;
          }
        }
      }
    });

    if (autoplay) tl.play();

    return () => {
      isMountedRef.current = false;
      if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
    };
    // playerRefs and ballRef are stable ref objects, autoplay and
    // hasImpactHandler are constant for each caller: in practice the timeline
    // is rebuilt only when the script changes, as before.
  }, [script, playerRefs, ballRef, autoplay, hasImpactHandler]);

  return timelineRef;
};
