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
    { time: 2.0, type: 'player_pose', id: 'P2', pose: 'SET', duration: 0.2, description: 'Passe en touche vers l\'aile (Poste 4)' },
    { time: 2.0, type: 'ball_move', from: [2, 1.9, 0.5], to: [-3.5, 3.6, 0.5], duration: 0.8, arc: 4.0, description: 'Trajectoire en cloche pour l\'attaquant' },
    { time: 2.2, type: 'player_move', id: 'P3', to: [-3.5, 0, 1.0], duration: 0.4, description: "L'attaquant prend sa course d'élan" },
    { time: 2.6, type: 'player_move', id: 'P3', to: [-3.5, 2.0, 0.5], duration: 0.2, description: 'Impulsion verticale' },
    { time: 2.6, type: 'player_pose', id: 'P3', pose: 'ARM_SPIKE', duration: 0.2, description: 'Armé du bras : Coder l\'épaule' },
    { time: 2.8, type: 'player_pose', id: 'P3', pose: 'SPIKE', duration: 0.1, description: 'Attaque : Fouetté du bras vers le bas' },
    { time: 2.8, type: 'ball_move', from: [-3.5, 3.6, 0.5], to: [2, 0, -6], duration: 0.4, arc: false, description: 'Le ballon touche le sol adverse' },
    { time: 3.0, type: 'player_move', id: 'P3', to: [-3.5, 0, 0.2], duration: 0.2, description: 'Réception équilibrée' },
  ],
};

const PLAYERS_CONFIG = [
  { id: 'P1', label: 'Libero', color: '#f1c40f', position: [-1, 0, 3] as [number, number, number] },
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
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} target={[0, 1, 0]} />
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
    <div className="border-2 border-gray-700 bg-gray-900 font-mono">
      {/* Header */}
      <div className="border-b-2 border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-yellow-400 text-xs uppercase tracking-wider">Technique: Réception — Passe — Attaque</span>
        <div className="flex gap-1">
          {(Object.keys(CAMERA_PRESETS) as CameraPresetKey[]).map(key => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`px-2 py-1 text-xs border ${currentCameraPreset === key ? 'bg-yellow-400 text-black border-yellow-400' : 'text-gray-400 border-gray-600 hover:border-gray-400'}`}
            >
              {CAMERA_PRESETS[key].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative" style={{ height: 360 }}>
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
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer"
            onClick={handleStart}
          >
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-yellow-600 mb-3">
              <span className="text-4xl ml-1">▶</span>
            </div>
            <span className="text-white text-xs">Cliquer pour lancer</span>
          </div>
        )}

        {/* Description overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-2 text-center">
          <span className="text-white text-xs">{currentDescription}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t-2 border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={toggleSpeed} className="px-3 py-1 text-xs border border-gray-600 text-gray-400 hover:border-gray-400 min-w-[44px]">
            {speed}x
          </button>
          <button
            onClick={() => setShowTrail(t => !t)}
            className={`px-3 py-1 text-xs border ${showTrail ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
          >
            Trail
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={stepBackward} className="w-9 h-9 border border-gray-600 text-gray-400 hover:border-gray-400 flex items-center justify-center">⏮</button>
          <button onClick={togglePlay} className="w-12 h-12 bg-yellow-400 border-2 border-yellow-600 text-black flex items-center justify-center text-lg font-bold">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={stepForward} className="w-9 h-9 border border-gray-600 text-gray-400 hover:border-gray-400 flex items-center justify-center">⏭</button>
          <button onClick={restart} className="w-9 h-9 border border-gray-600 text-gray-400 hover:border-gray-400 flex items-center justify-center">↺</button>
        </div>

        {/* Player legend */}
        <div className="flex items-center gap-3">
          {PLAYERS_CONFIG.map(p => (
            <div key={p.id} className="flex items-center gap-1">
              <div className="w-3 h-3 border border-gray-500" style={{ backgroundColor: p.color }} />
              <span className="text-gray-400 text-xs">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800 border-t-2 border-gray-700">
        <div className="h-full bg-yellow-400 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
