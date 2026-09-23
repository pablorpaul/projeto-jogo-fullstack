import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { GAME_CONFIG } from '../../utils/constants';
import { sfx } from '../../utils/soundEffects';
import { useGameStore } from '../../store/useGameStore';
import { Gun } from './Gun';

export function Player() {
  const { camera, scene } = useThree();
  const [, getKeys] = useKeyboardControls();
  const { ammo, setAmmo, isReloading, setIsReloading, setEnemies, setScore, setKills, setHitMessage, playerPosRef } = useGameStore();
  const [isShooting, setIsShooting] = useState(false);

  const pos = useRef(new THREE.Vector3(0, GAME_CONFIG.PLAYER_HEIGHT, 0));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const colliders = useRef([]);

  const frontVector = useMemo(() => new THREE.Vector3(), []);
  const sideVector = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  const handleReload = useCallback(() => {
    if (ammo < GAME_CONFIG.MAX_AMMO && !isReloading) {
      setIsReloading(true);
      sfx.playReload();
      setTimeout(() => {
        setAmmo(GAME_CONFIG.MAX_AMMO);
        setIsReloading(false);
      }, GAME_CONFIG.RELOAD_TIME_MS);
    }
  }, [ammo, isReloading, setAmmo, setIsReloading]);

  const handleShoot = useCallback(() => {
    if (isReloading || ammo <= 0) {
      if (ammo <= 0) handleReload();
      return;
    }

    setAmmo((prev) => prev - 1);
    setIsShooting(true);
    sfx.playShoot();
    setTimeout(() => setIsShooting(false), 80);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const hitables = [];
    scene.traverse((child) => {
      if (child.isMesh && child.userData && child.userData.isTarget) hitables.push(child);
    });

    const intersects = raycaster.intersectObjects(hitables, true);
    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const targetId = hitObj.userData.targetId;

      if (targetId) {
        sfx.playHit();
        setHitMessage('INIMIGO ATINGIDO!');
        setTimeout(() => setHitMessage(''), 800);
        setEnemies((prev) => prev.map((e) => {
          if (e.id === targetId) {
            const newHp = e.hp - 1;
            if (newHp <= 0) {
              sfx.playDestroy();
              setScore((s) => s + 100);
              setKills((k) => k + 1);
            }
            return { ...e, hp: newHp };
          }
          return e;
        }).filter((e) => e.hp > 0));
      }
    }
  }, [camera, scene, ammo, isReloading, setAmmo, setScore, setKills, setEnemies, setHitMessage, handleReload]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (e.button === 0 && document.pointerLockElement) handleShoot();
    };
    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [handleShoot]);

  useEffect(() => {
    const mapColliders = [];
    scene.traverse((child) => {
      if (child.isMesh && child.userData?.isCollider) mapColliders.push(child);
    });
    colliders.current = mapColliders;
  }, [scene]);

  const collidesAt = useCallback((candidate) => {
    const radius = GAME_CONFIG.PLAYER_RADIUS;
    const playerMinX = candidate.x - radius;
    const playerMaxX = candidate.x + radius;
    const playerMinZ = candidate.z - radius;
    const playerMaxZ = candidate.z + radius;

    return colliders.current.some((collider) => {
      const box = new THREE.Box3().setFromObject(collider);
      return playerMaxX > box.min.x && playerMinX < box.max.x
        && playerMaxZ > box.min.z && playerMinZ < box.max.z;
    });
  }, []);

  const moveWithCollision = useCallback((movement) => {
    const candidate = pos.current.clone();
    candidate.x += movement.x;
    if (!collidesAt(candidate)) pos.current.x = candidate.x;

    candidate.copy(pos.current);
    candidate.z += movement.z;
    if (!collidesAt(candidate)) pos.current.z = candidate.z;
  }, [collidesAt]);

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, reload } = getKeys();
    if (reload) handleReload();

    if (!isGrounded.current) velocityY.current -= GAME_CONFIG.GRAVITY * delta;
    if (jump && isGrounded.current) {
      velocityY.current = GAME_CONFIG.JUMP_FORCE;
      isGrounded.current = false;
    }

    pos.current.y += velocityY.current * delta;
    if (pos.current.y <= GAME_CONFIG.PLAYER_HEIGHT) {
      pos.current.y = GAME_CONFIG.PLAYER_HEIGHT;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    frontVector.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize()
      .multiplyScalar(GAME_CONFIG.SPEED * delta).applyEuler(camera.rotation);
    direction.y = 0;

    moveWithCollision(direction);
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -GAME_CONFIG.ARENA_BOUNDS, GAME_CONFIG.ARENA_BOUNDS);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -GAME_CONFIG.ARENA_BOUNDS, GAME_CONFIG.ARENA_BOUNDS);

    camera.position.copy(pos.current);
    playerPosRef.current = pos.current;
  });

  return (
    <primitive object={camera}>
      <Gun isShooting={isShooting} isReloading={isReloading} />
    </primitive>
  );
}
