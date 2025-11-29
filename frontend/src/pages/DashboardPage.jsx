import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import BookmarksPanel from '../components/BookmarksPanel';
import ApplicationTracker from '../components/ApplicationTracker';

const DashboardPage = ({ user, onLogout, onGoToExplorer }) => {
  const [activeTab, setActiveTab] = useState('overview');
  // Scoped CSS injection (keeps changes minimal and aligned to existing tokens)
  useEffect(() => {
    const styleId = 'dashboard-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .dashboard-page {
          min-height: 100vh;
          background: var(--color-bg);
        }
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 1.25rem;
        }
        .grid-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 1.25rem;
        }
        .card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-16);
          box-shadow: var(--shadow-sm);
          padding: 1.25rem;
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .card-title {
          font-weight: 700;
          color: var(--color-text);
          font-size: 1.05rem;
        }
        .muted {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .kpi {
          background: linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(124,58,237,0.06) 100%);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-12);
          padding: 0.9rem;
        }
        .kpi .label {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }
        .kpi .value {
          margin-top: 0.25rem;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--color-text);
        }
        .primary-cta {
          background: var(--gradient-brand-45);
          color: #fff;
          border: none;
          padding: 0.75rem 1.1rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: var(--shadow-sm);
        }
        .primary-cta:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .pill {
          display: inline-block;
          border: 1px solid var(--color-border);
          background: #f9fafb;
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.8rem;
          border-radius: 999px;
          padding: 0.35rem 0.65rem;
        }
        .big-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .progress-bars {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.65rem;
          margin-top: 0.75rem;
        }
        .progress-item {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 0.5rem;
        }
        .progress-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .progress-track {
          width: 100%;
          height: 8px;
          background: #eef2f7;
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: var(--gradient-brand-45);
        }
        .mini-chart {
          height: 120px;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          align-items: end;
          gap: 6px;
        }
        .bar {
          height: 40px;
          border-radius: 6px;
          background: linear-gradient(180deg, rgba(124,58,237,0.15), rgba(124,58,237,0.35));
        }
        .bar.accent {
          background: linear-gradient(180deg, rgba(20,184,166,0.25), rgba(20,184,166,0.65));
        }
        .list {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.5rem 0.75rem;
          margin-top: 0.75rem;
        }
        .list .item {
          color: var(--color-text);
          font-weight: 600;
        }
        .list .score {
          color: var(--color-text-muted);
          font-weight: 700;
        }
        /* Link styles */
        .tile-link {
          text-decoration: none;
          color: inherit;
          display: block;
          border-radius: var(--radius-12);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .tile-link:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
          border-color: #cbd5e1;
        }
        .link-inline {
          text-decoration: none;
          color: var(--color-accent);
          font-weight: 700;
        }
        .link-inline:hover {
          color: var(--color-primary);
          text-decoration: underline;
        }
        @media (max-width: 1024px) {
          .grid { grid-template-columns: 1fr; }
          .grid-row { grid-template-columns: 1fr; }
          .kpi-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .kpi-row { grid-template-columns: 1fr; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
 
  // Link helpers for dashboard -> explorer sections
  const linkForSnapshot = (label) => {
    if (label === 'Nearby Universities') return '#universities';
    if (label === 'Saved Courses') return '#courses';
    if (label === 'Planned Skills') return '#careers';
    if (label === 'Opportunities') return '#careers';
    return '#explore';
  };
 
  const handleTileLink = (e) => {
    const href = e.currentTarget.getAttribute('href');
    e.preventDefault();
    try {
      window.location.hash = href;
    } catch {
      // no-op
    }
    // Ensure Explorer view loads if needed
    if (typeof onGoToExplorer === 'function') {
      onGoToExplorer();
    }
  };
 
   return (
    <div className="dashboard-page">
      <Header user={user} onLogout={onLogout} onProfileClick={() => {}} />

      <main className="dashboard-container">
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'overview' ? '#3b82f6' : '#6b7280',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'bookmarks' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'bookmarks' ? '#3b82f6' : '#6b7280',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'applications' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'applications' ? '#3b82f6' : '#6b7280',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Applications
          </button>
        </div>

        {activeTab === 'bookmarks' && (
          <BookmarksPanel userId={user?.id} onItemClick={(bookmark) => console.log('Bookmark clicked:', bookmark)} />
        )}

        {activeTab === 'applications' && (
          <ApplicationTracker userId={user?.id} />
        )}

        {activeTab === 'overview' && (
          <>
        {/* Top overview row */}
        <div className="grid">
          {/* Welcome / achievement card */}
          <motion.section
            className="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Welcome overview"
          >
            <div className="card-header">
              <div className="card-title">Welcome, {user?.first_name}!</div>
              <span className="pill">This month</span>
            </div>
            <p className="muted">Your personalized dashboard gives a quick snapshot of your exploration progress.</p>

            <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div>
                <div className="big-number">$42.8k</div>
                <div className="muted">Scholarship potential snapshot (demo)</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href="#careers" className="link-inline" onClick={handleTileLink}>View Opportunities</a>
                  <a href="#universities" className="link-inline" onClick={handleTileLink}>Browse Universities</a>
                </div>
              </div>
              <button className="primary-cta" onClick={onGoToExplorer}>Explore Now</button>
            </div>

            <div className="progress-bars">
              {[
                { label: 'Profile completeness', value: 78 },
                { label: 'Exploration progress', value: 45 },
                { label: 'Applications prepared', value: 22 },
              ].map(({ label, value }) => (
                <div className="progress-item" key={label}>
                  <span className="progress-label">{label}</span>
                  <div className="progress-track" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
                    <div className="progress-fill" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Transactions / KPIs */}
          <motion.section
            className="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            aria-label="Key metrics"
          >
            <div className="card-title">Snapshot</div>
            <p className="muted">High-level metrics based on recent activity.</p>
            <div className="kpi-row" role="list">
              {[
                { label: 'Nearby Universities', value: '245' },
                { label: 'Saved Courses', value: '12' },
                { label: 'Planned Skills', value: '18' },
                { label: 'Opportunities', value: '88' },
              ].map((k) => (
                <a
                  className="kpi tile-link"
                  role="listitem"
                  key={k.label}
                  href={linkForSnapshot(k.label)}
                  onClick={handleTileLink}
                  title={`Go to ${k.label}`}
                >
                  <div className="label">{k.label}</div>
                  <div className="value">{k.value}</div>
                </a>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Lower analytics row */}
        <div className="grid-row">
          {/* Weekly overview (bars) */}
          <motion.section
            className="card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            aria-label="Weekly overview"
          >
            <div className="card-header">
              <a className="card-title link-inline" href="#explore" onClick={handleTileLink}>Weekly Overview</a>
              <span className="pill">+10% vs last week</span>
            </div>
            <div className="mini-chart" aria-hidden="true">
              {[24, 36, 18, 78, 26, 32, 48, 40].map((h, i) => (
                <div
                  key={i}
                  className={`bar ${i === 3 ? 'accent' : ''}`}
                  style={{ height: `${Math.max(24, h)}px` }}
                />
              ))}
            </div>
            <p className="muted" style={{ marginTop: '0.5rem' }}>
              Your exploration momentum is trending upward. Keep comparing universities and courses.
            </p>
          </motion.section>

          {/* Total Earning (repurposed to "Readiness index") */}
          <motion.section
            className="card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.05 }}
            aria-label="Readiness index"
          >
            <div className="card-header">
              <a className="card-title link-inline" href="#explore" onClick={handleTileLink}>Readiness Index</a>
              <span className="pill">Demo metrics</span>
            </div>
            <div className="big-number">86.4%</div>
            <p className="muted">Based on saved courses, planned skills, and profile completeness.</p>
            <div className="list">
              <span className="item">Course alignment</span>
              <span className="score">82%</span>
              <span className="item">Skills coverage</span>
              <span className="score">74%</span>
              <span className="item">Documentation</span>
              <span className="score">91%</span>
            </div>
          </motion.section>

          {/* Sessions (CTA to Explorer) */}
          <motion.section
            className="card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            aria-label="Next step"
          >
            <div className="card-header">
              <div className="card-title">Next Step</div>
              <span className="pill">Action</span>
            </div>
            <p className="muted">Jump into the Explorer to compare universities and pick courses.</p>
            <button className="primary-cta" onClick={onGoToExplorer}>Go to Explorer</button>
          </motion.section>
        </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;