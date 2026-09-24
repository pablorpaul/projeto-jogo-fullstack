import React, { useMemo } from 'react';
import * as THREE from 'three';

const SIGN_MESSAGES = ['VIRUS DETECTED', 'MALWARE DETECTED', 'SYSTEM BREACH', 'VIRUS REMOVED'];

function createSignTexture(message, accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  context.fillStyle = '#050817';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = accent;
  context.lineWidth = 12;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  context.fillStyle = accent;
  context.font = 'bold 58px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = accent;
  context.shadowBlur = 24;
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function CyberSign({ message, position, rotation = [0, 0, 0], color = '#00f0ff', scale = 1 }) {
  const texture = useMemo(() => createSignTexture(message, color), [message, color]);

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[4.8, 1.6]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

export function randomSign(index) {
  return SIGN_MESSAGES[index % SIGN_MESSAGES.length];
}
