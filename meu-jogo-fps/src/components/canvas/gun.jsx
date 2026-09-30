import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import * as THREE from 'three';

export function Gun({ isShooting, isReloading }) {
  const gunGroupRef = useRef();
  const { isPresenting } = useXR();
  const rightController = useController('right');

  useFrame((state, delta) => {
    if (!gunGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isPresenting && rightController?.grp) {
      // Sincroniza posição e rotação com a mão do controle VR direito
      gunGroupRef.current.position.copy(rightController.grp.position);
      gunGroupRef.current.quaternion.copy(rightController.grp.quaternion);

      // Pequeno deslocamento local para encaixar o cabo da arma na empunhadura do controle
      gunGroupRef.current.translateZ(-0.1);
      gunGroupRef.current.translateY(-0.02);
      gunGroupRef.current.rotateX(-Math.PI / 12);
    } else if (!isPresenting) {
      // Animação e posição padrão para tela de PC
      gunGroupRef.current.position.x = 0.25 + Math.sin(t * 2) * 0.005;
      gunGroupRef.current.position.y = -0.25 + Math.cos(t * 4) * 0.005;

      if (isShooting) {
        gunGroupRef.current.position.z = -0.45;
        gunGroupRef.current.rotation.x = 0.15;
      } else {
        gunGroupRef.current.position.z = THREE.MathUtils.lerp(gunGroupRef.current.position.z, -0.5, delta * 15);
        gunGroupRef.current.rotation.x = THREE.MathUtils.lerp(gunGroupRef.current.rotation.x, 0, delta * 15);
      }

      if (isReloading) {
        gunGroupRef.current.rotation.z = Math.sin(t * 15) * 0.3;
        gunGroupRef.current.position.y = -0.35;
      } else {
        gunGroupRef.current.rotation.z = THREE.MathUtils.lerp(gunGroupRef.current.rotation.z, 0, delta * 10);
      }
    }
  });

  return (
    <group ref={gunGroupRef} position={isPresenting ? [0, 0, 0] : [0.25, -0.25, -0.5]}>
      {/* Corpo principal da arma */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.4]} />
        <meshBasicMaterial color="#1a1a24" />
      </mesh>

      {/* Cano cilíndrico */}
      <group position={[0, 0.03, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Mira LED */}
      <mesh position={[0, 0.08, -0.05]}>
        <boxGeometry args={[0.04, 0.04, 0.1]} />
        <meshBasicMaterial color="#ff0055" />
      </mesh>
    </group>
  );
}