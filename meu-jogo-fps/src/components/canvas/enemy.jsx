import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ENEMY_TYPE_IDS, ENEMY_TYPES, GAME_CONFIG, MAP_OBSTACLES } from '../../utils/constants';

const ENEMY_RADIUS = 0.6;

function resolveEnvironmentPhysics(position, radius = ENEMY_RADIUS) {
  const bound = GAME_CONFIG.ARENA_BOUNDS - radius;
  position.x = THREE.MathUtils.clamp(position.x, -bound, bound);
  position.z = THREE.MathUtils.clamp(position.z, -bound, bound);

  MAP_OBSTACLES.forEach(({ position: center, size }) => {
    const [width, , depth] = size;
    const minX = center[0] - width / 2 - radius;
    const maxX = center[0] + width / 2 + radius;
    const minZ = center[2] - depth / 2 - radius;
    const maxZ = center[2] + depth / 2 + radius;

    if (position.x > minX && position.x < maxX && position.z > minZ && position.z < maxZ) {
      const options = [
        [Math.abs(position.x - minX), 'x', minX],
        [Math.abs(maxX - position.x), 'x', maxX],
        [Math.abs(position.z - minZ), 'z', minZ],
        [Math.abs(maxZ - position.z), 'z', maxZ],
      ];
      const [, axis, value] = options.sort((a, b) => a[0] - b[0])[0];
      position[axis] = value;
    }
  });
}

function PixelMaterial({ color, emissive = color, intensity = 0.5 }) {
  return <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={intensity} flatShading />;
}

function VirusModel({ targetData, color, glow }) {
  const spikes = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return (
      <mesh key={index} position={[Math.cos(angle) * 0.85, Math.sin(angle) * 0.85, 0]} rotation={[0, 0, angle]} userData={targetData}>
        <boxGeometry args={[0.28, 0.7, 0.28]} />
        <PixelMaterial color={glow} emissive={glow} intensity={1.8} />
      </mesh>
    );
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <mesh userData={targetData} castShadow><icosahedronGeometry args={[0.85, 1]} /><PixelMaterial color={color} emissive={glow} intensity={0.8} /></mesh>
      {spikes}
      <mesh position={[0, 0, 0.78]} userData={targetData}><boxGeometry args={[0.25, 0.25, 0.08]} /><PixelMaterial color="#ff176b" emissive="#ff176b" intensity={2} /></mesh>
    </group>
  );
}

function TrojanModel({ targetData, color, glow }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} userData={targetData} castShadow><boxGeometry args={[1.2, 0.8, 0.8]} /><PixelMaterial color={color} /></mesh>
      <mesh position={[0, 1.15, -0.1]} userData={targetData} castShadow><boxGeometry args={[0.65, 1.1, 0.65]} /><PixelMaterial color={color} /></mesh>
      <mesh position={[0, 1.75, 0.05]} rotation={[0, 0, -0.25]} userData={targetData} castShadow><boxGeometry args={[0.55, 0.8, 0.55]} /><PixelMaterial color={color} /></mesh>
      <mesh position={[0, 2.15, 0.05]} userData={targetData}><boxGeometry args={[0.7, 0.16, 0.62]} /><PixelMaterial color={glow} emissive={glow} intensity={1.5} /></mesh>
      {[-0.38, 0.38].map((x) => <mesh key={x} position={[x, -0.15, 0]} userData={targetData}><boxGeometry args={[0.28, 0.7, 0.35]} /><PixelMaterial color="#351d4d" /></mesh>)}
      <mesh position={[0, 1.78, 0.36]} userData={targetData}><boxGeometry args={[0.1, 0.1, 0.06]} /><PixelMaterial color="#fff1a8" emissive="#fff1a8" intensity={2} /></mesh>
    </group>
  );
}

function WormModel({ targetData, color, glow }) {
  return (
    <group rotation={[0, 0, -0.18]}>
      {[0, 0.62, 1.18, 1.7].map((x, index) => (
        <mesh key={x} position={[x - 0.85, 0.7 + Math.sin(index) * 0.22, 0]} userData={targetData} castShadow>
          <boxGeometry args={[0.72 - index * 0.08, 0.72 - index * 0.08, 0.72 - index * 0.08]} />
          <PixelMaterial color={index === 0 ? glow : color} emissive={index === 0 ? glow : color} intensity={index === 0 ? 1.2 : 0.35} />
        </mesh>
      ))}
      <mesh position={[-1.15, 0.7, 0.38]} userData={targetData}><boxGeometry args={[0.15, 0.15, 0.08]} /><PixelMaterial color="#fff1a8" emissive="#fff1a8" intensity={2} /></mesh>
    </group>
  );
}

export function Enemy({ enemy }) {
  const groupRef = useRef();
  const lastAttackTime = useRef(0);
  const baseY = useRef(enemy.position[1]);
  const { playerPosRef, takeDamage } = useGameStore();
  const type = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.virus;
  const targetData = { isTarget: true, targetId: enemy.id };

  useEffect(() => {
    baseY.current = enemy.position[1];
  }, [enemy.position]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
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

    if (type.flying) currentPos.y = baseY.current + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.3;
    const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.06;
    groupRef.current.scale.setScalar(pulse);

    if (distance <= 1.5) {
      const now = state.clock.getElapsedTime();
      if (now - lastAttackTime.current > 0.8) {
        takeDamage(10);
        lastAttackTime.current = now;
      }
    }
  });

  return (
    <group ref={groupRef} position={enemy.position}>
      {enemy.type === 'virus' && <VirusModel targetData={targetData} color={type.color} glow={type.glow} />}
      {enemy.type === 'trojan' && <TrojanModel targetData={targetData} color={type.color} glow={type.glow} />}
      {enemy.type === 'worm' && <WormModel targetData={targetData} color={type.color} glow={type.glow} />}
      <pointLight position={[0, 1.2, 0]} intensity={2} color={type.glow} distance={4} />
    </group>
  );
}

export function getRandomEnemyType(index) {
  return ENEMY_TYPE_IDS[index % ENEMY_TYPE_IDS.length];
}
