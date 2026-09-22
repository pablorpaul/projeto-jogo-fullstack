import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Gun({ isShooting, isReloading }) {
  const gunRef = useRef();

  useFrame((state, delta) => {
    if (!gunRef.current) return;
    const t = state.clock.getElapsedTime();

    gunRef.current.position.x = 0.25 + Math.sin(t * 2) * 0.005;
    gunRef.current.position.y = -0.2 + Math.cos(t * 4) * 0.005;

    if (isShooting) {
      gunRef.current.position.z = -0.25;
      gunRef.current.rotation.x = 0.15;
    } else {
      gunRef.current.position.z = THREE.MathUtils.lerp(gunRef.current.position.z, -0.4, delta * 15);
      gunRef.current.rotation.x = THREE.MathUtils.lerp(gunRef.current.rotation.x, 0, delta * 15);
    }

    if (isReloading) {
      gunRef.current.rotation.z = Math.sin(t * 15) * 0.3;
      gunRef.current.position.y = -0.35;
    } else {
      gunRef.current.rotation.z = THREE.MathUtils.lerp(gunRef.current.rotation.z, 0, delta * 10);
    }
  });

  return (
    <group ref={gunRef} position={[0.25, -0.2, -0.4]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.4]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.03, -0.25]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#00f0ff" roughness={0.2} metalness={0.9} emissive="#00f0ff" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.08, -0.05]}>
        <boxGeometry args={[0.04, 0.04, 0.1]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={0.5} />
      </mesh>
      {isShooting && (
        <pointLight position={[0, 0.03, -0.45]} intensity={5} color="#00f0ff" distance={3} />
      )}
    </group>
  );
}