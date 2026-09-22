import React from 'react';

export function Crosshair() {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      pointerEvents: 'none', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ width: '4px', height: '4px', backgroundColor: '#00f0ff', borderRadius: '50%', boxShadow: '0 0 6px #00f0ff' }} />
      <div style={{ position: 'absolute', width: '18px', height: '2px', backgroundColor: 'rgba(0, 240, 255, 0.7)' }} />
      <div style={{ position: 'absolute', width: '2px', height: '18px', backgroundColor: 'rgba(0, 240, 255, 0.7)' }} />
      <div style={{ position: 'absolute', width: '28px', height: '28px', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '50%' }} />
    </div>
  );
}