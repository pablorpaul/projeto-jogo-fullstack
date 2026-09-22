import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CONFIG } from '../../utils/constants';
import { Enemy } from './Enemy';

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
      const radius = 22 + Math.random() * 4;
      const spawnX = Math.cos(angle) * radius;
      const spawnZ = Math.sin(angle) * radius;

      const isFastType = Math.random() < 0.3 + timeProgress * 0.3;

      const newEnemy = {
        id: nextEnemyId.current++,
        position: [spawnX, 1.2, spawnZ],
        hp: isFastType ? 1 : 2,
        speed: isFastType ? 4.5 + timeProgress : 2.5 + timeProgress * 1.2,
        type: isFastType ? 'fast' : 'heavy',
      };

      setEnemies((prev) => [...prev, newEnemy]);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 0]} intensity={2} color="#00f0ff" distance={25} />
      <pointLight position={[-15, 6, -10]} intensity={2} color="#ff0055" distance={20} />

      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[60, 0.5, 60]} />
        <meshStandardMaterial color="#0d0d15" roughness={0.4} metalness={0.6} />
      </mesh>

      <gridHelper args={[60, 60, '#00f0ff', '#222233']} position={[0, 0.01, 0]} />

      <mesh position={[0, 4, -30]}><boxGeometry args={[60, 8, 1]} /><meshStandardMaterial color="#12121c" /></mesh>
      <mesh position={[0, 4, 30]}><boxGeometry args={[60, 8, 1]} /><meshStandardMaterial color="#12121c" /></mesh>
      <mesh position={[-30, 4, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[60, 8, 1]} /><meshStandardMaterial color="#12121c" /></mesh>
      <mesh position={[30, 4, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[60, 8, 1]} /><meshStandardMaterial color="#12121c" /></mesh>

      <mesh position={[-6, 1.5, -5]} castShadow><boxGeometry args={[3, 3, 3]} /><meshStandardMaterial color="#1f1f2e" metalness={0.8} /></mesh>
      <mesh position={[6, 1, -8]} castShadow><boxGeometry args={[4, 2, 4]} /><meshStandardMaterial color="#1f1f2e" metalness={0.8} /></mesh>

      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}