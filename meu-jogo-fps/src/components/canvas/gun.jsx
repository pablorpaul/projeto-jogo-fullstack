import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import * as THREE from 'three';

function GunMesh({ isShooting, isReloading }) {
  const gunGroupRef = useRef();
  const { isPresenting } = useXR();

  useFrame((state, delta) => {
    if (!gunGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isShooting) {
      gunGroupRef.current.position.z = -0.05;
      gunGroupRef.current.rotation.x = 0.15;
    } else {
      gunGroupRef.current.position.z = THREE.MathUtils.lerp(gunGroupRef.current.position.z, -0.1, delta * 15);
      gunGroupRef.current.rotation.x = THREE.MathUtils.lerp(gunGroupRef.current.rotation.x, 0, delta * 15);
    }

    if (isReloading) {
      gunGroupRef.current.rotation.z = Math.sin(t * 15) * 0.3;
    } else {
      gunGroupRef.current.rotation.z = THREE.MathUtils.lerp(gunGroupRef.current.rotation.z, 0, delta * 10);
    }
  });

  return (
    <group ref={gunGroupRef} position={[0, -0.02, -0.1]} rotation={[-Math.PI / 12, 0, 0]}>
      {/* Corpo da arma */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.35]} />
        <meshBasicMaterial color="#1a1a24" />
      </mesh>

      {/* Cano */}
      <group position={[0, 0.03, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Mira Neon */}
      <mesh position={[0, 0.08, -0.02]}>
        <boxGeometry args={[0.03, 0.03, 0.08]} />
        <meshBasicMaterial color="#ff0055" />
      </mesh>

      {/* Feixe de Laser para Mira VR */}
      {isPresenting && (
        <group position={[0, 0.03, -0.325]}>
          {/* Linha/Cilindro do Laser */}
          <mesh position={[0, 0, -7.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 15, 8]} />
            <meshBasicMaterial color="#ff0055" transparent opacity={0.6} />
          </mesh>

          {/* Ponto indicador no final da mira */}
          <mesh position={[0, 0, -15]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Gun({ isShooting, isReloading }) {
  const { isPresenting } = useXR();
  const rightController = useController('right');

  if (isPresenting && rightController?.grp) {
    return (
      <primitive object={rightController.grp}>
        <GunMesh isShooting={isShooting} isReloading={isReloading} />
      </primitive>
    );
  }

  return (
    <group position={isPresenting ? [0.2, -0.2, -0.4] : [0.25, -0.25, -0.5]}>
      <GunMesh isShooting={isShooting} isReloading={isReloading} />
    </group>
  );
}