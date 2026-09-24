import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ENEMY_TYPES, GAME_CONFIG } from '../../utils/constants';

const ENEMY_RADIUS = 0.6;

function resolveEnvironmentPhysics(position, radius = ENEMY_RADIUS) {
  const bound = GAME_CONFIG.ARENA_BOUNDS - radius;
  position.x = THREE.MathUtils.clamp(position.x, -bound, bound);
  position.z = THREE.MathUtils.clamp(position.z, -bound, bound);
}

function Material({ color, glow = color, intensity = 0.4 }) {
  return <meshStandardMaterial color={color} emissive={glow} emissiveIntensity={intensity} flatShading />;
}

function Virus({ targetData, type }) {
  return <group>
    <mesh userData={targetData} castShadow><icosahedronGeometry args={[0.85, 1]} /><Material color={type.color} glow={type.glow} intensity={0.8} /></mesh>
    {Array.from({ length: 8 }, (_, i) => {
      const angle = i * Math.PI / 4;
      return <mesh key={i} position={[Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0]} rotation={[0, 0, angle]} userData={targetData}><boxGeometry args={[0.25, 0.65, 0.25]} /><Material color={type.glow} intensity={1.8} /></mesh>;
    })}
    <mesh position={[0, 0, 0.78]} userData={targetData}><boxGeometry args={[0.25, 0.25, 0.08]} /><Material color="#ff176b" intensity={2} /></mesh>
  </group>;
}

function Trojan({ targetData, type }) {
  return <group>
    <mesh position={[0, 0.45, 0]} userData={targetData} castShadow><boxGeometry args={[1.2, 0.8, 0.8]} /><Material color={type.color} /></mesh>
    <mesh position={[0, 1.15, 0]} userData={targetData}><boxGeometry args={[0.7, 1.2, 0.7]} /><Material color={type.color} /></mesh>
    <mesh position={[0, 1.9, 0]} rotation={[0, 0, -0.2]} userData={targetData}><boxGeometry args={[0.65, 0.8, 0.65]} /><Material color={type.color} /></mesh>
    <mesh position={[0, 2.35, 0.05]} userData={targetData}><boxGeometry args={[0.75, 0.16, 0.7]} /><Material color={type.glow} intensity={1.8} /></mesh>
    {[-0.4, 0.4].map((x) => <mesh key={x} position={[x, -0.05, 0]} userData={targetData}><boxGeometry args={[0.25, 0.7, 0.35]} /><Material color="#351d4d" /></mesh>)}
  </group>;
}

function Worm({ targetData, type }) {
  return <group rotation={[0, 0, -0.15]}>
    {[0, 0.6, 1.15, 1.65].map((x, i) => <mesh key={x} position={[x - 0.8, 0.75 + Math.sin(i) * 0.2, 0]} userData={targetData} castShadow><boxGeometry args={[0.75 - i * 0.08, 0.75 - i * 0.08, 0.75 - i * 0.08]} /><Material color={i === 0 ? type.glow : type.color} glow={type.glow} intensity={i === 0 ? 1.2 : 0.3} /></mesh>)}
  </group>;
}

export function Enemy({ enemy }) {
  const groupRef = useRef();
  const lastAttackTime = useRef(0);
  const { gameState, playerPosRef, takeDamage } = useGameStore();
  const type = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.virus;
  const targetData = { isTarget: true, targetId: enemy.id };

  useFrame((state, delta) => {
    // O useFrame continua existindo no Canvas, mas a simulação fica congelada.
    if (gameState !== 'PLAYING' || !groupRef.current) return;
    const currentPos = groupRef.current.position;
    const targetPos = playerPosRef.current;
    const direction = new THREE.Vector3(targetPos.x - currentPos.x, 0, targetPos.z - currentPos.z);
    const distance = direction.length();

    if (distance > 0.1) {
      direction.normalize().multiplyScalar(enemy.speed * delta);
      currentPos.add(direction);
      resolveEnvironmentPhysics(currentPos);
      groupRef.current.lookAt(targetPos.x, currentPos.y, targetPos.z);
    }
    if (type.flying) currentPos.y = enemy.position[1] + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.3;

    if (distance <= 1.5) {
      const now = state.clock.getElapsedTime();
      if (now - lastAttackTime.current > 0.8) {
        takeDamage(10);
        lastAttackTime.current = now;
      }
    }
  });

  return <group ref={groupRef} position={enemy.position}>
    {enemy.type === 'virus' && <Virus targetData={targetData} type={type} />}
    {enemy.type === 'trojan' && <Trojan targetData={targetData} type={type} />}
    {enemy.type === 'worm' && <Worm targetData={targetData} type={type} />}
    <pointLight position={[0, 1.2, 0]} intensity={2} color={type.glow} distance={4} />
  </group>;
}

export function getRandomEnemyType(index) {
  return ENEMY_TYPE_IDS[index % ENEMY_TYPE_IDS.length];
}
