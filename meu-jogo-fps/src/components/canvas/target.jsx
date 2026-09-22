import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Target({ target }) {
  const meshRef = useRef();
  const color = target.hp === 2 ? '#00f0ff' : '#ff0055';

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={target.position}>
      <mesh ref={meshRef} userData={{ isTarget: true, targetId: target.id }} castShadow receiveShadow>
        {target.type === 'cube' ? (
          <boxGeometry args={[1.2, 1.2, 1.2]} />
        ) : (
          <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} rotation={[Math.PI / 2, 0, 0]} />
        )}
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}