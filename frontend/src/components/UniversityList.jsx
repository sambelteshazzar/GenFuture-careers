import React from 'react';

const UniversityList = ({ universities, onSelect, isLoading, canPrev, canNext, onPrevPage, onNextPage }) => {
  // Loading skeletons for universities grid
  if (isLoading) {
    const placeholders = Array.from({ length: 8 }, (_, i) => i);
    return (
      <div className="universities-container">
        <div className="universities-grid">
          {placeholders.map((i) => (
            <div
              key={`uni-skeleton-${i}`}
              className="university-card skeleton"
              aria-busy="true"
              aria-label="Loading university"
              style={{
                pointerEvents: 'none',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'linear-gradient(90deg, #f4f4f5 25%, #e9e9eb 37%, #f4f4f5 63%)',
                backgroundSize: '400% 100%',
                animation: 'skeleton-loading 1.2s ease-in-out infinite',
              }}
            >
              <div
                className="university-icon"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.05)',
                }}
              />
              <div
                className="university-name"
                style={{
                  width: '60%',
                  height: '20px',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.08)',
                  marginTop: '12px',
                }}
              />
              <div
                className="university-location"
                style={{
                  width: '40%',
                  height: '14px',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.06)',
                  marginTop: '8px',
                }}
              />
              <button
                className="select-btn"
                disabled
                aria-disabled="true"
                style={{
                  marginTop: '16px',
                  opacity: 0.5,
                  cursor: 'default',
                }}
              >
                Loading…
              </button>
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes skeleton-loading {
              0% { background-position: 100% 50%; }
              100% { background-position: 0 50%; }
            }
          `}
        </style>
      </div>
    );
  }

  if (!universities || universities.length === 0) {
    return (
      <div className="no-results">
        <p>🏫 No universities found in your area.</p>
        <p>Try expanding your search radius or check your location settings.</p>
      </div>
    );
  }

  return (
    <div className="universities-container">
      <div className="universities-grid">
        {universities.map(uni => {
          const selectable = uni && Number(uni.id) > 0;
          const latText = typeof uni?.latitude === 'number' ? uni.latitude.toFixed(2) : (uni?.latitude ? String(uni.latitude) : 'N/A');
          const lonText = typeof uni?.longitude === 'number' ? uni.longitude.toFixed(2) : (uni?.longitude ? String(uni.longitude) : 'N/A');
          const locationText = [
            (uni?.city ? uni.city : null),
            (uni?.country ? uni.country : null)
          ].filter(Boolean).join(', ');

          const handleClick = () => {
            if (!selectable) return;
            if (onSelect) onSelect(uni.id);
          };

          return (
            <div
              key={uni.id || `${uni.name}-${locationText}`}
              className={`university-card ${selectable ? '' : 'disabled'}`}
              onClick={handleClick}
              role="button"
              aria-disabled={!selectable}
              tabIndex={selectable ? 0 : -1}
            >
              <div className="university-icon">🏛️</div>
              <h3 className="university-name">
                {uni.name}
                {!selectable && (
                  <span className="badge external-only" style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}>
                    External
                  </span>
                )}
              </h3>
              <div className="university-location">
                📍 {locationText || `${latText}, ${lonText}`}
              </div>
              {uni.website && (
                <div className="university-website">
                  <a href={uni.website} target="_blank" rel="noopener noreferrer">
                    Visit website
                  </a>
                </div>
              )}
              <button
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={!selectable}
                aria-disabled={!selectable}
                title={selectable ? 'Explore available courses' : 'Local data required to explore courses'}
              >
                {selectable ? 'Explore Courses →' : 'Local data required'}
              </button>
            </div>
          );
        })}
      </div>
      <div
        className="pagination-footer"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}
      >
        <button
          className="prev-page-btn"
          onClick={onPrevPage}
          disabled={!canPrev || !onPrevPage}
          aria-disabled={!canPrev || !onPrevPage}
          title={canPrev ? 'Previous' : 'No previous page'}
        >
          ← Previous
        </button>
        <button
          className="next-page-btn"
          onClick={onNextPage}
          disabled={!canNext || !onNextPage}
          aria-disabled={!canNext || !onNextPage}
          title={canNext ? 'Next' : 'No more results'}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default UniversityList;
