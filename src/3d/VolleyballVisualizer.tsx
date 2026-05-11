import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Court } from './Court';
import { Player } from './Player';
import { BallWithTrail } from './BallWithTrail';
import type { BallWithTrailRef } from './BallWithTrail';
import { ImpactEffect } from './ImpactEffect';
import type { ImpactEffectRef } from './ImpactEffect';
import { useTactic } from './useTactic';
import { CAMERA_PRESETS, useCameraControls } from './useCameraControls';
import type { CameraPresetKey } from './useCameraControls';

const BUMP_SET_SPIKE_SCRIPT = {
  id: 'bump_set_spike',
  timeline: [
    { time: 0, type: 'ball_move', from: [0, 2.8, -9], to: [-1, 1.2, 3], duration: 1.0, arc: 3.0, description: 'Service adverse rapide vers le libéro' },
    { time: 0.3, type: 'player_pose', id: 'P1', pose: 'READY', duration: 0.1, description: 'Le Libéro annonce sa prise de balle', text: "J'ai !" },
    { time: 1.0, type: 'player_pose', id: 'P1', pose: 'BUMP', duration: 0.2, description: 'Réception (Manchette) parfaite du Libéro' },
    { time: 1.0, type: 'ball_move', from: [-1, 1.2, 3], to: [2, 1.9, 0.5], duration: 1.0, arc: 3.5, description: 'Ballon haut vers la zone du passeur' },
    { time: 1.2, type: 'player_move', id: 'P2', to: [2, 0, 0.5], duration: 0.5, description: 'Le passeur pénètre sous le ballon' },
    { time: 2.0, type: 'player_pose', id: 'P2', pose: 'SET', duration: 0.2, description: "Passe en touche vers l'aile (Poste 4)" },
    { time: 2.0, type: 'ball_move', from: [2, 1.9, 0.5], to: [-3.5, 3.6, 0.5], duration: 0.8, arc: 4.0, description: "Trajectoire en cloche pour l'attaquant" },
    { time: 2.2, type: 'player_move', id: 'P3', to: [-3.5, 0, 1.0], duration: 0.4, description: "L'attaquant prend sa course d'élan" },
    { time: 2.6, type: 'player_move', id: 'P3', to: [-3.5, 2.0, 0.5], duration: 0.2, description: 'Impulsion verticale' },
    { time: 2.6, type: 'player_pose', id: 'P3', pose: 'ARM_SPIKE', duration: 0.2, description: "Armé du bras : Coder l'épaule" },
    { time: 2.8, type: 'player_pose', id: 'P3', pose: 'SPIKE', duration: 0.1, description: 'Attaque : Fouetté du bras vers le bas' },
    { time: 2.8, type: 'ball_move', from: [-3.5, 3.6, 0.5], to: [2, 0, -6], duration: 0.4, arc: false, description: 'Le ballon touche le sol adverse' },
    { time: 3.0, type: 'player_move', id: 'P3', to: [-3.5, 0, 0.2], duration: 0.2, description: 'Réception équilibrée' },
  ],
};

const PLAYERS_CONFIG = [
  { id: 'P1', label: 'Libero', color: '#ec4899', position: [-1, 0, 3] as [number, number, number] },
  { id: 'P2', label: 'Passeur', color: '#e74c3c', position: [1, 0, 1] as [number, number, number] },
  { id: 'P3', label: 'Attaquant', color: '#3498db', position: [-3.5, 0, 3] as [number, number, number] },
];

type SceneProps = {
  playerRefs: React.MutableRefObject<Record<string, any>>;
  controllerRef: React.MutableRefObject<gsap.core.Timeline | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  onUpdate: (progress: number, actionIndex: number) => void;
  showTrail: boolean;
};

const CameraSetup: React.FC<{ cameraRef: React.RefObject<THREE.PerspectiveCamera | null> }> = ({ cameraRef }) => {
  const { camera } = useThree();
  useEffect(() => {
    (cameraRef as React.MutableRefObject<THREE.PerspectiveCamera | null>).current = camera as THREE.PerspectiveCamera;
  }, [camera, cameraRef]);
  return null;
};

const Scene: React.FC<SceneProps> = ({ playerRefs, controllerRef, cameraRef, onUpdate, showTrail }) => {
  const ballRef = useRef<BallWithTrailRef>(null);
  const impactRef = useRef<ImpactEffectRef>(null);

  const handleImpact = (pos: THREE.Vector3) => {
    impactRef.current?.trigger(pos);
  };

  const timelineRef = useTactic(playerRefs, ballRef, BUMP_SET_SPIKE_SCRIPT, onUpdate, handleImpact, true);

  useEffect(() => {
    if (timelineRef?.current) controllerRef.current = timelineRef.current;
  }, [timelineRef, controllerRef]);

  return (
    <>
      <CameraSetup cameraRef={cameraRef} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} target={[0, 1, 0]} maxPolarAngle={Math.PI / 2 - 0.05} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Court />
      {PLAYERS_CONFIG.map(player => (
        <Player
          key={player.id}
          ref={el => { playerRefs.current[player.id] = el; }}
          color={player.color}
          position={player.position}
        />
      ))}
      <BallWithTrail ref={ballRef} position={[0, 2.8, -9]} showTrail={showTrail} />
      <ImpactEffect ref={impactRef} />
    </>
  );
};

