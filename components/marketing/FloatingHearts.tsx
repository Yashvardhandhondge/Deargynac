'use client';

import type { CSSProperties } from 'react';

export default function FloatingHearts() {
  const hearts = [
    { left: '5%', delay: '0s', duration: '8s', size: 16, opacity: 0.15 },
    { left: '15%', delay: '2s', duration: '10s', size: 12, opacity: 0.1 },
    { left: '25%', delay: '4s', duration: '9s', size: 20, opacity: 0.12 },
    { left: '35%', delay: '1s', duration: '11s', size: 14, opacity: 0.08 },
    { left: '45%', delay: '3s', duration: '8s', size: 18, opacity: 0.1 },
    { left: '55%', delay: '5s', duration: '10s', size: 12, opacity: 0.15 },
    { left: '65%', delay: '2s', duration: '9s', size: 16, opacity: 0.1 },
    { left: '75%', delay: '6s', duration: '11s', size: 14, opacity: 0.12 },
    { left: '85%', delay: '1s', duration: '8s', size: 20, opacity: 0.08 },
    { left: '92%', delay: '4s', duration: '10s', size: 12, opacity: 0.1 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--opacity); }
          90% { opacity: var(--opacity); }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {hearts.map((heart, i) => {
        const style: CSSProperties & { '--opacity': string } = {
          position: 'absolute',
          left: heart.left,
          bottom: '-20px',
          fontSize: heart.size,
          '--opacity': String(heart.opacity),
          animation: `floatHeart ${heart.duration} ${heart.delay} infinite ease-in-out`,
          color: '#C2185B',
        };
        return (
          <div key={i} style={style}>
            ♥️
          </div>
        );
      })}
    </div>
  );
}
