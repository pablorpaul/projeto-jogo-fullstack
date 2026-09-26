import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls } from '@react-three/drei';
import { GAME_CONFIG, KEYBOARD_MAP } from './utils/constants';
import { GameProvider, useGameStore } from './store/useGameStore';
import { MainMenu } from './components/ui/MainMenu/mainMenu';
import { PauseMenu } from './components/ui/pauseMenu';
import { EndGameMenu } from './components/ui/endGameMenu';
import { HUD } from './components/ui/HUD';
import { CyberArena } from './components/canvas/cyberArena';
import { Player } from './components/canvas/player';

function GameScreen() {
  const { gameState, setGameState } = useGameStore();

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement && gameState === 'PLAYING') setGameState('PAUSED');
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, [gameState, setGameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING' && document.pointerLockElement) document.exitPointerLock();
  }, [gameState]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050508', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
      {gameState === 'MENU' && <MainMenu />}
      {gameState === 'PAUSED' && <PauseMenu />}
      {(gameState === 'GAMEOVER' || gameState === 'VICTORY') && <EndGameMenu />}
      {gameState !== 'MENU' && <HUD />}
      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas shadows camera={{ fov: 75, position: [0, GAME_CONFIG.PLAYER_HEIGHT, 0] }}>
          <CyberArena />
          {gameState === 'PLAYING' && <><PointerLockControls /><Player /></>}
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default function App() {
  return <GameProvider><GameScreen /></GameProvider>;
}
