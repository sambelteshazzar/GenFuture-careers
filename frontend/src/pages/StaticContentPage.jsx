import React from 'react';
import { motion } from 'framer-motion';

/**
 * Simple static content renderer for hash-routed informational pages.
 * Supported slugs map to sections in the footer/header like #privacy, #terms, #cookies, #blog, etc.
 */
function StaticContentPage({ slug, onBack }) {
  const normalized = String(slug || '').toLowerCase();

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

  const contentMap = {
    // Footer: Legal
    privacy: {
      title: 'Privacy Policy',
      description:
        'Your privacy matters. We collect minimal data necessary to provide a personalized and secure experience. This document outlines what data we collect, how we use it, and your rights.',
      sections: [
        { h: 'Data Collection', p: 'We store session tokens locally and only fetch data required to power your exploration. We do not sell your personal information.' },
        { h: 'Usage', p: 'Your usage helps us improve. Aggregated, anonymized metrics may be used to evaluate features and reliability.' },
        { h: 'Control', p: 'You may sign out at any time to clear local session data. Contact us to request data review or deletion.' },
      ],
    },
    terms: {
      title: 'Terms of Service',
      description:
        'These terms govern your use of the GenFuture Career application. Please review them to understand permissible use, limitations, and responsibilities.',
      sections: [
        { h: 'Acceptable Use', p: 'Use the app to explore careers and universities. Do not attempt to disrupt services or misuse data.' },
        { h: 'Availability', p: 'We strive for high availability but provide the service “as is” without guarantees. External APIs may be limited.' },
        { h: 'Liability', p: 'Decisions based on the app are your responsibility. We provide guidance, not guarantees.' },
      ],
    },
    cookies: {
      title: 'Cookies',
      description:
        'We use local storage/session storage rather than traditional cookies where possible. This page explains how session information is handled.',
      sections: [
        { h: 'Session Storage', p: 'Your login token is stored in localStorage under a project-specific key. Remove it by signing out.' },
        { h: 'Preferences', p: 'Basic UI preferences may be stored locally to personalize your experience.' },
      ],
    },

    // Footer: Company
    about: {
      title: 'About GenFuture',
      description:
        'GenFuture connects students and lifelong learners with universities, courses, and career paths. We prefer transparent defaults, performance, and privacy.',
      sections: [
        { h: 'Mission', p: 'Make career planning clear, data-driven, and personal.' },
        { h: 'Approach', p: 'Blend external data sources with heuristic fallbacks to keep exploration resilient.' },
      ],
    },
    blog: {
      title: 'Blog',
      description:
        'Read updates on product improvements, career planning guides, and behind-the-scenes engineering notes.',
      sections: [
        { h: 'Roadmap Notes', p: 'We periodically publish progress on features and long-term plans.' },
        { h: 'Guides', p: 'Actionable articles to help choose programs and careers.' },
      ],
    },
    press: {
      title: 'Press',
      description:
        'Press inquiries and resources. Reach out for interviews, product overviews, and data sources.',
      sections: [
        { h: 'Contact', p: 'press@genfuture.example' },
        { h: 'Resources', p: 'Logos, product screenshots, and description are available upon request.' },
      ],
    },
    jobs: {
      title: 'Careers at GenFuture',
      description:
        'We value clarity, trust, and performance. Join a small team focused on student-first outcomes.',
      sections: [
        { h: 'Open Roles', p: 'Engineering, Data, and Partnerships. Send your profile to jobs@genfuture.example.' },
      ],
    },

    // Footer: Resources
    help: {
      title: 'Help Center',
      description:
        'Find answers to common questions and troubleshooting steps for account access and exploration.',
      sections: [
        { h: 'Account', p: 'If you cannot sign in, try clearing localStorage or resetting your token.' },
        { h: 'Location', p: 'Allow location access to discover nearby universities or search by country.' },
      ],
    },
    guides: {
      title: 'Guides',
      description:
        'Deep dives on choosing programs, comparing universities, and understanding career paths.',
      sections: [
        { h: 'Program Fit', p: 'Align interests with course outcomes and skill development.' },
        { h: 'Comparisons', p: 'Balance ranking, location, cost, and outcomes.' },
      ],
    },
    status: {
      title: 'Status',
      description:
        'Service health and uptime notes. External data providers may have rate limits or temporary outages.',
      sections: [
        { h: 'APIs', p: 'Third-party endpoints can be intermittent. We provide local fallbacks when possible.' },
      ],
    },
    contact: {
      title: 'Contact',
      description:
        'Questions, partnerships, or feedback? We would love to hear from you.',
      sections: [
        { h: 'Email', p: 'contact@genfuture.example' },
        { h: 'Support', p: 'Use the Help Center for immediate assistance.' },
      ],
    },

    // Footer: Product (fallback static)
    features: {
      title: 'Features',
      description:
        'Discover universities, explore courses, and see career paths. Smooth search and resilient fallbacks included.',
      sections: [
        { h: 'Discovery', p: 'Find universities near you or across the world.' },
        { h: 'Insights', p: 'Understand course content and related careers.' },
      ],
    },
    pricing: {
      title: 'Pricing',
      description:
        'Currently free for exploration. Future premium features may be announced on the blog.',
      sections: [
        { h: 'Free', p: 'Core exploration and search are free.' },
        { h: 'Premium', p: 'Advanced analytics may become optional add-ons.' },
      ],
    },
  };

  const fallback = {
    title: 'Page',
    description:
      'This page is not yet fully configured. Use the Back button to return or choose another link from the footer.',
    sections: [
      { h: 'Unknown', p: 'The requested section is not recognized.' },
    ],
  };

  const entry = contentMap[normalized] || fallback;

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
        aria-label="Static page header"
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
            <span style={{ opacity: 0.7, fontSize: '0.95rem', textTransform: 'capitalize' }}>
              {normalized || 'page'}
            </span>
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
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1rem 2.2rem' }}>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                letterSpacing: '-0.02em',
                textShadow: '0 10px 30px rgba(0,0,0,0.45)',
              }}
            >
              {entry.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              style={{
                marginTop: '0.9rem',
                maxWidth: 760,
                color: 'rgba(230,236,255,0.85)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              {entry.description}
            </motion.p>
          </div>
        </section>

        {/* Sections */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 3rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {entry.sections.map((card) => (
              <motion.div
                key={card.h}
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
                <h3 style={{ margin: '0 0 0.4rem', fontWeight: 800, fontSize: '1.05rem' }}>
                  {card.h}
                </h3>
                <p style={{ margin: 0, color: 'rgba(230,236,255,0.85)' }}>{card.p}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Prompt */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 4rem' }}>
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '1rem',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <h3 style={{ marginTop: 0, fontWeight: 900 }}>Need more details?</h3>
            <p style={{ color: 'rgba(230,236,255,0.85)' }}>
              If this page lacks specifics, reach out and we will improve the documentation.
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>Email: contact@genfuture.example</li>
              <li>Support: help@genfuture.example</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StaticContentPage;