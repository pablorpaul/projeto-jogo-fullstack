import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CONFIG } from '../../utils/constants';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function EndGameMenu() {
  const { gameState, score, kills, timeLeft, resetGame, setGameState } = useGameStore();
  const isVictory = gameState === 'VICTORY';
  const timeSurvived = GAME_CONFIG.GAME_TIME_LIMIT - timeLeft;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 35, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 5, 8, 0.9)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'rgba(18, 20, 32, 0.95)', padding: '40px 50px', borderRadius: '16px',
        border: `1px solid ${isVictory ? '#00f0ff' : '#ff0055'}`, textAlign: 'center', width: '360px',
        boxShadow: `0 0 35px ${isVictory ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 0, 85, 0.3)'}`
      }}>
        <h2 style={{
          fontSize: '2.2rem', fontWeight: '900', margin: '0 0 10px 0',
          color: isVictory ? '#00f0ff' : '#ff0055',
          textShadow: `0 0 12px ${isVictory ? '#00f0ff' : '#ff0055'}`
        }}>
          {isVictory ? 'VITÓRIA!' : 'GAME OVER'}
        </h2>
        <p style={{ color: '#a0a0c0', fontSize: '0.9rem', marginBottom: '20px' }}>
          {isVictory ? 'Você sobreviveu aos 10 minutos de ataque!' : 'Você foi superado pela horda inimiga.'}
        </p>

        <div style={{ backgroundColor: 'rgba(10, 10, 18, 0.6)', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
            <span style={{ color: '#8080a0' }}>Tempo Sobrevivido:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{formatTime(timeSurvived)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
            <span style={{ color: '#8080a0' }}>Inimigos Eliminados:</span>
            <span style={{ color: '#ff0055', fontWeight: 'bold' }}>{kills}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: '#8080a0' }}>Pontuação Total:</span>
            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>{score}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={resetGame}
            style={{
              padding: '12px', fontSize: '1rem', fontWeight: 'bold', color: '#050508',
              backgroundColor: isVictory ? '#00f0ff' : '#ff0055', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => setGameState('MENU')}
            style={{
              padding: '10px', fontSize: '0.95rem', color: '#a0a0c0', backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}