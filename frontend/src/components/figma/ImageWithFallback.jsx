import React, { useEffect, useMemo, useState } from 'react';

/**
 * ImageWithFallback
 * - Progressive image component with graceful fallbacks and loading shimmer.
 * - Source priority: primary src -> provided fallbackSrcs -> local /signup-icon.svg -> /genfuture-icon.svg -> tiny placeholder.
 *
 * Props:
 * - src: string (primary image URL)
 * - alt: string (required for accessibility; defaults to 'GenFuture image')
 * - className: string (applied to img element, e.g., Tailwind utility classes)
 * - style: object (inline styles for the wrapper)
 * - fallbackSrcs: string[] (additional candidate URLs in priority order)
 * - lazy: boolean (true => loading="lazy", false => loading="eager")
 * - sizes: string (responsive sizes attribute)
 * - srcSet: string (responsive srcset attribute)
 * - onLoad: function (called when an image in the chain loads)
 * - onError: function (called when an image fails to load exhaustively)
 * - decode: boolean (attempt HTMLImageElement.decode() for better rendering, default true)
 *
 * Notes:
 * - Tailwind-friendly: pass classes like "w-full h-full object-cover rounded-lg overflow-hidden".
 * - Works seamlessly with Vite public assets (/signup-icon.svg, /genfuture-icon.svg).
 */
const ImageWithFallback = ({
  src,
  alt = 'GenFuture image',
  className = '',
  style,
  fallbackSrcs = [],
  lazy = true,
  sizes,
  srcSet,
  onLoad,
  onError,
  decode = true,
  ...rest
}) => {
  // Minimal inline SVG as a last-resort placeholder (data URI)
  const tinyPlaceholder = useMemo(
    () =>
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' role='img' aria-label='placeholder'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#e2e8f0'/>
              <stop offset='100%' stop-color='#cbd5e1'/>
            </linearGradient>
          </defs>
          <rect x='0' y='0' width='64' height='64' rx='10' fill='url(#g)' />
          <circle cx='32' cy='26' r='10' fill='#94a3b8'/>
          <rect x='16' y='42' width='32' height='8' rx='4' fill='#94a3b8' />
        </svg>
      `),
    []
  );

  // Build a deterministic source chain
  const sourceChain = useMemo(() => {
    const chain = [];
    if (src) chain.push(src);

    // user-provided fallbacks
    for (const f of fallbackSrcs) {
      if (f && !chain.includes(f)) chain.push(f);
    }

    // local assets
    ['/signup-icon.svg', '/genfuture-icon.svg', tinyPlaceholder].forEach((f) => {
      if (!chain.includes(f)) chain.push(f);
    });

    return chain;
  }, [src, fallbackSrcs, tinyPlaceholder]);

  const [index, setIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(sourceChain[0] || tinyPlaceholder);
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  useEffect(() => {
    // Reset when chain changes (e.g., new src)
    setIndex(0);
    setCurrentSrc(sourceChain[0] || tinyPlaceholder);
    setStatus('loading');
  }, [sourceChain, tinyPlaceholder]);

  const advanceFallback = () => {
    if (index < sourceChain.length - 1) {
      const next = index + 1;
      setIndex(next);
      setCurrentSrc(sourceChain[next]);
      setStatus('loading');
    } else {
      setStatus('error');
    }
  };

  const handleLoad = async (e) => {
    try {
      if (decode && e?.target?.decode) {
        // decode improves rendering; ignore failures silently
        await e.target.decode();
      }
    } catch {
      // no-op
    }
    setStatus('loaded');
    if (typeof onLoad === 'function') onLoad(e);
  };

  const handleError = (e) => {
    // Try the next fallback
    const beforeAdvance = index;
    advanceFallback();
    // If we exhausted all, call onError once.
    if (beforeAdvance === sourceChain.length - 1) {
      if (typeof onError === 'function') onError(e);
    }
  };

  const loadingAttr = lazy ? 'lazy' : 'eager';

  return (
    <div className="relative" style={style}>
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        loading={loadingAttr}
        decoding="async"
        fetchpriority={lazy ? 'auto' : 'high'}
        sizes={sizes}
        srcSet={srcSet}
        onLoad={handleLoad}
        onError={handleError}
        crossOrigin="anonymous"
        {...rest}
      />

      {status === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            // Subtle shimmer
            background:
              'linear-gradient(90deg, rgba(226,232,240,0.6) 25%, rgba(226,232,240,0.85) 50%, rgba(226,232,240,0.6) 75%)',
            backgroundSize: '200% 100%',
            animation: 'gf-shimmer 1.4s ease-in-out infinite',
            borderRadius: 'inherit',
          }}
        />
      )}

      <style>{`
        @keyframes gf-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ImageWithFallback;
// Also provide a named export for compatibility with code snippets
export { ImageWithFallback };