type VolleyballVisualizerProps = {
  autoplay?: boolean;
};

const btnBase: React.CSSProperties = {
  fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em',
  border: '1.5px solid var(--ink)', background: 'var(--cream)', color: 'var(--ink)',
  cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const btnActiveStyle: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)' };

export default function VolleyballVisualizer({ autoplay = true }: VolleyballVisualizerProps) {
  const controllerRef = useRef<gsap.core.Timeline | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerRefs = useRef<Record<string, any>>({});

  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasStarted, setHasStarted] = useState(autoplay);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentDescription, setCurrentDescription] = useState('Prêt ?');
  const [showTrail, setShowTrail] = useState(true);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraPresetKey>('DEFAULT');

  const { animateToPreset } = useCameraControls(cameraRef);

  const handleUpdate = useCallback((prog: number, actionIndex: number) => {
    const action = BUMP_SET_SPIKE_SCRIPT.timeline[actionIndex];
    if (action?.description) setCurrentDescription(action.description);
    setProgress(prog);
  }, []);

  const handlePresetChange = useCallback((preset: CameraPresetKey) => {
    animateToPreset(preset);
    setCurrentCameraPreset(preset);
  }, [animateToPreset]);

  const togglePlay = () => {
    if (!controllerRef.current) return;
    if (isPlaying) { controllerRef.current.pause(); }
    else { controllerRef.current.play(); if (!hasStarted) setHasStarted(true); }
    setIsPlaying(p => !p);
  };

  const handleStart = () => {
    if (controllerRef.current && !hasStarted) {
      controllerRef.current.restart();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const restart = () => {
    if (!controllerRef.current) return;
    controllerRef.current.restart();
    setIsPlaying(true);
  };

  const stepForward = () => {
    if (!controllerRef.current) return;
    const t = controllerRef.current.time();
    const next = BUMP_SET_SPIKE_SCRIPT.timeline.find(a => a.time > t + 0.01);
    controllerRef.current.time(next ? next.time : t + 0.5);
  };

  const stepBackward = () => {
    if (!controllerRef.current) return;
    const t = controllerRef.current.time();
    const prevs = BUMP_SET_SPIKE_SCRIPT.timeline.filter(a => a.time < t - 0.01);
    const prev = prevs[prevs.length - 1];
    controllerRef.current.time(prev ? prev.time : Math.max(0, t - 0.5));
  };

  const toggleSpeed = () => {
    if (!controllerRef.current) return;
    const newSpeed = speed === 1 ? 0.5 : 1;
    controllerRef.current.timeScale(newSpeed);
    setSpeed(newSpeed);
  };

  return (
    <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow)', fontFamily: '"DM Mono", monospace' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid var(--ink)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)' }}>Technique: Réception — Passe — Attaque</span>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(Object.keys(CAMERA_PRESETS) as CameraPresetKey[]).map(key => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              style={currentCameraPreset === key ? btnActiveStyle : btnBase}
            >
              {CAMERA_PRESETS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ position: 'relative', height: 360 }}>
        <Canvas shadows="percentage" camera={{ position: [0, 5, 10], fov: 50 }}>
          <Scene
            playerRefs={playerRefs}
            controllerRef={controllerRef}
            cameraRef={cameraRef}
            onUpdate={handleUpdate}
            showTrail={showTrail}
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
              border: '2.5px solid var(--ink)', boxShadow: 'var(--shadow)', marginBottom: 10,
            }}>
              <span style={{ fontSize: 36, marginLeft: 4, color: '#fff' }}>▶</span>
            </div>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--cream)', textTransform: 'uppercase' }}>Cliquer pour lancer</span>
          </div>
        )}

        {/* Description overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(26,24,18,0.78)', padding: '6px 14px', textAlign: 'center' }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--cream)' }}>{currentDescription}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'var(--paper)', borderTop: '1.5px solid var(--ink)' }}>
        <div style={{ height: '100%', background: 'var(--orange)', transition: 'width 0.1s', width: `${progress * 100}%` }} />
      </div>

      {/* Controls */}
      <div style={{ borderTop: '2px solid var(--ink)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={toggleSpeed} style={{ ...btnBase, minWidth: 42 }}>{speed}x</button>
          <button
            onClick={() => setShowTrail(t => !t)}
            style={showTrail ? btnActiveStyle : btnBase}
          >
            Trail
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={stepBackward} style={{ ...btnBase, width: 36, height: 36 }}>⏮</button>
          <button
            onClick={togglePlay}
            style={{ width: 48, height: 48, background: 'var(--orange)', border: '2.5px solid var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={stepForward} style={{ ...btnBase, width: 36, height: 36 }}>⏭</button>
          <button onClick={restart} style={{ ...btnBase, width: 36, height: 36 }}>↺</button>
        </div>

        {/* Player legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {PLAYERS_CONFIG.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, border: '1.5px solid var(--ink)', backgroundColor: p.color }} />
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.75 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
