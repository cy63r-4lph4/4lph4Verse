import React from 'react';
import { AuraRank } from '@/types/contracts';

interface AuraRingProps {
  aura: number;
  rank: AuraRank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
}

export const AuraRing: React.FC<AuraRingProps> = ({ 
  aura, 
  rank, 
  size = 'md', 
  showProgress = false 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  const nextRankIndex = Math.min(5, Math.floor(aura / 1000));
  const currentRankMin = rank.minAura;
  const nextRankMin = nextRankIndex < 5 ? (nextRankIndex + 1) * 1000 : rank.minAura;
  const progress = nextRankMin > currentRankMin ? 
    Math.min(100, ((aura - currentRankMin) / (nextRankMin - currentRankMin)) * 100) : 100;

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center aura-ring`}>
      {/* Outer Aura Glow */}
      <div 
        className="absolute inset-0 rounded-full animate-aura-pulse"
        style={{ 
          background: `conic-gradient(from 0deg, ${rank.color} 0deg, transparent 120deg, ${rank.color} 240deg, transparent 360deg)`,
          filter: 'blur(8px)',
          opacity: 0.7
        }}
      />
      
      {/* Progress Ring */}
      {showProgress && (
        <svg 
          className="absolute inset-2 -rotate-90" 
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={rank.color}
            strokeWidth="2"
            fill="none"
            opacity="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={rank.color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${progress * 2.89} 289`}
            className="transition-all duration-2000 ease-out"
            style={{ 
              filter: 'drop-shadow(0 0 6px currentColor)',
              strokeLinecap: 'round'
            }}
          />
        </svg>
      )}
      
      {/* Inner Core */}
      <div 
        className="relative z-10 rounded-full bg-gradient-glass backdrop-blur-mystic border-2 flex flex-col items-center justify-center font-tech"
        style={{ 
          borderColor: rank.color,
          width: size === 'xl' ? '75%' : size === 'lg' ? '70%' : '65%',
          height: size === 'xl' ? '75%' : size === 'lg' ? '70%' : '65%',
          boxShadow: `inset 0 0 20px ${rank.color}20`
        }}
      >
        <div 
          className="text-center font-bold"
          style={{ color: rank.color }}
        >
          <div className={`
            ${size === 'xl' ? 'text-3xl' : size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm'}
            leading-none
          `}>
            {aura.toLocaleString()}
          </div>
          <div className={`
            ${size === 'xl' ? 'text-base' : size === 'lg' ? 'text-sm' : 'text-xs'} 
            opacity-90 mt-1 font-mystic
          `}>
            {rank.name.toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Dragon Energy Particles */}
      <div className="dragon-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="cosmic-particle"
            style={{ 
              background: rank.color,
              top: `${15 + (i * 12)}%`,
              left: `${10 + (i * 15)}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i}s`
            }}
          />
        ))}
      </div>
      
      {/* Mystical Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full animate-glow-expand pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${rank.color}20 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};
