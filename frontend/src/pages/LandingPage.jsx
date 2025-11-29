import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

/**
 * Advior-style hero replication:
 * - Elegant full-bleed hero image with dark overlay
 * - Top navigation with segmented links and rounded CTA
 * - Left copy: feature tag, statement, download CTA
 * - Right: oversized serif display headline
 * - Non-destructive: styles injected at runtime and scoped to .advior-* classes
 */
const NAV_LINKS = ['About'];

const LandingPage = ({ onGetStarted }) => {
  const safeNavigate = typeof onGetStarted === 'function' ? onGetStarted : () => {};

  // Inject Google font and scoped CSS once to avoid touching global files
  useEffect(() => {
    const fontId = 'advior-font-playfair';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap';
      document.head.appendChild(link);
    }

    const styleId = 'advior-landing-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .advior-page {
          background: #0a0a0a;
          color: #eaeaea;
          min-height: 100vh;
        }
        /* Top navigation */
        .advior-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(0,0,0,0.55);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .advior-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          gap: 1rem;
        }
        .advior-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.2px;
          font-size: 1.05rem;
        }
        .advior-links {
          display: flex;
          align-items: center;
          gap: 1rem;
          list-style: none;
          color: rgba(255,255,255,0.85);
        }
        .advior-links li + li::before {
          content: '•';
          color: rgba(255,255,255,0.35);
          margin: 0 0.5rem 0 0.25rem;
        }
        .advior-link {
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-weight: 500;
        }
        .advior-link:hover { color: #fff; }
        .advior-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .advior-signin {
          color: rgba(255,255,255,0.85);
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .advior-get-started {
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .advior-get-started:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35);
        }

        /* Hero */
        .advior-hero {
          position: relative;
          min-height: calc(100vh - 68px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            center / cover no-repeat
            var(--advior-hero-image, url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80'));
        }
        .advior-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(1200px 600px at 18% 30%, rgba(38,255,186,0.35) 0%, rgba(38,255,186,0.10) 30%, rgba(38,255,186,0.0) 55%),
            radial-gradient(800px 400px at 24% 45%, rgba(76,132,255,0.28) 0%, rgba(76,132,255,0.10) 28%, rgba(76,132,255,0.0) 60%),
            linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.7) 100%);
          pointer-events: none;
        }
        .advior-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(1000px 500px at 6% 12%, rgba(255,255,255,0.06), transparent 45%);
          opacity: 0.7;
          pointer-events: none;
        }
        .advior-hero-content {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3rem;
          padding: 2rem 1rem;
          align-items: end;
        }

        /* Left copy */
        .advior-tag {
          display: inline-block;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          letter-spacing: 0.2px;
        }
        .advior-title {
          margin: 0.8rem 0 0.6rem;
          font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #ffffff;
          text-shadow: 0 0 20px rgba(20, 80, 255, 0.25);
          line-height: 1.15;
        }
        .advior-sub {
          color: rgba(255,255,255,0.82);
          max-width: 640px;
          font-size: 1.05rem;
        }
        .advior-btns {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .advior-btn {
          border: none;
          cursor: pointer;
          border-radius: 999px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .advior-btn.primary {
          background: #ffffff;
          color: #0a0a0a;
          padding: 0.7rem 1.1rem;
          box-shadow: 0 12px 40px rgba(66,110,255,0.35);
        }
        .advior-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(66,110,255,0.45);
        }
        .advior-btn.outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.35);
          padding: 0.65rem 1.1rem;
        }
        .advior-btn.outline:hover {
          background: rgba(255,255,255,0.08);
        }
        .advior-btn .icon {
          width: 18px;
          height: 18px;
        }

        /* Right oversized serif display */
        .advior-display {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(2.8rem, 8vw, 6.2rem);
          line-height: 1.0;
          color: #ffffff;
          text-shadow: 0 10px 30px rgba(0,0,0,0.45);
          letter-spacing: -0.02em;
        }

        /* Trusted chips (optional below hero) */
        .advior-trusted {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-top: 2.5rem;
          color: rgba(255,255,255,0.8);
        }
        .advior-logos {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .advior-logo {
          color: #ffffff;
          opacity: 0.8;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.15px;
          transition: opacity 0.2s ease, border-color 0.2s ease;
        }
        .advior-logo:hover { opacity: 1; border-color: rgba(255,255,255,0.22); }

        /* Responsive */
        @media (max-width: 1024px) {
          .advior-hero-content { grid-template-columns: 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .advior-links { display: none; }
          .advior-display { font-size: clamp(2.2rem, 9vw, 3.2rem); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="advior-page" style={{ '--advior-hero-image': 'url(https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=1800&q=80)' }}>
      {/* Top Navigation */}
      <header className="advior-nav">
        <div className="advior-nav-inner">
          <div className="advior-brand">GenFuture Career</div>

          <nav aria-label="Primary">
            <ul className="advior-links">
              {NAV_LINKS.map((label) => (
                <li key={label}><a className="advior-link" href={`#${label.toLowerCase()}`}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="advior-actions">
            <button
              className="advior-signin"
              onClick={() => {
                try {
                  window.location.hash = '#auth';
                } catch {
                  // fallback to callback
                  safeNavigate();
                }
              }}
            >
              Sign In
            </button>
            <button className="advior-get-started" onClick={safeNavigate}>Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="advior-hero" role="banner">
        <div className="advior-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="advior-tag">Top Feature</span>
            <h2 className="advior-title">We Provide Intelligent Career Planning.</h2>
            <p className="advior-sub">
              Explore career paths, compare universities and programs, and plan the skills to reach your goals with clarity and confidence.
            </p>

            <div className="advior-btns">
              <button
                className="advior-btn primary"
                onClick={safeNavigate}
                aria-label="Start Career Assessment"
              >
                Start Career Assessment
                <ArrowUpRightIcon className="icon" aria-hidden="true" />
              </button>
              <button
                className="advior-btn outline"
                onClick={() => {
                  try {
                    document
                      .getElementById('universities')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } catch {
                    window.location.hash = '#universities';
                  }
                }}
                aria-label="Explore Universities"
              >
                Explore Universities
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <h1 className="advior-display">
              The Future<br />Of Career Planning
            </h1>
          </motion.div>
        </div>

        {/* Optional trusted chips below hero */}
        <div className="advior-trusted">
          <p>Trusted by learners across these fields</p>
          <div className="advior-logos" role="list">
            {['Technology', 'Business', 'Healthcare', 'Arts & Design', 'Engineering', 'Education', 'Entrepreneurship'].map((name) => (
              <div className="advior-logo" role="listitem" key={name}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;