import React from 'react';

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ama Boateng',
      role: 'Computer Science, UG',
      quote:
        'GenFuture helped me find programs that matched my interests and showed real career options. The journey felt clear and exciting.',
      initials: 'AB',
    },
    {
      name: 'Kwesi Mensah',
      role: 'Engineering, KNUST',
      quote:
        'I discovered paths I didn’t know existed and learned the skills required for each. It made planning my next steps simple.',
      initials: 'KM',
    },
    {
      name: 'Efua Osei',
      role: 'Business, Ashesi',
      quote:
        'The platform’s insights and clean UI gave me confidence. I quickly narrowed down universities and picked the right course.',
      initials: 'EO',
    },
  ];

  return (
    <section
      className="testimonials-section"
      style={{ background: 'var(--color-bg)', padding: '4rem 1rem' }}
      aria-label="Success stories from students"
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Success Stories
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Real students. Real outcomes. Exploring confidently with GenFuture.
          </p>
        </div>

        <div
          className="testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="testimonial-card"
              style={{
                background: 'var(--color-surface)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                padding: '1.5rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div
                className="testimonial-header"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>{t.name}</p>
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{t.role}</span>
                </div>
              </div>
              <blockquote style={{ margin: 0, color: 'var(--color-text)' }}>“{t.quote}”</blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;