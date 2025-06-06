import React from 'react';

interface CircularLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
}

export default function CircularLoader({ loading = false, children }: CircularLoaderProps) {
  return (
    <div className="relative flex items-center justify-center w-[520px] h-[520px]">
      {/* Circular segmented loader */}
      <svg
        className={`absolute inset-0 w-full h-full ${loading ? 'animate-spin-slow' : ''}`}
        viewBox="0 0 260 260"
      >
        {[...Array(40)].map((_, i) => (
          <rect
            key={i}
            x={127}
            y={30}
            width={6}
            height={40}
            rx={3}
            fill={loading && i < 8 ? '#FFC300' : '#fff4'}
            opacity={loading ? (i < 8 ? 1 : 0.5) : 0.5}
            transform={`rotate(${i * 9} 130 130)`}
          />
        ))}
      </svg>
      {/* Centered content (form) */}
      <div className="relative z-10 w-[340px] flex items-center justify-center min-h-[340px]">
        {children}
      </div>
    </div>
  );
}

// Add this to your tailwind.config.js for slow spin:
// extend: { animation: { 'spin-slow': 'spin 2s linear infinite' } } 