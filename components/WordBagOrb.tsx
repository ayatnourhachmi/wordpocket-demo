import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Word } from '../types';
import { X, Edit2, Trash2 } from 'lucide-react';

interface WordBagOrbProps {
  words: Word[];
  onWordClick: (word: Word) => void;
}

interface Particle {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  vx: number; // velocity x
  vy: number; // velocity y
  scale: number;
}

export const WordBagOrb: React.FC<WordBagOrbProps> = ({ words, onWordClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);

  // Limit floating words to 20 recent ones to prevent overcrowding/lag
  const displayWords = useMemo(() => words.slice(0, 20), [words]);

  // Initialize Particles
  useEffect(() => {
    const newParticles = displayWords.map((word) => ({
      id: word.id,
      x: 50 + (Math.random() - 0.5) * 40, // Start near center
      y: 50 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 0.15, // Random slow velocity
      vy: (Math.random() - 0.5) * 0.15,
      scale: 0.8 + Math.random() * 0.4, // Random size variation
    }));
    setParticles(newParticles);
  }, [displayWords]);

  // Animation Loop
  const animate = () => {
    setParticles((prevParticles) => {
      return prevParticles.map((p) => {
        let { x, y, vx, vy } = p;

        // If hovering, drastically slow down movement for easier clicking
        const speedFactor = isHovering ? 0.2 : 1.0;

        x += vx * speedFactor;
        y += vy * speedFactor;

        // Boundary Check (Circle)
        // Center is (50, 50). Radius is approx 45% (to keep padding).
        const dx = x - 50;
        const dy = y - 50;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = 42; 

        if (dist > maxRadius) {
          // Bounce back towards center
          const angle = Math.atan2(dy, dx);
          const targetX = 50 + Math.cos(angle) * maxRadius;
          const targetY = 50 + Math.sin(angle) * maxRadius;
          
          x = targetX;
          y = targetY;

          // Reflect velocity with some damping and randomization
          vx = -vx * 0.8 + (Math.random() - 0.5) * 0.05;
          vy = -vy * 0.8 + (Math.random() - 0.5) * 0.05;
        }

        return { ...p, x, y, vx, vy };
      });
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovering]); // Re-bind when hover state changes to update speed factor logic

  if (words.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto aspect-square rounded-full bg-gradient-to-br from-white to-gray-50 shadow-soft border border-dashed border-gray-300 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-brand-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
         <span className="text-4xl mb-4 relative z-10">✨</span>
         <h3 className="text-lg font-bold text-dark-900 relative z-10">Your Bag is Empty</h3>
         <p className="text-sm text-gray-500 relative z-10">Add words to see them float here!</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[500px] aspect-square mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Orb Background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e1f8cc] via-white to-[#c8f2a1] shadow-glow opacity-80 backdrop-blur-3xl border border-white/50 transition-transform duration-700 ease-out hover:scale-[1.02]">
         {/* Inner Shine */}
         <div className="absolute top-10 left-10 w-2/3 h-2/3 bg-white opacity-40 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      {/* Floating Particles */}
      {particles.map((p, i) => {
        const wordData = displayWords.find(w => w.id === p.id);
        if (!wordData) return null;

        return (
          <button
            key={p.id}
            onClick={() => onWordClick(wordData)}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) scale(${p.scale})`,
            }}
            className="absolute z-10 group/chip"
          >
            <div className="
              relative
              px-4 py-2 
              bg-white/80 backdrop-blur-md 
              rounded-full 
              shadow-sm border border-brand-200
              text-dark-900 font-bold text-sm
              transition-all duration-300
              group-hover/chip:scale-110 group-hover/chip:bg-brand-500 group-hover/chip:border-brand-600 group-hover/chip:shadow-lg group-hover/chip:z-50
              cursor-pointer
              whitespace-nowrap
            ">
              {wordData.word}
              
              {/* Tooltip on Hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 hidden group-hover/chip:block z-50 whitespace-normal">
                 <div className="bg-dark-900 text-white text-xs p-3 rounded-xl shadow-xl text-center border border-white/10 relative">
                    {/* Triangle */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-900 rotate-45 border-t border-l border-white/10"></div>
                    {wordData.translation && <div className="font-semibold text-brand-300 text-sm mb-1">{wordData.translation}</div>}
                    {wordData.exampleSentence && <div className="italic text-gray-400">"{wordData.exampleSentence}"</div>}
                 </div>
              </div>
            </div>
          </button>
        );
      })}
      
      {words.length > 20 && (
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-dark-400 bg-white/50 px-3 py-1 rounded-full">
            + {words.length - 20} more below
         </div>
      )}
    </div>
  );
};