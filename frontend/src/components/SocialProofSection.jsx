import React from 'react';

const BrandLogo = ({ label, children }) => {
  return (
    <div
      className="brand-logo"
      aria-label={label}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '48px',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        filter: 'grayscale(100%) opacity(0.8)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'grayscale(0%) opacity(1)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'grayscale(100%) opacity(0.8)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {children}
    </div>
  );
};

function SocialProofSection() {
  const logos = [
    {
      label: 'EduHub',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="EduHub logo">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <rect x="2" y="4" width="40" height="20" rx="6" fill="url(#grad1)" />
          <circle cx="70" cy="14" r="10" fill="url(#grad1)" />
          <rect x="92" y="6" width="24" height="16" rx="4" fill="url(#grad1)" />
        </svg>
      ),
    },
    {
      label: 'SkillFlow',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="SkillFlow logo">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path d="M10 22 C 20 6, 40 6, 50 22 S 80 6, 100 22" stroke="url(#grad2)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'CampusPro',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="CampusPro logo">
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="108" height="16" rx="8" fill="none" stroke="url(#grad3)" strokeWidth="4" />
        </svg>
      ),
    },
    {
      label: 'BrightPath',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="BrightPath logo">
          <defs>
            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <g fill="url(#grad4)">
            <circle cx="16" cy="14" r="6" />
            <circle cx="60" cy="14" r="6" />
            <circle cx="104" cy="14" r="6" />
          </g>
        </svg>
      ),
    },
    {
      label: 'LearnX',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="LearnX logo">
          <defs>
            <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path d="M12 6 L24 22 L36 6 L48 22 L60 6 L72 22 L84 6 L96 22" stroke="url(#grad5)" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'FutureWorks',
      svg: (
        <svg width="120" height="28" viewBox="0 0 120 28" role="img" aria-label="FutureWorks logo">
          <defs>
            <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="104" height="12" rx="6" fill="url(#grad6)" />
        </svg>
      ),
    },
  ];

  return (
    <section className="social-proof-section" style={{ background: 'var(--color-bg)', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>Trusted by learners worldwide</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Programs and platforms partnering to empower student success</p>
        </div>

        <div
          className="logos-row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {logos.map((l) => (
            <BrandLogo key={l.label} label={l.label}>{l.svg}</BrandLogo>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialProofSection;