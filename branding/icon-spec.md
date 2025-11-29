# GenFuture Icon Geometry Spec — Bold Youthful

Version 1.0

Purpose
Provide precise geometry for SVG assets used across favicon and PWA icons.

Canvas and ViewBox
- Canvas: 1024 x 1024
- viewBox: 0 0 1024 1024
- Safe-area: keep critical glyphs within 80% of canvas (inner circle r=409.6); leave 10% padding for maskable icons
- Rounded-square container for tiles: rx=160 at 1024 canvas

Coordinate System
- Origin at top-left (0,0); center at (512,512)
- Units: pixels; integer coordinates preferred for snapping

Layer Order
1. Background rounded rect (tile context only)
2. Inner circle field with brand gradient
3. Guiding star
4. Compass upward path
5. Progress markers
6. Defs: linearGradient brandGradient

Master Colorful Icon: [frontend/public/favicon.svg](frontend/public/favicon.svg)
- Fill: brandGradient
- Foreground: white star and paths
- No stroke on star; strokes only on compass path

Guiding Star Geometry
- Path data:
  M512 300 L540 420 L660 420 L568 488 L596 608 L512 536 L428 608 L456 488 L364 420 L484 420 Z
- Fill: #ffffff; Stroke: none
- Visual: high-contrast white on gradient; crisp corners retained at small sizes

Compass Path Geometry
- Path data:
  M320 672 Q512 420 704 672
- stroke: #ffffff
- stroke-width: 28
- stroke-linecap: round
- fill: none; opacity: 0.95

Progress Markers
- Dot 1: circle cx=432 cy=592 r=14 fill #ffffff opacity 0.9
- Dot 2: circle cx=512 cy=512 r=14 fill #ffffff opacity 0.95
- Dot 3: circle cx=592 cy=592 r=14 fill #ffffff opacity 0.9

Inner Field
- circle: cx=512 cy=512 r=448 fill url(#brandGradient)

Gradient Definition
- id: brandGradient
- linearGradient x1=0 y1=0 x2=1 y2=1 (normalized)
- stops: 0% #7c3aed, 100% #db2777

Tile Container (for maskable preview)
- rect x=64 y=64 width=896 height=896 rx=160 ry=160 fill none
- Not included in exported favicon.svg; used in previews and template

Monochrome Variant: [frontend/public/icon-mono.svg](frontend/public/icon-mono.svg)
- Replace gradient with currentColor or solid #334155
- Use stroke-only compass path (stroke-width=28); star fill currentColor or #ffffff for dark backgrounds
- Ensure silhouette clarity at 16–24 px

SVG Blueprint
Embed structure:
```svg
<svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>GenFuture Icon</title>
  <desc>Compass and guiding star symbolizing navigation and achievement</desc>

  <defs>
    <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
  </defs>

  <g>
    <circle cx="512" cy="512" r="448" fill="url(#brandGradient)"/>
    <path d="M512 300 L540 420 L660 420 L568 488 L596 608 L512 536 L428 608 L456 488 L364 420 L484 420 Z" fill="#ffffff"/>
    <path d="M320 672 Q512 420 704 672" stroke="#ffffff" stroke-width="28" stroke-linecap="round" fill="none" opacity="0.95"/>
    <circle cx="432" cy="592" r="14" fill="#ffffff" opacity="0.9"/>
    <circle cx="512" cy="512" r="14" fill="#ffffff" opacity="0.95"/>
    <circle cx="592" cy="592" r="14" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>
```

Raster Export Specs
- Targets:
  - apple-touch-icon-180.png
  - icon-192-maskable.png
  - icon-512-maskable.png
- Padding: 10% of canvas per side; center icon within maskable safe-area
- Minimum stroke width at target size: >= 1px
- Background:
  - apple-touch: gradient background, no transparency
  - maskable: full-bleed gradient; ensure star remains centered

Export Pipeline
- Script: [frontend/scripts/export-icons.js](frontend/scripts/export-icons.js:1) uses sharp to rasterize [frontend/public/favicon.svg](frontend/public/favicon.svg)
- Output paths:
  - [frontend/public/apple-touch-icon-180.png](frontend/public/apple-touch-icon-180.png)
  - [frontend/public/icon-192-maskable.png](frontend/public/icon-192-maskable.png)
  - [frontend/public/icon-512-maskable.png](frontend/public/icon-512-maskable.png)
- Enforce alpha channel for maskable PNGs

PWA Manifest Mapping
- Path: [frontend/public/site.webmanifest](frontend/public/site.webmanifest:1)
- icons array:
  - src: /icon-192-maskable.png, sizes: 192x192, type: image/png, purpose: maskable any
  - src: /icon-512-maskable.png, sizes: 512x512, type: image/png, purpose: maskable any
- theme_color: #7c3aed; background_color: #0b1220; display: standalone

Integration Alignment
- Replace head link in [frontend/index.html](frontend/index.html:5) to /favicon.svg
- Add apple-touch link and manifest link in [frontend/index.html](frontend/index.html:68)
- Update in-app logo mark in [const Logo = ({ size = 'medium' }) =>](frontend/src/components/Logo.jsx:3) using the same path geometry and gradient defs

QA Checklist
- Favicon visible in browser tabs (light/dark OS)
- Maskable icons frame correctly in Chrome Application tab
- Icon remains recognizable at 16px–24px
- Contrast of white foreground over gradient acceptable

Notes
- Maintain radius 16 language for app tiles and major surfaces
- Avoid overly thin internal details
- Keep gradient subtle; do not add harsh banding

References
- Brand tokens are defined in [branding/brand-guidelines.md](branding/brand-guidelines.md:1)
- Master assets will live under branding/master before being copied to public

Change Log
- v1.0 Initial spec