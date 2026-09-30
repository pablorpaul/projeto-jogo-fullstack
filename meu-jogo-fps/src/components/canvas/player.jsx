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

    // Se estiver em VR com controle direito ativo, dispara a partir da posição e direção da mão
    if (isPresenting && rightController?.grp) {
      const controllerPos = new THREE.Vector3();
      const controllerDir = new THREE.Vector3(0, 0, -1);

      rightController.grp.getWorldPosition(controllerPos);
      controllerDir.applyQuaternion(rightController.grp.quaternion);

      raycaster.set(controllerPos, controllerDir);
    } else {
      // No PC (2D), dispara a partir do centro da câmera
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    }

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
  }, [camera, scene, ammo, isReloading, isPresenting, rightController, setAmmo, setScore, setKills, setEnemies, setHitMessage, handleReload]);