import React, { useEffect, useRef } from 'react';

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // autofocus close button
      const btn = dialogRef.current?.querySelector('[data-autofocus]');
      btn?.focus();

      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose?.();
        }
        if (e.key === 'Tab') {
          // focus trap within modal
          const focusable = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const focusArray = Array.from(focusable).filter((el) => !el.hasAttribute('disabled'));
          if (focusArray.length === 0) return;
          const first = focusArray[0];
          const last = focusArray[focusArray.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      const onClick = (e) => {
        // close when clicking backdrop
        if (e.target.classList.contains('video-modal-overlay')) {
          onClose?.();
        }
      };

      const root = dialogRef.current;
      root?.addEventListener('keydown', onKeyDown);
      root?.addEventListener('click', onClick);
      return () => {
        root?.removeEventListener('keydown', onKeyDown);
        root?.removeEventListener('click', onClick);
      };
    } else {
      document.body.style.overflow = '';
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="video-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      ref={dialogRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="video-modal-content"
        style={{
          width: 'min(100%, 900px)',
          background: 'var(--color-surface)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          className="video-modal-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            background:
              'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(124,58,237,0.08))',
          }}
        >
          <h3 id="video-modal-title" style={{ margin: 0, color: 'var(--color-text)', fontWeight: 600 }}>
            Watch Demo
          </h3>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close video modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
            }}
            onMouseEnter={(e)=>{ e.currentTarget.style.background='var(--color-bg)';}}
            onMouseLeave={(e)=>{ e.currentTarget.style.background='transparent';}}
          >
            Close
          </button>
        </div>

        <div
          className="video-modal-body"
          style={{
            aspectRatio: '16 / 9',
            width: '100%',
            background: '#000',
          }}
        >
          <iframe
            title="GenFuture Career demo video"
            src={videoUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;