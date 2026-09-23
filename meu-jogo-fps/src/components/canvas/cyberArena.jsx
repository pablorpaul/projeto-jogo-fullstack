import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CONFIG } from '../../utils/constants';
import { Enemy } from './Enemy';

const MAP_SIZE = 120;
const WALL_HEIGHT = 8;
const WALL_THICKNESS = 1;

const obstacles = [
  { position: [-12, 2, -12], size: [6, 4, 6] },
  { position: [12, 1.5, -16], size: [8, 3, 5] },
  { position: [-22, 2, 8], size: [5, 4, 9] },
  { position: [22, 1.5, 12], size: [7, 3, 6] },
  { position: [0, 2, 18], size: [10, 4, 4] },
  { position: [-34, 1.5, -24], size: [6, 3, 6] },
  { position: [34, 2, -28], size: [8, 4, 5] },
  { position: [-38, 1, 30], size: [5, 2, 10] },
  { position: [36, 1.5, 32], size: [6, 3, 8] },
  { position: [0, 1.5, -34], size: [12, 3, 4] },
];

export function CyberArena() {
  const { enemies, setEnemies, timeLeft, setTimeLeft, gameState, setGameState } = useGameStore();
  const nextSpawnTime = useRef(0);
  const nextEnemyId = useRef(1);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('VICTORY');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, setTimeLeft, setGameState]);

  useFrame((state) => {
    if (gameState !== 'PLAYING') return;

    const elapsedTime = state.clock.getElapsedTime();
    const timeProgress = 1 - (timeLeft / GAME_CONFIG.GAME_TIME_LIMIT);
    const spawnInterval = Math.max(0.6, 3.5 - timeProgress * 2.9);

    if (elapsedTime > nextSpawnTime.current) {
      nextSpawnTime.current = elapsedTime + spawnInterval;

      const angle = Math.random() * Math.PI * 2;
      const radius = 45 + Math.random() * 7;
      const spawnX = Math.cos(angle) * radius;
      const spawnZ = Math.sin(angle) * radius;

      setEnemies((prev) => [...prev, {
        id: nextEnemyId.current++,
        position: [spawnX, 1.0, spawnZ],
        hp: 2,
        speed: 3.2 + timeProgress * 1.5,
        type: 'standard',
      }]);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 0]} intensity={2} color="#00f0ff" distance={40} />
      <pointLight position={[-30, 6, -20]} intensity={2} color="#ff0055" distance={30} />

      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[MAP_SIZE, 0.5, MAP_SIZE]} />
        <meshStandardMaterial color="#0d0d15" roughness={0.4} metalness={0.6} />
      </mesh>
      <gridHelper args={[MAP_SIZE, 120, '#00f0ff', '#222233']} position={[0, 0.01, 0]} />

      <mesh position={[0, WALL_HEIGHT / 2, -MAP_SIZE / 2]}>
        <boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, MAP_SIZE / 2]}>
        <boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      <mesh position={[-MAP_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      <mesh position={[MAP_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>

      {obstacles.map((obstacle, index) => (
        <mesh
          key={index}
          position={obstacle.position}
          castShadow
          userData={{ isCollider: true }}
        >
          <boxGeometry args={obstacle.size} />
          <meshStandardMaterial color="#1f1f2e" metalness={0.8} />
        </mesh>
      ))}

      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}
