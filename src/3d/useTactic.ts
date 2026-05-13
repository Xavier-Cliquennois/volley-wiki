import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import type { BallWithTrailRef } from './BallWithTrail';

export const useTactic = (
  playerRefs: React.MutableRefObject<Record<string, any>>,
  ballRef: React.RefObject<BallWithTrailRef | null>,
  script: any,
  onUpdate?: (progress: number, actionIndex: number) => void,
  onImpact?: (position: THREE.Vector3) => void,
  autoplay: boolean = false
) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMountedRef = useRef(true);

  useLayoutEffect(() => {
    if (!script?.timeline) return;
    isMountedRef.current = true;
    if (timelineRef.current) timelineRef.current.kill();

    const initialPositions: Record<string, { x: number; y: number; z: number }> = {};
    Object.keys(playerRefs.current).forEach(id => {
      const p = playerRefs.current[id];
      if (p?.group?.current) {
        initialPositions[id] = { x: p.group.current.position.x, y: p.group.current.position.y, z: p.group.current.position.z };
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
        if (!isMountedRef.current || !onUpdate || !timelineRef.current) return;
        const time = timelineRef.current.time();
        let currentIndex = 0;
        for (let i = 0; i < script.timeline.length; i++) {
          if (time >= script.timeline[i].time) currentIndex = i;
        }
        onUpdate(timelineRef.current.progress(), currentIndex);
      },
      onComplete: () => { if (isMountedRef.current) resetScene(); },
      onStart: () => { if (isMountedRef.current) resetScene(); },
    });

    timelineRef.current = tl;
    tl.call(() => resetScene(), [], 0);

    script.timeline.forEach((action: any) => {
      if (action.type === 'ball_move') {
        const mesh = ballRef.current?.mesh;
        if (mesh) {
          // Resolve trajectory: explicit curve+apex wins, otherwise fall back to legacy arc.
          const explicitCurve: 'arc' | 'flat' | 'floater' | null = action.curve ?? null;
          const curve: 'arc' | 'flat' | 'floater' = explicitCurve
            ?? (action.arc === false ? 'flat' : 'arc');
          const apex = action.apex
            ?? (typeof action.arc === 'number' ? action.arc : Math.max(action.from[1], action.to[1], 2.5));

          tl.to(mesh.position, { x: action.to[0], z: action.to[2], duration: action.duration, ease: 'none' }, action.time);

          if (curve === 'flat') {
            tl.to(mesh.position, { y: action.to[1], duration: action.duration, ease: 'none' }, action.time);
          } else if (curve === 'floater') {
            // Slow rise, then sharp drop — the signature of a float serve that « tombe » brusquement.
            tl.to(mesh.position, { y: apex, duration: action.duration * 0.7, ease: 'power1.out' }, action.time);
            tl.to(mesh.position, { y: action.to[1], duration: action.duration * 0.3, ease: 'power3.in' }, action.time + action.duration * 0.7);
          } else {
            // Symmetric parabola.
            tl.to(mesh.position, { y: apex, duration: action.duration / 2, ease: 'power1.out' }, action.time);
            tl.to(mesh.position, { y: action.to[1], duration: action.duration / 2, ease: 'power1.in' }, action.time + action.duration / 2);
          }

          if (onImpact) {
            tl.call(() => { if (!isMountedRef.current) return; const m = ballRef.current?.mesh; if (m) onImpact(m.position); }, [], action.time + action.duration);
          }
        }
      }
      if (action.type === 'player_move') {
        const p = playerRefs.current[action.id];
        if (p?.group?.current) {
          tl.to(p.group.current.position, { x: action.to[0], y: action.to[1], z: action.to[2], duration: action.duration, ease: 'power1.inOut' }, action.time);
        }
      }
      if (action.type === 'player_pose') {
        const p = playerRefs.current[action.id];
        if (p) {
          const arms = (rx: number, rz: number, lx: number, lz: number) => {
            tl.to(p.rightShoulder.current.rotation, { x: rx, z: rz, duration: action.duration }, action.time);
            tl.to(p.leftShoulder.current.rotation, { x: lx, z: lz, duration: action.duration }, action.time);
          };
          if (onImpact && ['BUMP', 'SET', 'SPIKE'].includes(action.pose)) {
            tl.call(() => { if (!isMountedRef.current) return; const m = ballRef.current?.mesh; if (m) onImpact(m.position); }, [], action.time);
          }
          switch (action.pose) {
            case 'BUMP': arms(-Math.PI / 3, Math.PI / 12, -Math.PI / 3, -Math.PI / 12); break;
            case 'SET': arms(-Math.PI * 0.65, Math.PI / 6, -Math.PI * 0.65, -Math.PI / 6); break;
            case 'ARM_SPIKE': arms(-Math.PI * 1.1, 0.2, -Math.PI * 0.7, 0); break;
            case 'SPIKE': arms(Math.PI / 3, -0.5, 0, 0); break;
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
  }, [script]);

  return timelineRef;
};
