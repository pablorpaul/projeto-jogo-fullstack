import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ENEMY_TYPES, GAME_CONFIG, MAP_OBSTACLES } from '../../utils/constants';
import { Enemy, getRandomEnemyType } from './Enemy';
import { CyberBuilding } from './CyberBuilding';
import { CyberSign } from './CyberSign';

const MAP_SIZE = 120;
const WALL_HEIGHT = 8;
const WALL_THICKNESS = 1;

export function CyberArena() {
  const { enemies, setEnemies, timeLeft, setTimeLeft, gameState, setGameState } = useGameStore();
  const nextSpawnTime = useRef(0);
  const nextEnemyId = useRef(1);

  useEffect(() => {
    if (gameState !== 'PLAYING') return undefined;
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
      const edge = Math.floor(Math.random() * 4);
      const coordinate = THREE.MathUtils.randFloat(-GAME_CONFIG.ARENA_BOUNDS + 3, GAME_CONFIG.ARENA_BOUNDS - 3);
      const edgePosition = GAME_CONFIG.ARENA_BOUNDS - 2;
      const spawnX = edge === 0 ? -edgePosition : edge === 1 ? edgePosition : coordinate;
      const spawnZ = edge === 2 ? -edgePosition : edge === 3 ? edgePosition : coordinate;
      const typeId = getRandomEnemyType(nextEnemyId.current - 1);
      const type = ENEMY_TYPES[typeId];

      setEnemies((prev) => [...prev, {
        id: nextEnemyId.current++,
        type: typeId,
        position: [spawnX, type.flying ? 4.5 : 1.0, spawnZ],
        hp: type.hp,
        speed: type.speed + timeProgress * (typeId === 'trojan' ? 0.8 : 0.35),
      }]);
    }
  });

  return (
    <>
      <color attach="background" args={['#03051a']} />
      <fog attach="fog" args={['#03051a', 38, 110]} />
      <ambientLight intensity={0.35} color="#526dff" />
      <directionalLight position={[15, 20, 10]} intensity={1.2} color="#9bb8ff" castShadow />
      <pointLight position={[0, 10, 0]} intensity={3} color="#00f0ff" distance={42} />
      <pointLight position={[-30, 8, -20]} intensity={3} color="#ff0055" distance={32} />

      <mesh position={[0, -0.25, 0]} receiveShadow><boxGeometry args={[MAP_SIZE, 0.5, MAP_SIZE]} /><meshStandardMaterial color="#080b1c" roughness={0.4} metalness={0.7} /></mesh>
      <gridHelper args={[MAP_SIZE, 120, '#00f0ff', '#1d1640']} position={[0, 0.01, 0]} />
      <mesh position={[0, WALL_HEIGHT / 2, -MAP_SIZE / 2]}><boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} /><meshStandardMaterial color="#0b0d26" /></mesh>
      <mesh position={[0, WALL_HEIGHT / 2, MAP_SIZE / 2]}><boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} /><meshStandardMaterial color="#0b0d26" /></mesh>
      <mesh position={[-MAP_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} /><meshStandardMaterial color="#0b0d26" /></mesh>
      <mesh position={[MAP_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[MAP_SIZE, WALL_HEIGHT, WALL_THICKNESS]} /><meshStandardMaterial color="#0b0d26" /></mesh>

      {MAP_OBSTACLES.map((building, index) => <CyberBuilding key={index} building={building} index={index} />)}
      <CyberSign message="VIRUS DETECTED" position={[-18, 10, -59]} color="#ff176b" />
      <CyberSign message="MALWARE DETECTED" position={[20, 13, -59]} color="#00f0ff" />
      {enemies.map((enemy) => <Enemy key={enemy.id} enemy={enemy} />)}
    </>
  );
}
