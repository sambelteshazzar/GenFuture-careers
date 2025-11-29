import React, { useEffect } from 'react';

const CareerPathsList = ({ careerPaths, onLearnMore }) => {
  // Scoped styles for meta sections
  useEffect(() => {
    const styleId = 'career-meta-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .career-meta {
          margin-top: 0.75rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        .meta-section {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.75rem;
          box-shadow: var(--shadow-sm);
        }
        .meta-section h4 {
          margin: 0 0 0.5rem;
          font-weight: 700;
          color: var(--color-text);
          font-size: 0.95rem;
        }
        .meta-section ul {
          margin: 0;
          padding-left: 1.2rem;
          color: var(--color-text-muted);
        }
        .earnings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .earn {
          background: linear-gradient(135deg, rgba(20,184,166,0.06), rgba(124,58,237,0.06));
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0.6rem;
        }
        .earn .tier {
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.85rem;
        }
        .earn .amount {
          display: block;
          margin-top: 0.2rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .earn .est {
          color: var(--color-text-muted);
          font-weight: 600;
          margin-left: 0.25rem;
          font-size: 0.85rem;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!careerPaths || careerPaths.length === 0) {
    return (
      <div className="no-results">
        <p>🔍 No career paths found for this course.</p>
        <p>This might be a new course or we're still building our career database.</p>
      </div>
    );
  }

  // Heuristic enrichment when backend doesn't provide details
  const enrichDetails = (careerName) => {
    const name = String(careerName || '').toLowerCase();

    const base = {
      requirements: [
        'Bachelor’s degree in related field or equivalent experience',
        'Portfolio or internship experience demonstrating skills',
        'Foundational skills and tooling relevant to the role'
      ],
      benefits: [
        'Growing market demand',
        'Clear growth pathways',
        'Remote-friendly opportunities in many regions'
      ],
      earnings: { junior: '$25k–$40k', mid: '$40k–$70k', senior: '$70k–$120k' }
    };

    const set = (req, ben, earn) => ({
      requirements: req || base.requirements,
      benefits: ben || base.benefits,
      earnings: earn || base.earnings
    });

    // Tech / Software
    if (/software|developer|engineer|frontend|backend|devops|data|ml|ai|cyber|qa/.test(name)) {
      return set(
        [
          'Proficiency in one or more languages (e.g., Python, JavaScript, Java)',
          'Version control, tooling, and testing fundamentals',
          'Understanding of algorithms, systems, and architecture basics'
        ],
        [
          'High demand across industries',
          'Competitive compensation with strong senior upside',
          'Remote and hybrid roles commonly available'
        ],
        { junior: '$35k–$55k', mid: '$60k–$95k', senior: '$100k–$160k' }
      );
    }

    // Business / Product / Marketing / Project
    if (/business|management|marketing|product|project|operations|hr|analyst/.test(name)) {
      return set(
        [
          'Bachelor’s in Business, Marketing, or related field',
          'Analytical skills with spreadsheets and BI tools',
          'Strong communication and stakeholder management'
        ],
        [
          'Role mobility across departments',
          'Clear leadership tracks',
          'Broad industry applicability'
        ],
        { junior: '$28k–$45k', mid: '$45k–$75k', senior: '$80k–$130k' }
      );
    }

    // Healthcare / Public Health
    if (/nurs|pharmac|public\s*health|clinical|biomed|medical|health/.test(name)) {
      return set(
        [
          'Accredited program and relevant licensure',
          'Clinical rotations or supervised practice',
          'Strong attention to detail and patient care'
        ],
        [
          'Mission-driven work with societal impact',
          'Stable demand across regions',
          'Clear certification-based growth'
        ],
        { junior: '$30k–$45k', mid: '$45k–$70k', senior: '$75k–$110k' }
      );
    }

    // Engineering
    if (/mechanical|civil|electrical|chemical|industrial|mechatronics|materials|petroleum|engineer/.test(name)) {
      return set(
        [
          'Bachelor’s in relevant engineering discipline',
          'CAD/CAE tools and safety/compliance awareness',
          'Internship or project portfolio'
        ],
        [
          'Strong domain specialization',
          'Project-based growth and leadership pathways',
          'Cross-industry mobility (manufacturing, energy, infrastructure)'
        ],
        { junior: '$32k–$50k', mid: '$55k–$85k', senior: '$90k–$140k' }
      );
    }

    // Design / Architecture
    if (/design|ux|ui|architect|architecture|urban|interior/.test(name)) {
      return set(
        [
          'Portfolio showcasing projects and case studies',
          'Proficiency with design tools (Figma, CAD)',
          'Understanding of accessibility and human-centered design'
        ],
        [
          'Creative problem solving',
          'Freelance and agency flexibility',
          'Impact on user experience and environment'
        ],
        { junior: '$25k–$40k', mid: '$40k–$70k', senior: '$75k–$120k' }
      );
    }

    // Finance / Accounting
    if (/finance|account|econom|bank|audit|risk|actuary/.test(name)) {
      return set(
        [
          'Degree in Finance/Accounting/Economics',
          'Knowledge of financial reporting and analysis',
          'Certifications (e.g., ACCA, CFA) preferred'
        ],
        [
          'Stable industry demand',
          'Clear certification-based progression',
          'Exposure to strategic decision making'
        ],
        { junior: '$30k–$45k', mid: '$45k–$75k', senior: '$80k–$130k' }
      );
    }

    return base;
  };

  const openExternalInfo = (careerName) => {
    const q = encodeURIComponent(`${careerName} career path`);
    const url = `https://www.google.com/search?q=${q}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }
  };

  return (
    <div className="career-paths-container">
      <div className="career-paths-grid" role="list">
        {careerPaths.map((career) => {
          const details = enrichDetails(career?.name);
          const description = String(career?.description || `A rewarding career path in ${String(career?.name || '').toLowerCase()}`);
          return (
            <div key={career.id} className="career-card" role="listitem">
              <div className="career-icon" aria-hidden="true">🚀</div>
              <h3 className="career-title">{career.name}</h3>
              <div className="career-description">
                <p>{description}</p>
              </div>

              <div className="career-meta">
                <div className="meta-section" aria-labelledby={`req-${career.id}`}>
                  <h4 id={`req-${career.id}`}>Requirements</h4>
                  <ul>
                    {details.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="meta-section" aria-labelledby={`ben-${career.id}`}>
                  <h4 id={`ben-${career.id}`}>Benefits</h4>
                  <ul>
                    {details.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="meta-section" aria-labelledby={`earn-${career.id}`}>
                  <h4 id={`earn-${career.id}`}>Earnings (est.)</h4>
                  <div className="earnings-grid">
                    <div className="earn">
                      <span className="tier">Junior</span>
                      <span className="amount">{details.earnings.junior} <span className="est">est.</span></span>
                    </div>
                    <div className="earn">
                      <span className="tier">Mid</span>
                      <span className="amount">{details.earnings.mid} <span className="est">est.</span></span>
                    </div>
                    <div className="earn">
                      <span className="tier">Senior</span>
                      <span className="amount">{details.earnings.senior} <span className="est">est.</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="career-actions" style={{ marginTop: '0.75rem' }}>
                <button
                  className="learn-more-btn"
                  aria-label={`Learn more about ${career.name}`}
                  onClick={() => {
                    if (typeof onLearnMore === 'function') {
                      onLearnMore(career);
                    } else {
                      openExternalInfo(career.name);
                    }
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="career-tips">
        <h3>💡 Next Steps</h3>
        <ul>
          <li>Research job market demand for these careers</li>
          <li>Connect with professionals in these fields</li>
          <li>Look for internship opportunities</li>
          <li>Consider additional skills or certifications needed</li>
        </ul>
      </div>
    </div>
  );
};

export default CareerPathsList;