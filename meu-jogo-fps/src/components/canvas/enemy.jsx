import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CONFIG, MAP_OBSTACLES } from '../../utils/constants';

const ENEMY_RADIUS = 0.6;

function resolveEnvironmentPhysics(position, radius = ENEMY_RADIUS) {
  const bound = GAME_CONFIG.ARENA_BOUNDS - radius;
  position.x = THREE.MathUtils.clamp(position.x, -bound, bound);
  position.z = THREE.MathUtils.clamp(position.z, -bound, bound);

  for (const obstacle of MAP_OBSTACLES) {
    const [width, , depth] = obstacle.size;
    const [centerX, , centerZ] = obstacle.position;
    const minX = centerX - width / 2 - radius;
    const maxX = centerX + width / 2 + radius;
    const minZ = centerZ - depth / 2 - radius;
    const maxZ = centerZ + depth / 2 + radius;

    if (position.x > minX && position.x < maxX && position.z > minZ && position.z < maxZ) {
      const distances = [
        { distance: Math.abs(position.x - minX), resolve: () => { position.x = minX; } },
        { distance: Math.abs(maxX - position.x), resolve: () => { position.x = maxX; } },
        { distance: Math.abs(position.z - minZ), resolve: () => { position.z = minZ; } },
        { distance: Math.abs(maxZ - position.z), resolve: () => { position.z = maxZ; } },
      ];
      distances.sort((a, b) => a.distance - b.distance)[0].resolve();
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

    if (distanceToPlayer > 0.1) {
      direction.normalize().multiplyScalar(enemy.speed * delta);
      currentPos.add(direction);
      resolveEnvironmentPhysics(currentPos);
      groupRef.current.lookAt(targetPos.x, currentPos.y, targetPos.z);

      const walkCycle = Math.sin(time * enemy.speed * 3);
      if (leftArmRef.current) leftArmRef.current.rotation.x = walkCycle * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -walkCycle * 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -walkCycle * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = walkCycle * 0.6;
    }

    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(time * 8) * 0.12);

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
      {/* O restante da hierarquia visual do inimigo permanece igual. */}
    </group>
  );
}
