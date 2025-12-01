import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import AboutPage from './pages/AboutPage';
import StaticContentPage from './pages/StaticContentPage';
import { supabase } from './services/supabase';
import './App.css';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staticSlug, setStaticSlug] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      // Set a maximum timeout for loading
      const timeoutId = setTimeout(() => {
        console.log('Auth check timed out after 2 seconds');
        setIsLoading(false);
      }, 2000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth error:', error);
        }
        if (session?.user) {
          setUser(session.user);
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
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

  const handleAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
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
    </div>
  );
}

export default App;