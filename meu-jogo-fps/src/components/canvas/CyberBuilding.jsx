import React from 'react';
import { CyberSign, randomSign } from './CyberSign';

const NEON_COLORS = ['#00f0ff', '#ff176b', '#8b5cf6', '#39ff88'];

export function CyberBuilding({ building, index }) {
  const [width, height, depth] = building.size;
  const accent = NEON_COLORS[index % NEON_COLORS.length];
  const windowRows = Math.max(2, Math.floor(height / 2));
  const windowColumns = Math.max(2, Math.floor(width / 1.4));
  const windows = [];

  for (let row = 0; row < windowRows; row += 1) {
    for (let column = 0; column < windowColumns; column += 1) {
      if ((row + column + index) % 3 !== 0) {
        windows.push(
          <mesh
            key={`${row}-${column}`}
            position={[
              -width / 2 + 0.7 + column * ((width - 1.4) / Math.max(1, windowColumns - 1)),
              -height / 2 + 1.2 + row * ((height - 2.2) / Math.max(1, windowRows - 1)),
              depth / 2 + 0.012,
            ]}
          >
            <planeGeometry args={[0.45, 0.65]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>,
        );
      }
    }
  }

  return (
    <group position={building.position}>
      <mesh castShadow userData={{ isCollider: true }}>
        <boxGeometry args={building.size} />
        <meshStandardMaterial color="#090d22" metalness={0.85} roughness={0.32} />
      </mesh>
      <mesh position={[0, height / 2 + 0.08, 0]}>
        <boxGeometry args={[width + 0.3, 0.16, depth + 0.3]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <group>{windows}</group>
      <CyberSign
        message={building.sign || randomSign(index)}
        position={[0, Math.min(height * 0.65, height / 2 - 0.5), depth / 2 + 0.04]}
        color={accent}
        scale={Math.min(1, width / 5)}
      />
      <pointLight position={[0, height / 2, depth / 2 + 1]} color={accent} intensity={1.3} distance={12} />
    </group>
  );
}
