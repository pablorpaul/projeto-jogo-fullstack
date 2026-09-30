import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import * as THREE from 'three';

export function Gun({ isShooting, isReloading }) {
  const gunRef = useRef();
  const { isPresenting } = useXR();
  const rightController = useController('right');

  useFrame((state, delta) => {
    if (!gunRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isPresenting) {
      // Se o controlador do VR já foi instanciado, acopla a arma na mão
      if (rightController?.grp) {
        gunRef.current.position.copy(rightController.grp.position);
        gunRef.current.quaternion.copy(rightController.grp.quaternion);
        
        // Ajuste de offset para o cabo da arma encaixar na mão
        gunRef.current.translateZ(-0.1);
        gunGroupOffset(gunRef.current, isShooting);
      }
    } else {
      // Posição para o modo Desktop (PC)
      gunRef.current.position.x = 0.25 + Math.sin(t * 2) * 0.005;
      gunRef.current.position.y = -0.25 + Math.cos(t * 4) * 0.005;

      if (isShooting) {
        gunRef.current.position.z = -0.45;
        gunRef.current.rotation.x = 0.15;
      } else {
        gunRef.current.position.z = THREE.MathUtils.lerp(gunRef.current.position.z, -0.5, delta * 15);
        gunRef.current.rotation.x = THREE.MathUtils.lerp(gunRef.current.rotation.x, 0, delta * 15);
      }

      if (isReloading) {
        gunRef.current.rotation.z = Math.sin(t * 15) * 0.3;
      } else {
        gunRef.current.rotation.z = THREE.MathUtils.lerp(gunRef.current.rotation.z, 0, delta * 10);
      }
    }
  });

  return (
    <group ref={gunRef} position={[0.25, -0.25, -0.5]}>
      {/* Corpo principal */}
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

      {/* Laser de Mira VR */}
      {isPresenting && (
        <group position={[0, 0.03, -0.325]}>
          <mesh position={[0, 0, -7.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 15, 8]} />
            <meshBasicMaterial color="#ff0055" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, -15]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function gunGroupOffset(gunGroup, isShooting) {
  if (isShooting) {
    gunGroup.translateZ(-0.02);
  }
}