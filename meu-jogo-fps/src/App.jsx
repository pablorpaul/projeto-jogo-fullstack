import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr'; // <-- IMPORTAÇÃO DO WEBXR
import { GAME_CONFIG, KEYBOARD_MAP } from './utils/constants';
import { GameProvider, useGameStore } from './store/useGameStore';
import { MainMenu } from './components/ui/MainMenu/mainMenu';
import { PauseMenu } from './components/ui/pauseMenu';
import { EndGameMenu } from './components/ui/endGameMenu';
import { HUD } from './components/ui/HUD';
import { CyberArena } from './components/canvas/cyberArena';
import { Player } from './components/canvas/player';

// Cria a store global do WebXR
const xrStore = createXRStore();

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

      {/* Botão para entrar no modo VR (Visível a partir da tela de jogo ou menu) */}
      <button
        onClick={() => xrStore.enterVR()}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '12px 24px',
          background: '#00f0ff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 10px #00f0ff'
        }}
      >
        MODO VR 🥽
      </button>

      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas shadows camera={{ fov: 75, position: [0, GAME_CONFIG.PLAYER_HEIGHT, 0] }}>
          {/* Envolve toda a cena do Three.js no XR */}
          <XR store={xrStore}>
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