import React from 'react';
import ImageWithFallback from './figma/ImageWithFallback';

/**
 * SignupIconBlock
 * - Visual showcase of the project signup icon for the register view.
 * - Mirrors the user's requested design (sizes, circular, card usage, and large hero).
 * - Safe within the app: purely presentational, no side effects.
 */
export default function SignupIconBlock() {
  return (
    <div className="w-full flex flex-col items-center gap-8 p-4">
      <h2 className="text-slate-800 text-lg font-semibold">Genfuture Career Icon</h2>

      {/* Sizes row */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Small (64px) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
            <ImageWithFallback
              src="/signup-icon.svg"
              fallbackSrcs={['/genfuture-icon.svg']}
              alt="GenFuture signup icon small"
              className="w-full h-full object-cover"
              lazy
            />
          </div>
          <span className="text-slate-600 text-xs">64px</span>
        </div>

        {/* Medium (96px) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
            <ImageWithFallback
              src="/signup-icon.svg"
              fallbackSrcs={['/genfuture-icon.svg']}
              alt="GenFuture signup icon medium"
              className="w-full h-full object-cover"
              lazy
            />
          </div>
          <span className="text-slate-600 text-xs">96px</span>
        </div>

        {/* Large (128px) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="/signup-icon.svg"
              fallbackSrcs={['/genfuture-icon.svg']}
              alt="GenFuture signup icon large"
              className="w-full h-full object-cover"
              lazy
            />
          </div>
          <span className="text-slate-600 text-xs">128px</span>
        </div>
      </div>

      {/* Circular avatar variant */}
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white">
          <ImageWithFallback
            src="/signup-icon.svg"
            fallbackSrcs={['/genfuture-icon.svg']}
            alt="GenFuture signup icon circular"
            className="w-full h-full object-cover"
            lazy
          />
        </div>
        <span className="text-slate-600 text-sm">Circular variant</span>
      </div>

      {/* Usage example in a compact card */}
      <div className="w-full max-w-md">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md flex-shrink-0">
              <ImageWithFallback
                src="/signup-icon.svg"
                fallbackSrcs={['/genfuture-icon.svg']}
                alt="GenFuture signup icon in card"
                className="w-full h-full object-cover"
                lazy
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-slate-900 text-base font-semibold truncate">Career Search</h3>
              <p className="text-slate-600 text-sm">
                Discover opportunities and grow your professional journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large hero version */}
      <div className="w-full px-2">
        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="/signup-icon.svg"
            fallbackSrcs={['/genfuture-icon.svg']}
            alt="GenFuture signup icon hero"
            className="w-full h-auto"
            lazy
          />
        </div>
      </div>
    </div>
  );
}