import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, Text } from '@react-three/drei';
import { useController, useXR } from '@react-three/xr';
import * as THREE from 'three';
import { GAME_CONFIG } from '../../utils/constants';
import { sfx } from '../../utils/soundEffects';
import { useGameStore } from '../../store/useGameStore';
import { Gun } from './gun';

function VRHUD({ camera }) {
  const { ammo, playerHp, score, kills } = useGameStore();
  const hudRef = useRef();

  useFrame(() => {
    if (hudRef.current && camera) {
      hudRef.current.position.copy(camera.position);
      hudRef.current.quaternion.copy(camera.quaternion);
      hudRef.current.translateZ(-0.75);
      hudRef.current.translateY(0.28);
    }
  });

  return (
    <group ref={hudRef}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.85, 0.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
      <Text position={[-0.38, 0.04, 0]} fontSize={0.04} color="#00f0ff" anchorX="left">
        {`HP: ${playerHp} | AMMO: ${ammo}/${GAME_CONFIG.MAX_AMMO}`}
      </Text>
      <Text position={[-0.38, -0.04, 0]} fontSize={0.035} color="#ff0055" anchorX="left">
        {`SCORE: ${score} | KILLS: ${kills}`}
      </Text>
    </group>
  );
}

function ExitVRButton({ camera }) {
  const { session } = useXR();
  const buttonRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (buttonRef.current && camera) {
      buttonRef.current.position.copy(camera.position);
      buttonRef.current.quaternion.copy(camera.quaternion);
      buttonRef.current.translateZ(-0.75);
      buttonRef.current.translateY(-0.35);
    }
  });

  const handleExit = () => {
    if (session) session.end();
  };

  return (
    <group
      ref={buttonRef}
      onClick={handleExit}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.3, 0.08]} />
        <meshBasicMaterial color={hovered ? '#ff176b' : '#351d4d'} />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.035} color="#ffffff" anchorX="center" anchorY="middle">
        SAIR DO VR ❌
      </Text>
    </group>
  );
}

export function Player() {
  const { camera, scene } = useThree();
  const { isPresenting, player } = useXR();
  const [, getKeys] = useKeyboardControls();
  const { ammo, setAmmo, isReloading, setIsReloading, setEnemies, setScore, setKills, setHitMessage, playerPosRef } = useGameStore();
  const [isShooting, setIsShooting] = useState(false);

  const leftController = useController('left');
  const rightController = useController('right');
  const lastTriggerPressed = useRef(false);

  const pos = useRef(new THREE.Vector3(0, GAME_CONFIG.PLAYER_HEIGHT, 0));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const colliders = useRef([]);

  const frontVector = useMemo(() => new THREE.Vector3(), []);
  const sideVector = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const tempEuler = useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), []);

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

    // 1. Aponta o Raycaster a partir do controlador VR ou da câmara
    if (isPresenting && rightController?.grp) {
      const controllerPos = new THREE.Vector3();
      const controllerDir = new THREE.Vector3(0, 0, -1);

      rightController.grp.getWorldPosition(controllerPos);
      controllerDir.applyQuaternion(rightController.grp.quaternion);

      raycaster.set(controllerPos, controllerDir);
    } else {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    }

    // 2. Procura alvos na cena
    const hitables = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        let curr = child;
        while (curr) {
          if (curr.userData && curr.userData.isTarget) {
            hitables.push(child);
            break;
          }
          curr = curr.parent;
        }
      }
    });

    // 3. Aplica o dano se houver colisão
    const intersects = raycaster.intersectObjects(hitables, true);
    if (intersects.length > 0) {
      let hitObj = intersects[0].object;
      let targetId = null;

      let curr = hitObj;
      while (curr) {
        if (curr.userData && curr.userData.targetId) {
          targetId = curr.userData.targetId;
          break;
        }
        curr = curr.parent;
      }

      if (targetId) {
        sfx.playHit();
        setHitMessage('INIMIGO ATINGIDO!');
        setTimeout(() => setHitMessage(''), 800);
        setEnemies((prev) =>
          prev
            .map((e) => {
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
            })
            .filter((e) => e.hp > 0)
        );
      }
    }
  }, [camera, scene, ammo, isReloading, isPresenting, rightController, setAmmo, setScore, setKills, setEnemies, setHitMessage, handleReload]);

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

    let vrForward = 0;
    let vrSide = 0;

    if (leftController?.inputSource?.gamepad) {
      const axes = leftController.inputSource.gamepad.axes;
      const rawX = axes[2] !== undefined && Math.abs(axes[2]) > 0.05 ? axes[2] : (axes[0] || 0);
      const rawY = axes[3] !== undefined && Math.abs(axes[3]) > 0.05 ? axes[3] : (axes[1] || 0);

      vrSide = Math.abs(rawX) > 0.08 ? rawX * 1.5 : 0;
      vrForward = Math.abs(rawY) > 0.08 ? rawY : 0;
    }

    if (rightController?.inputSource?.gamepad) {
      const trigger = rightController.inputSource.gamepad.buttons[0]?.value || 0;
      const isPressed = trigger > 0.5;
      if (isPressed && !lastTriggerPressed.current) {
        handleShoot();
      }
      lastTriggerPressed.current = isPressed;
    }

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

    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0) + vrForward;
    const moveX = (left ? 1 : 0) - (right ? 1 : 0) + vrSide;

    frontVector.set(0, 0, moveZ);
    sideVector.set(moveX, 0, 0);

    tempEuler.setFromQuaternion(camera.quaternion);
    const yawEuler = new THREE.Euler(0, tempEuler.y, 0);

    direction.subVectors(frontVector, sideVector);
    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(GAME_CONFIG.SPEED * delta).applyEuler(yawEuler);
    }
    direction.y = 0;

    moveWithCollision(direction);
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -GAME_CONFIG.ARENA_BOUNDS, GAME_CONFIG.ARENA_BOUNDS);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -GAME_CONFIG.ARENA_BOUNDS, GAME_CONFIG.ARENA_BOUNDS);

    if (isPresenting && player) {
      player.position.set(pos.current.x, pos.current.y - GAME_CONFIG.PLAYER_HEIGHT, pos.current.z);
    } else {
      camera.position.copy(pos.current);
    }

    playerPosRef.current = pos.current;
  });

  return (
    <>
      <Gun isShooting={isShooting} isReloading={isReloading} />
      {isPresenting && (
        <>
          <VRHUD camera={camera} />
          <ExitVRButton camera={camera} />
        </>
      )}
    </>
  );
}