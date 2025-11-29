import React from 'react';

/**
 * Logo component
 * - variant="brand" or "gradient": render the new GenFuture icon from public assets (/genfuture-icon.svg)
 * - variant="dark": render legacy inline SVG (preserves existing header styling)
 */
const Logo = ({ size = 'medium', variant = 'brand', srcOverride = null, unstyled = false, alt = 'GenFuture Career' }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  const cls = sizes[size] || sizes.medium;

  // External or unstyled icon: render raw image exactly as provided (no masks, no rounding, no filters)
  if (variant === 'external' || unstyled) {
    const src = srcOverride || import.meta.env.VITE_SIGNUP_ICON_URL || '/genfuture-icon.svg';
    return (
      <div className={`${cls} flex items-center justify-center relative`}>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Brand icon (replicated design), served from Vite public directory
  if (variant === 'brand' || variant === 'gradient') {
    return (
      <div className={`${cls} flex items-center justify-center relative`}>
        <img
          src={import.meta.env.VITE_BRAND_ICON_URL || '/genfuture-icon.svg'}
          alt={alt}
          className="w-full h-full rounded-full shadow-lg"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Legacy inline SVG (used by header with variant="dark")
  return (
    <div className={`${cls} flex items-center justify-center relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle with gradient */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
          className="drop-shadow-lg"
        />
        
        {/* Inner design - represents growth/future path */}
        <path
          d="M25 65 Q50 35 75 65"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className="drop-shadow-sm"
        />
        
        {/* Star at the peak - represents achievement */}
        <path
          d="M50 30 L52 38 L60 38 L54 43 L56 51 L50 46 L44 51 L46 43 L40 38 L48 38 Z"
          fill="white"
          className="drop-shadow-sm"
        />
        
        {/* Dots representing steps/progress */}
        <circle cx="35" cy="55" r="2" fill="white" opacity="0.8" />
        <circle cx="50" cy="45" r="2" fill="white" opacity="0.9" />
        <circle cx="65" cy="55" r="2" fill="white" opacity="0.8" />
        
        {/* Gradient definition - Bold Youthful */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;