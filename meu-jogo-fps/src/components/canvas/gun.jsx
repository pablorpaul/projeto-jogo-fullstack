import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import * as THREE from 'three';

export function Gun({ isShooting, isReloading }) {
  const gunRef = useRef();
  const { camera } = useThree();
  const { isPresenting } = useXR();
  const rightController = useController('right');

  useFrame((state, delta) => {
    if (!gunRef.current) return;
    const t = state.clock.getElapsedTime();

    // === MODO VR ===
    if (isPresenting && rightController?.controller) {
      // 1. Copia a posição EXATA mundial do controle VR para a arma
      rightController.controller.getWorldPosition(gunRef.current.position);
      rightController.controller.getWorldQuaternion(gunRef.current.quaternion);

      // 2. Ajustes locais para encaixar o cabo da arma na mão
      gunRef.current.translateZ(-0.1);
      gunRef.current.translateY(-0.02);
      gunRef.current.rotateX(-Math.PI / 12);

      // 3. Recuo (Recoil) do tiro no VR
      if (isShooting) {
        gunRef.current.translateZ(0.04);
        gunRef.current.rotateX(0.1);
      }
    } 
    // === MODO PC / DESKTOP ===
    else {
      // 1. Copia a posição mundial da câmera
      camera.getWorldPosition(gunRef.current.position);
      camera.getWorldQuaternion(gunRef.current.quaternion);

      // 2. Movimento suave (sway) de respiração
      const swayX = Math.sin(t * 2) * 0.005;
      const swayY = Math.cos(t * 4) * 0.005;
      
      // 3. Posiciona no canto inferior direito da visão
      gunRef.current.translateX(0.25 + swayX);
      gunRef.current.translateY(-0.25 + swayY);
      gunRef.current.translateZ(-0.5);

      // 4. Recuo (Recoil) do tiro no PC
      if (isShooting) {
        gunRef.current.translateZ(0.05);
        gunRef.current.rotateX(0.15);
      }
    }

    // === ANIMAÇÃO GERAL DE RECARREGAR ===
    if (isReloading) {
      gunRef.current.rotateZ(Math.sin(t * 15) * 0.3);
      if (!isPresenting) gunRef.current.translateY(-0.1);
    }
  });

  // Retornamos APENAS UMA estrutura de grupo, o que impede clones/duplicações!
  return (
    <group ref={gunRef}>
      {/* Corpo principal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.35]} />
        <meshBasicMaterial color="#1a1a24" />
      </mesh>

      {/* Cano do canhão */}
      <group position={[0, 0.03, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Mira neon */}
      <mesh position={[0, 0.08, -0.02]}>
        <boxGeometry args={[0.03, 0.03, 0.08]} />
        <meshBasicMaterial color="#ff0055" />
      </mesh>

      {/* Feixe de Laser de Mira Exclusivo do VR */}
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