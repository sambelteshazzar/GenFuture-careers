import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Universities', href: '#universities' },
        { label: 'Careers', href: '#careers' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Press', href: '#press' },
        { label: 'Careers', href: '#jobs' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Guides', href: '#guides' },
        { label: 'Status', href: '#status' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Cookies', href: '#cookies' },
        { label: 'Licenses', href: '#licenses' },
      ],
    },
  ];

  const socials = [
    {
      label: 'Twitter',
      href: 'https://twitter.com/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M20.94 7.59c.01.17.01.34.01.52 0 5.33-4.06 11.47-11.47 11.47-2.28 0-4.4-.67-6.19-1.82.32.04.64.06.98.06 1.89 0 3.63-.64 5.01-1.73a4.05 4.05 0 0 1-3.78-2.81c.24.04.49.06.74.06.36 0 .72-.05 1.05-.14a4.05 4.05 0 0 1-3.25-3.97v-.05c.55.31 1.18.49 1.85.51a4.04 4.04 0 0 1-1.8-3.37c0-.75.2-1.45.56-2.06a11.49 11.49 0 0 0 8.34 4.23c-.06-.3-.09-.62-.09-.94 0-2.23 1.81-4.03 4.03-4.03 1.16 0 2.2.49 2.92 1.27a7.98 7.98 0 0 0 2.56-.98 4.03 4.03 0 0 1-1.77 2.22 8.07 8.07 0 0 0 2.31-.63 8.7 8.7 0 0 1-2.01 2.08z"></path>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.5h4.5V23h-4.5V8.5zM8.69 8.5h4.31v1.98h.06c.6-1.13 2.07-2.33 4.26-2.33 4.56 0 5.4 3 5.4 6.9V23h-4.49v-6.29c0-1.5-.03-3.43-2.09-3.43-2.09 0-2.41 1.63-2.41 3.32V23H8.69V8.5z"></path>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.92-.95-2.38-1C16.47 2.5 12 2.5 12 2.5h-.01s-4.47 0-8.17.34c-.47.05-1.48.06-2.38 1-.71.72-.94 2.36-.94 2.36S0 8.15 0 10.09v1.82c0 1.94.5 3.89.5 3.89s.23 1.64.94 2.36c.9.94 2.08.9 2.61 1 1.89.18 8 .33 8 .33s4.47-.01 8.17-.35c.47-.05 1.48-.06 2.38-1 .71-.72.94-2.36.94-2.36s.5-1.94.5-3.89v-1.82c0-1.94-.5-3.89-.5-3.89zM9.75 13.5V7.88l6.5 2.82-6.5 2.8z"></path>
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 1rem',
        }}
      >
        <div
          className="footer-top"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
          }}
        >
          <div className="brand" style={{ minWidth: 220 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--color-text)',
                marginBottom: '0.5rem',
              }}
            >
              GenFuture Career
            </div>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              Shape your future with data-driven confidence.
            </p>
            <div
              className="socials"
              style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    background:
                      'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(124,58,237,0.06) 100%)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h4
                style={{
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.75rem',
                }}
              >
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l.label} style={{ marginBottom: '0.5rem' }}>
                    <a
                      href={l.href}
                      style={{
                        color: 'var(--color-text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="footer-bottom"
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
          }}
        >
          <span>© {year} GenFuture Career. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#cookies" style={{ color: 'inherit', textDecoration: 'none' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;