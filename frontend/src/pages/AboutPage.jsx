import React from 'react';
import { motion } from 'framer-motion';

function AboutPage({ onBack }) {
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }
    try {
      window.history.back();
    } catch {
      window.location.hash = '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1020', color: '#e6ecff' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(7, 10, 25, 0.65)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="About page header"
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: 0.2 }}>GenFuture Career</span>
            <span style={{ opacity: 0.7, fontSize: '0.95rem' }}>About</span>
          </div>

          <button
            onClick={handleBack}
            aria-label="Go back"
            style={{
              background: 'transparent',
              color: '#e6ecff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 999,
              padding: '0.45rem 0.9rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background:
              'radial-gradient(1000px 600px at 15% 20%, rgba(66,110,255,0.18), transparent 45%), ' +
              'radial-gradient(900px 500px at 85% 10%, rgba(16,185,129,0.14), transparent 50%), ' +
              'linear-gradient(180deg, #0b1020 0%, #0a0f1b 100%)',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1rem 3rem' }}>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                letterSpacing: '-0.02em',
                textShadow: '0 10px 30px rgba(0,0,0,0.45)',
              }}
            >
              Our mission is to make career planning clear, data‑driven, and personal.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              style={{
                marginTop: '0.9rem',
                maxWidth: 720,
                color: 'rgba(230,236,255,0.85)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              GenFuture connects students with universities, programs, and the career paths they unlock. We blend
              external data sources with smart heuristics to help you explore, compare, and choose with confidence.
            </motion.p>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Transparent', 'Student‑First', 'Privacy‑Aware', 'Accessible'].map((chip) => (
                <span
                  key={chip}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.7rem',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.03)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              {
                title: 'University Discovery',
                desc:
                  'Find universities near you or across the world and compare them by the programs and outcomes that matter.',
              },
              {
                title: 'Course Insights',
                desc:
                  'Browse available courses per university and uncover the skills and knowledge each program builds.',
              },
              {
                title: 'Career Pathways',
                desc:
                  'See how courses translate into career opportunities, including related roles and industries.',
              },
              {
                title: 'Smart Fallbacks',
                desc:
                  'When data is limited, we provide heuristic suggestions so exploration never stops.',
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45 }}
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: 16,
                  padding: '1rem',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                }}
              >
                <h3 style={{ margin: '0 0 0.4rem', fontWeight: 800, fontSize: '1.05rem' }}>{card.title}</h3>
                <p style={{ margin: 0, color: 'rgba(230,236,255,0.85)' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 3rem' }}>
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              background:
                'radial-gradient(800px 400px at 5% 10%, rgba(66,110,255,0.08), transparent 45%), rgba(255,255,255,0.02)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>Product Principles</h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                padding: '1rem',
              }}
            >
              {[
                {
                  k: 'Clarity',
                  v: 'We present information simply, with plain-language explanations and actionable choices.',
                },
                {
                  k: 'Trust',
                  v: 'We cite sources where applicable and prefer transparent defaults over dark patterns.',
                },
                {
                  k: 'Performance',
                  v: 'The app is responsive and resilient, gracefully falling back when APIs are limited.',
                },
                {
                  k: 'Privacy',
                  v: 'Only essential data is stored locally. You control your session and can sign out anytime.',
                },
              ].map((p) => (
                <div key={p.k} style={{ padding: '0.5rem 0.25rem' }}>
                  <div style={{ fontWeight: 800 }}>{p.k}</div>
                  <div style={{ color: 'rgba(230,236,255,0.85)' }}>{p.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 1rem 4rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '1rem',
            }}
          >
            <div
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <h3 style={{ marginTop: 0, fontWeight: 900 }}>Get in touch</h3>
              <p style={{ color: 'rgba(230,236,255,0.85)' }}>
                Questions, partnerships, or press inquiries? Reach out:
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                <li>Email: contact@genfuture.example</li>
                <li>Press: press@genfuture.example</li>
                <li>Careers: jobs@genfuture.example</li>
              </ul>
            </div>

            <div
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '1rem',
                background:
                  'linear-gradient(180deg, rgba(66,110,255,0.12) 0%, rgba(66,110,255,0.06) 100%)',
              }}
            >
              <h3 style={{ marginTop: 0, fontWeight: 900 }}>Ready to explore?</h3>
              <p style={{ marginBottom: '0.9rem', color: 'rgba(230,236,255,0.85)' }}>
                Start your personalized journey through universities, courses, and careers.
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a
                  href="#auth"
                  style={{
                    textDecoration: 'none',
                    fontWeight: 800,
                    background: '#ffffff',
                    color: '#0b1020',
                    padding: '0.55rem 0.9rem',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 12px 40px rgba(66,110,255,0.35)',
                  }}
                >
                  Create account
                </a>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'transparent',
                    color: '#e6ecff',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 999,
                    padding: '0.55rem 0.9rem',
                    cursor: 'pointer',
                    fontWeight: 800,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Return
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;