import React from 'react';

const Logo = ({ size = 48, color1 = "#6a11cb", color2 = "#2575fc", withText = true, sizeText = 'text-2xl' }) => {
  return (
    <div className="flex items-center gap-3">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width={size} 
        height={size}
        className="inline-block"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        
        <rect width="24" height="24" rx="5" fill="url(#gradient)" />
        
        <g transform="translate(5, 6)" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
          <path d="M2,7 L5,10 L9,4" fill="none" />
          <rect x="11" y="3" width="8" height="2" rx="1" fill="#ffffff" opacity="0.8" />
          
          <path d="M2,12 L5,15 L9,9" fill="none" />
          <rect x="11" y="10" width="6" height="2" rx="1" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>

      {withText && (
        <span className={`${sizeText} font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          TaskList
        </span>
      )}
    </div>
  );
};

export default Logo;