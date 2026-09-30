import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls } from '@react-three/drei';
import { VRButton, Controllers, Hands, XR, useXR } from '@react-three/xr';
import { GAME_CONFIG, KEYBOARD_MAP } from './utils/constants';
import { GameProvider, useGameStore } from './store/useGameStore';
import { MainMenu } from './components/ui/MainMenu/mainMenu';
import { PauseMenu } from './components/ui/pauseMenu';
import { EndGameMenu } from './components/ui/endGameMenu';
import { HUD } from './components/ui/HUD';
import { CyberArena } from './components/canvas/cyberArena';
import { Player } from './components/canvas/player';

// Componente interno para escutar a entrada no VR e ativar o jogo
function VRManager() {
  const { isPresenting } = useXR();
  const { setGameState, gameState } = useGameStore();

  useEffect(() => {
    if (isPresenting && gameState !== 'PLAYING') {
      setGameState('PLAYING');
    }
  }, [isPresenting, gameState, setGameState]);

  return null;
}

function GameScreen() {
  const { gameState, setGameState } = useGameStore();

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement && gameState === 'PLAYING') {
        setGameState('PAUSED');
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, [gameState, setGameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING' && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [gameState]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050508', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
      {gameState === 'MENU' && <MainMenu />}
      {gameState === 'PAUSED' && <PauseMenu />}
      {(gameState === 'GAMEOVER' || gameState === 'VICTORY') && <EndGameMenu />}
      {gameState !== 'MENU' && <HUD />}

      <VRButton />

      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas camera={{ fov: 75, position: [0, GAME_CONFIG.PLAYER_HEIGHT, 0], near: 0.1, far: 300 }}>
          <XR>
            <VRManager />
            <Controllers />
            <Hands />
            <CyberArena />
            {gameState === 'PLAYING' && (
              <>
                <PointerLockControls />
                <Player />
              </>
            )}
          </XR>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default function App() {
  return <GameProvider><GameScreen /></GameProvider>;
}