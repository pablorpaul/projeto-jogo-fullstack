import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { GAME_CONFIG } from '../utils/constants';
import { sfx } from '../utils/soundEffects';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState('MENU');
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [ammo, setAmmo] = useState(GAME_CONFIG.MAX_AMMO);
  const [playerHp, setPlayerHp] = useState(GAME_CONFIG.PLAYER_MAX_HP);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_TIME_LIMIT);
  const [isReloading, setIsReloading] = useState(false);
  const [hitMessage, setHitMessage] = useState('');
  const [damageFlash, setDamageFlash] = useState(false);
  const [enemies, setEnemies] = useState([]);
  const playerPosRef = useRef(new THREE.Vector3(0, GAME_CONFIG.PLAYER_HEIGHT, 0));
  const gameStateRef = useRef('MENU');

  const changeGameState = useCallback((nextState) => {
    gameStateRef.current = nextState;
    setGameState(nextState);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setKills(0);
    setAmmo(GAME_CONFIG.MAX_AMMO);
    setPlayerHp(GAME_CONFIG.PLAYER_MAX_HP);
    setTimeLeft(GAME_CONFIG.GAME_TIME_LIMIT);
    setIsReloading(false);
    setHitMessage('');
    setDamageFlash(false);
    setEnemies([]);
    playerPosRef.current.set(0, GAME_CONFIG.PLAYER_HEIGHT, 0);
    changeGameState('PLAYING');
  }, [changeGameState]);

  const returnToMenu = useCallback(() => {
    setEnemies([]);
    setIsReloading(false);
    setHitMessage('');
    setDamageFlash(false);
    changeGameState('MENU');
  }, [changeGameState]);

  const takeDamage = useCallback((amount) => {
    if (gameStateRef.current !== 'PLAYING') return;

    setPlayerHp((prev) => {
      if (gameStateRef.current !== 'PLAYING' || prev <= 0) return prev;
      const nextHp = Math.max(0, prev - amount);
      if (nextHp === 0) {
        setEnemies([]);
        changeGameState('GAMEOVER');
      }
      return nextHp;
    });

    sfx.playPlayerDamage();
    setDamageFlash(true);
    window.setTimeout(() => setDamageFlash(false), 200);
  }, [changeGameState]);

  const value = {
    gameState,
    setGameState: changeGameState,
    score, setScore, kills, setKills, ammo, setAmmo,
    playerHp, setPlayerHp, timeLeft, setTimeLeft,
    isReloading, setIsReloading, hitMessage, setHitMessage,
    damageFlash, enemies, setEnemies, resetGame, returnToMenu,
    takeDamage, playerPosRef,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameStore() {
  return useContext(GameContext);
}
