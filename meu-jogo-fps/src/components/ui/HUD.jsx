import React from 'react';
import { Crosshair } from './Crosshair';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CONFIG } from '../../utils/constants';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function HUD() {
  const { score, kills, ammo, playerHp, timeLeft, isReloading, hitMessage, damageFlash } = useGameStore();
  const hpPercentage = (playerHp / GAME_CONFIG.PLAYER_MAX_HP) * 100;

  return (
    <>
      <Crosshair />

      {damageFlash && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
          backgroundColor: 'rgba(255, 0, 85, 0.25)', boxShadow: 'inset 0 0 80px rgba(255, 0, 0, 0.8)'
        }} />
      )}

      {hitMessage && (
        <div style={{
          position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)',
          color: '#00f0ff', fontWeight: 'bold', fontSize: '1.1rem', textShadow: '0 0 10px #00f0ff',
          pointerEvents: 'none', zIndex: 20
        }}>
          {hitMessage}
        </div>
      )}

      {}
      <div style={{
        position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20,
        backgroundColor: 'rgba(10, 12, 20, 0.85)', padding: '10px 24px', borderRadius: '12px',
        border: '1px solid rgba(0, 240, 255, 0.3)', backdropFilter: 'blur(6px)', textAlign: 'center',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#8080a0', letterSpacing: '1px', textTransform: 'uppercase' }}>
          SOBREVIVÊNCIA
        </div>
        <div style={{
          fontSize: '2rem', fontWeight: '900', letterSpacing: '2px',
          color: timeLeft <= 60 ? '#ff0055' : '#00f0ff',
          textShadow: timeLeft <= 60 ? '0 0 10px #ff0055' : '0 0 10px #00f0ff'
        }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {}
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 20, display: 'flex', gap: '20px',
        backgroundColor: 'rgba(10, 12, 20, 0.8)', padding: '12px 20px', borderRadius: '10px',
        border: '1px solid rgba(0, 240, 255, 0.2)', pointerEvents: 'none', backdropFilter: 'blur(4px)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#8080a0', textTransform: 'uppercase' }}>PONTUAÇÃO</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#00f0ff' }}>{score}</div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#8080a0', textTransform: 'uppercase' }}>INIMIGOS ELIMINADOS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff0055' }}>{kills}</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '25px', left: '25px', zIndex: 20,
        backgroundColor: 'rgba(10, 12, 20, 0.85)', padding: '14px 20px', borderRadius: '10px',
        border: '1px solid rgba(0, 240, 255, 0.2)', pointerEvents: 'none', backdropFilter: 'blur(4px)', width: '220px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#8080a0', textTransform: 'uppercase' }}>VIDA (HP)</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: hpPercentage > 30 ? '#00f0ff' : '#ff0055' }}>
            {playerHp} / {GAME_CONFIG.PLAYER_MAX_HP}
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            width: `${hpPercentage}%`, height: '100%',
            backgroundColor: hpPercentage > 30 ? '#00f0ff' : '#ff0055',
            boxShadow: hpPercentage > 30 ? '0 0 10px #00f0ff' : '0 0 10px #ff0055',
            transition: 'width 0.2s linear'
          }} />
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '25px', right: '25px', zIndex: 20,
        backgroundColor: 'rgba(10, 12, 20, 0.8)', padding: '14px 24px', borderRadius: '10px',
        border: '1px solid rgba(0, 240, 255, 0.2)', textAlign: 'right', pointerEvents: 'none', backdropFilter: 'blur(4px)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#8080a0', textTransform: 'uppercase' }}>MUNIÇÃO</div>
        <div style={{ fontSize: '2rem', fontWeight: '900', color: isReloading ? '#ff0055' : '#00f0ff' }}>
          {isReloading ? 'RECARREGANDO...' : `${ammo} / ${GAME_CONFIG.MAX_AMMO}`}
        </div>
      </div>
    </>
  );
}