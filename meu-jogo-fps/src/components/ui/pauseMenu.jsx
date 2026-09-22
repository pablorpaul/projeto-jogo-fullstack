import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export function PauseMenu() {
  const { setGameState, resetGame } = useGameStore();

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'rgba(20, 22, 35, 0.9)', padding: '35px 45px', borderRadius: '16px',
        border: '1px solid rgba(0, 240, 255, 0.3)', textAlign: 'center', width: '320px'
      }}>
        <h2 style={{ color: '#00f0ff', margin: '0 0 20px 0', letterSpacing: '2px' }}>JOGO PAUSADO</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setGameState('PLAYING')}
            style={{
              padding: '12px', fontSize: '1rem', fontWeight: 'bold', color: '#050508',
              backgroundColor: '#00f0ff', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Continuar
          </button>
          <button
            onClick={resetGame}
            style={{
              padding: '10px', fontSize: '0.95rem', color: '#fff', backgroundColor: '#202438',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Reiniciar Partida
          </button>
          <button
            onClick={() => setGameState('MENU')}
            style={{
              padding: '10px', fontSize: '0.95rem', color: '#ff0055', backgroundColor: 'transparent',
              border: '1px solid #ff0055', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Sair para o Menu
          </button>
        </div>
      </div>
    </div>
  );
}