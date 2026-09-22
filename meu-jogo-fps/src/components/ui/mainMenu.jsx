import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export function MainMenu() {
  const { resetGame } = useGameStore();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #101221 0%, #050508 100%)'
    }}>
      <div style={{
        background: 'rgba(18, 20, 32, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 240, 255, 0.2)',
        padding: '40px 50px', borderRadius: '16px', textAlign: 'center', width: '100%', maxWidth: '440px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)'
      }}>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: '900', letterSpacing: '2px', margin: '0 0 10px 0',
          color: '#00f0ff', textShadow: '0 0 12px rgba(0, 240, 255, 0.6)'
        }}>
          FPS SURVIVAL 3D
        </h1>
        <p style={{ color: '#8080a0', fontSize: '0.9rem', marginBottom: '25px' }}>
          Sobreviva por 10 minutos contra as hordas cibernéticas!
        </p>

        {!showInstructions ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              onClick={resetGame}
              style={{
                padding: '14px', fontSize: '1.1rem', fontWeight: '700', color: '#050508', backgroundColor: '#00f0ff',
                border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 15px rgba(0,240,255,0.4)'
              }}
            >
              Iniciar Sobrevivência
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              style={{
                padding: '12px', fontSize: '1rem', fontWeight: '600', color: '#00f0ff', backgroundColor: 'transparent',
                border: '2px solid #00f0ff', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Instruções
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#00f0ff', marginTop: 0, textAlign: 'center' }}>Objetivo & Controles</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.9rem', color: '#d0d0e0' }}>
              <li><strong>Objetivo:</strong> Elimine os inimigos e sobreviva por 10 min.</li>
              <li><strong>W, A, S, D:</strong> Movimentação</li>
              <li><strong>Espaço / R:</strong> Pular / Recarregar</li>
              <li><strong>Mouse / Clique:</strong> Mirar / Atirar</li>
              <li><strong>ESC:</strong> Pausar Jogo</li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                width: '100%', padding: '10px', marginTop: '15px', color: '#fff', backgroundColor: '#25283b',
                border: 'none', borderRadius: '6px', cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        )}
      </div>

      <footer style={{
        position: 'absolute', bottom: '25px', right: '30px', textAlign: 'right',
        backgroundColor: 'rgba(10, 10, 18, 0.8)', padding: '10px 18px', borderRadius: '8px',
        borderRight: '4px solid #00f0ff', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontWeight: 'bold', color: '#00f0ff', fontSize: '0.95rem' }}>Faculdade Senac Joinville</div>
        <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginTop: '2px' }}>
          Alunos: <strong>Pablo R. Paul</strong> e <strong>Eliezer V. Dias</strong>
        </div>
      </footer>
    </div>
  );
}