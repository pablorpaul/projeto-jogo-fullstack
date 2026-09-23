import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

const OBSTACLES = [
  { minX: -7.5, maxX: -4.5, minZ: -6.5, maxZ: -3.5 },
  { minX: 4.0, maxX: 8.0, minZ: -10.0, maxZ: -6.0 },
];

function resolveEnvironmentPhysics(position, radius = 0.6) {
  const BOUND = 27.5;
  position.x = THREE.MathUtils.clamp(position.x, -BOUND, BOUND);
  position.z = THREE.MathUtils.clamp(position.z, -BOUND, BOUND);

  for (const obs of OBSTACLES) {
    const minX = obs.minX - radius;
    const maxX = obs.maxX + radius;
    const minZ = obs.minZ - radius;
    const maxZ = obs.maxZ + radius;

    if (position.x > minX && position.x < maxX && position.z > minZ && position.z < maxZ) {
      const dLeft = Math.abs(position.x - minX);
      const dRight = Math.abs(maxX - position.x);
      const dTop = Math.abs(position.z - minZ);
      const dBottom = Math.abs(maxZ - position.z);

      const minDist = Math.min(dLeft, dRight, dTop, dBottom);

      if (minDist === dLeft) position.x = minX;
      else if (minDist === dRight) position.x = maxX;
      else if (minDist === dTop) position.z = minZ;
      else if (minDist === dBottom) position.z = maxZ;
    }
  }
}

export function Enemy({ enemy }) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const coreRef = useRef();

  const { playerPosRef, takeDamage } = useGameStore();
  const lastAttackTime = useRef(0);

  // Dynamic colors based on enemy health state
  const isLowHp = enemy.hp === 1;
  const glowColor = isLowHp ? '#ff0055' : '#00f0ff';
  const bodyColor = '#181b26';
  const armorColor = '#252a3b';

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const currentPos = groupRef.current.position;
    const targetPos = playerPosRef.current;
    const time = state.clock.getElapsedTime();

    const direction = new THREE.Vector3(targetPos.x - currentPos.x, 0, targetPos.z - currentPos.z);
    const distanceToPlayer = direction.length();

    // Walking / Movement logic
    if (distanceToPlayer > 0.1) {
      direction.normalize().multiplyScalar(enemy.speed * delta);
      currentPos.add(direction);

      resolveEnvironmentPhysics(currentPos, 0.6);
      groupRef.current.lookAt(targetPos.x, currentPos.y, targetPos.z);

      // Limb movement animation (walking cycle)
      const walkCycle = Math.sin(time * enemy.speed * 3);
      if (leftArmRef.current) leftArmRef.current.rotation.x = walkCycle * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -walkCycle * 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -walkCycle * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = walkCycle * 0.6;
    }

    // Pulse core effect
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 8) * 0.12);
    }

    // Player touch damage check
    const TOUCH_DISTANCE = 1.2;
    if (distanceToPlayer <= TOUCH_DISTANCE) {
      const now = state.clock.getElapsedTime();
      if (now - lastAttackTime.current > 0.8) {
        takeDamage(10);
        lastAttackTime.current = now;
      }
    }
  });

  const targetData = { isTarget: true, targetId: enemy.id };

  return (
    <group ref={groupRef} position={enemy.position}>
      {/* --- HEAD & VISOR --- */}
      <group position={[0, 1.45, 0]}>
        {/* Main Helmet */}
        <mesh userData={targetData} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Cyber Visor / Eye Strip */}
        <mesh position={[0, 0.04, 0.195]} userData={targetData}>
          <boxGeometry args={[0.32, 0.1, 0.05]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        {/* Helmet Antennas / Ear Plates */}
        <mesh position={[-0.21, 0.08, 0]} userData={targetData}>
          <boxGeometry args={[0.06, 0.22, 0.15]} />
          <meshStandardMaterial color={bodyColor} metalness={0.9} />
        </mesh>
        <mesh position={[0.21, 0.08, 0]} userData={targetData}>
          <boxGeometry args={[0.06, 0.22, 0.15]} />
          <meshStandardMaterial color={bodyColor} metalness={0.9} />
        </mesh>
      </group>

      {/* --- CHEST & TORSO --- */}
      <group position={[0, 0.85, 0]}>
        {/* Upper Chest Armor */}
        <mesh userData={targetData} castShadow>
          <boxGeometry args={[0.65, 0.6, 0.45]} />
          <meshStandardMaterial color={armorColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Glowing Reactor Core */}
        <mesh ref={coreRef} position={[0, 0.08, 0.23]} userData={targetData}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>
        {/* Spine / Back Power Pack */}
        <mesh position={[0, 0.05, -0.26]} userData={targetData}>
          <boxGeometry args={[0.35, 0.45, 0.15]} />
          <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.9} />
        </mesh>
      </group>

      {/* --- SHOULDERS & ARMS --- */}
      {/* Left Arm */}
      <group position={[-0.42, 1.05, 0]} ref={leftArmRef}>
        <mesh position={[0, 0, 0]} userData={targetData}>
          <boxGeometry args={[0.18, 0.18, 0.22]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.04, -0.3, 0]} userData={targetData} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
          <meshStandardMaterial color={bodyColor} metalness={0.8} />
        </mesh>
        {/* Energy Claw */}
        <mesh position={[-0.04, -0.55, 0.05]} userData={targetData}>
          <boxGeometry args={[0.04, 0.15, 0.08]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.42, 1.05, 0]} ref={rightArmRef}>
        <mesh position={[0, 0, 0]} userData={targetData}>
          <boxGeometry args={[0.18, 0.18, 0.22]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.04, -0.3, 0]} userData={targetData} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
          <meshStandardMaterial color={bodyColor} metalness={0.8} />
        </mesh>
        {/* Energy Claw */}
        <mesh position={[0.04, -0.55, 0.05]} userData={targetData}>
          <boxGeometry args={[0.04, 0.15, 0.08]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* --- LEGS --- */}
      {/* Left Leg */}
      <group position={[-0.18, 0.55, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.25, 0]} userData={targetData} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.18]} />
          <meshStandardMaterial color={armorColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Knee Light */}
        <mesh position={[0, -0.15, 0.1]} userData={targetData}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.18, 0.55, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.25, 0]} userData={targetData} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.18]} />
          <meshStandardMaterial color={armorColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Knee Light */}
        <mesh position={[0, -0.15, 0.1]} userData={targetData}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Point Light for dynamic glow cast onto surrounding environment */}
      <pointLight position={[0, 0.9, 0.2]} intensity={2.5} color={glowColor} distance={4} />
    </group>
  );
}