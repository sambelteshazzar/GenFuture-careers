import React from 'react';
import BookmarkButton from './BookmarkButton';

const CourseList = ({ courses, onSelect, isLoading, userId }) => {
  // Loading skeletons
  if (isLoading) {
    const placeholders = Array.from({ length: 8 }, (_, i) => i);
    return (
      <div className="courses-container">
        <div className="courses-grid">
          {placeholders.map((i) => (
            <div
              key={`skeleton-${i}`}
              className="course-card skeleton"
              aria-busy="true"
              aria-label="Loading course"
              style={{
                pointerEvents: 'none',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'linear-gradient(90deg, #f4f4f5 25%, #e9e9eb 37%, #f4f4f5 63%)',
                backgroundSize: '400% 100%',
                animation: 'skeleton-loading 1.2s ease-in-out infinite',
              }}
            >
              <div
                className="course-icon"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.05)',
                }}
              />
              <div
                className="course-name"
                style={{
                  width: '70%',
                  height: '20px',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.08)',
                  marginTop: '12px',
                }}
              />
              <div className="course-description" style={{ marginTop: '12px' }}>
                <div
                  style={{
                    width: '100%',
                    height: '12px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.06)',
                    marginBottom: '8px',
                  }}
                />
                <div
                  style={{
                    width: '85%',
                    height: '12px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.06)',
                  }}
                />
              </div>
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

  if (!courses || courses.length === 0) {
    return (
      <div className="no-results">
        <p>📚 No courses found for this university.</p>
        <p>This university might not have updated their course catalog yet.</p>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => onSelect && onSelect(course.id)}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="course-icon">📖</div>
              {userId && (
                <BookmarkButton
                  userId={userId}
                  itemType="course"
                  itemId={course.id}
                  itemName={course.name}
                />
              )}
            </div>
            <h3 className="course-name">{course.name}</h3>
            <div className="course-description">
              <p>Discover career opportunities in {String(course.name || '').toLowerCase()}</p>
            </div>
            {onSelect && (
              <button className="select-btn">
                View Career Paths →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
