import React, { useState, useEffect, Suspense, lazy } from 'react';
import LandingPage from './pages/LandingPage';
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CareerExplorerPage = lazy(() => import('./pages/CareerExplorerPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const StaticContentPage = lazy(() => import('./pages/StaticContentPage'));
import { getCurrentUser } from './services/api';
import './App.css';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staticSlug, setStaticSlug] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('genFutureToken');
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
          setCurrentView('dashboard');
        } catch (_error) {
          localStorage.removeItem('genFutureToken');
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  // Hash-based lightweight routing for static pages (About, Legal, Resources, etc.)
  useEffect(() => {
    const staticSlugs = new Set([
      'privacy','terms','cookies','blog','press','jobs',
      'help','guides','status','contact','features','pricing','licenses'
    ]);

    const handleHash = () => {
      const hash = (window.location.hash || '').replace(/^#/, '');
      if (hash === 'about') {
        setCurrentView('about');
        setStaticSlug('');
      } else if (hash === 'auth') {
        setCurrentView('auth');
        setStaticSlug('');
      } else if (hash === 'landing') {
        setCurrentView('landing');
        setStaticSlug('');
      } else if (hash === 'dashboard' && user) {
        setCurrentView('dashboard');
        setStaticSlug('');
      } else if ((hash === 'app' || hash === 'explore' || hash === 'universities' || hash === 'courses' || hash === 'careers') && user) {
        setCurrentView('app');
        setStaticSlug('');
        // Defer scroll until explorer DOM is mounted
        setTimeout(() => {
          try {
            const target = document.getElementById(hash);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } catch {}
        }, 0);
      } else if (staticSlugs.has(hash)) {
        setStaticSlug(hash);
        setCurrentView('static');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [user]);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleAuth = () => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setCurrentView('dashboard');
      } catch {
        // Handle error if needed
      }
    };

    fetchUser();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('genFutureToken');
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h2 style={{ fontSize: '2rem', margin: '1rem 0 0.5rem', fontWeight: '700' }}>GenFuture Career</h2>
          <p style={{ opacity: '0.9', fontSize: '1.1rem' }}>Loading your career exploration platform...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="App">
      <Suspense fallback={<div style={{padding:32,textAlign:'center'}}>Loading…</div>}>
        {currentView === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}

        {currentView === 'auth' && (
          <AuthPage onAuth={handleAuth} initialMode="register" />
        )}

        {currentView === 'dashboard' && user && (
          <DashboardPage user={user} onLogout={handleLogout} onGoToExplorer={() => setCurrentView('app')} />
        )}

        {currentView === 'app' && user && (
          <CareerExplorerPage user={user} onLogout={handleLogout} />
        )}

        {currentView === 'about' && (
          <AboutPage
            onBack={() => {
              const target = user ? 'dashboard' : 'landing';
              setCurrentView(target);
              try { window.history.back(); } catch {}
              window.location.hash = '';
            }}
          />
        )}

        {currentView === 'static' && (
          <StaticContentPage
            slug={staticSlug}
            onBack={() => {
              const target = user ? 'dashboard' : 'landing';
              setCurrentView(target);
              try { window.history.back(); } catch {}
              window.location.hash = '';
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;