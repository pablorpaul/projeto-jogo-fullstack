import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { GAME_CONFIG } from '../utils/constants';
import { sfx } from '../utils/soundEffects';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState('MENU'); // 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [ammo, setAmmo] = useState(GAME_CONFIG.MAX_AMMO);
  const [playerHp, setPlayerHp] = useState(GAME_CONFIG.PLAYER_MAX_HP);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_TIME_LIMIT);
  const [isReloading, setIsReloading] = useState(false);
  const [hitMessage, setHitMessage] = useState('');
  const [damageFlash, setDamageFlash] = useState(false);
  const [enemies, setEnemies] = useState([]);

  const playerPosRef = useRef({ x: 0, y: GAME_CONFIG.PLAYER_HEIGHT, z: 0 });

  const resetGame = useCallback(() => {
    setScore(0);
    setKills(0);
    setAmmo(GAME_CONFIG.MAX_AMMO);
    setPlayerHp(GAME_CONFIG.PLAYER_MAX_HP);
    setTimeLeft(GAME_CONFIG.GAME_TIME_LIMIT);
    setEnemies([]);
    setGameState('PLAYING');
  }, []);

  const takeDamage = useCallback((amount) => {
    setPlayerHp((prev) => {
      const newHp = Math.max(0, prev - amount);
      if (newHp === 0) {
        setGameState('GAMEOVER');
      }
      return newHp;
    });
    sfx.playPlayerDamage();
    setDamageFlash(true);
    setTimeout(() => setDamageFlash(false), 200);
  }, []);

  const value = {
    gameState,
    setGameState,
    score,
    setScore,
    kills,
    setKills,
    ammo,
    setAmmo,
    playerHp,
    setPlayerHp,
    timeLeft,
    setTimeLeft,
    isReloading,
    setIsReloading,
    hitMessage,
    setHitMessage,
    damageFlash,
    enemies,
    setEnemies,
    resetGame,
    takeDamage,
    playerPosRef,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameStore() {
  return useContext(GameContext);
}