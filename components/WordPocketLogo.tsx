import React from 'react';

export const WordPocketLogo: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pocket Shape */}
      <path 
        d="M10 20 
           C 10 10, 90 10, 90 20 
           L 90 60 
           C 90 85, 65 95, 50 95 
           C 35 95, 10 85, 10 60 
           Z" 
        fill="#78D64B" 
      />
      
      {/* Darker Inner Pocket Lip/Shadow */}
      <path 
        d="M10 20 
           C 10 30, 90 30, 90 20
           C 90 25, 10 25, 10 20" 
        fill="#5bbc2e" 
        opacity="0.5"
      />
      
      {/* Stitching Details */}
      <path 
        d="M15 60 C 15 80, 35 90, 50 90 C 65 90, 85 80, 85 60" 
        stroke="#2d5c1b" 
        strokeWidth="2" 
        strokeDasharray="5 5" 
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />

      {/* Eyes */}
      <circle cx="35" cy="45" r="12" fill="white" stroke="#2d5c1b" strokeWidth="2"/>
      <circle cx="65" cy="45" r="12" fill="white" stroke="#2d5c1b" strokeWidth="2"/>
      
      {/* Pupils */}
      <circle cx="35" cy="45" r="5" fill="#0A1F18"/>
      <circle cx="65" cy="45" r="5" fill="#0A1F18"/>
      
      {/* Shine on pupils */}
      <circle cx="37" cy="43" r="2" fill="white"/>
      <circle cx="67" cy="43" r="2" fill="white"/>

      {/* Button/Mouth thing */}
      <circle cx="50" cy="75" r="4" stroke="#2d5c1b" strokeWidth="2" opacity="0.5"/>
    </svg>
  );
};