import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function Enemy({ enemy }) {
  const meshRef = useRef();
  const { playerPosRef, takeDamage } = useGameStore();
  const lastAttackTime = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const currentPos = meshRef.current.position;
    const targetPos = playerPosRef.current;

    const direction = new THREE.Vector3(targetPos.x - currentPos.x, 0, targetPos.z - currentPos.z);
    const distance = direction.length();

    if (distance > 0.8) {
      direction.normalize().multiplyScalar(enemy.speed * delta);
      currentPos.add(direction);
      meshRef.current.lookAt(targetPos.x, currentPos.y, targetPos.z);
    } else {
      const now = state.clock.getElapsedTime();
      if (now - lastAttackTime.current > 0.8) {
        takeDamage(10);
        lastAttackTime.current = now;
      }
    }
  });

  return (
    <group position={enemy.position}>
      <mesh ref={meshRef} userData={{ isTarget: true, targetId: enemy.id }} castShadow receiveShadow>
        {enemy.type === 'fast' ? (
          <octahedronGeometry args={[0.7]} />
        ) : (
          <boxGeometry args={[1.2, 1.2, 1.2]} />
        )}
        <meshStandardMaterial
          color={enemy.hp === 1 ? '#ff0055' : '#00f0ff'}
          roughness={0.2}
          metalness={0.8}
          emissive={enemy.hp === 1 ? '#ff0055' : '#00f0ff'}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}