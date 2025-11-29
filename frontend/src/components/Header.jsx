import React, { useState } from 'react';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

const Header = ({ user, onLogout, onProfileClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
  };

  const handleNavClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const targetId = href.slice(1);

    // Route to About and other static informational pages using hash
    if (
      targetId === 'about' ||
      targetId === 'privacy' ||
      targetId === 'terms' ||
      targetId === 'cookies' ||
      targetId === 'blog' ||
      targetId === 'press' ||
      targetId === 'jobs' ||
      targetId === 'help' ||
      targetId === 'guides' ||
      targetId === 'status' ||
      targetId === 'contact' ||
      targetId === 'features' ||
      targetId === 'pricing' ||
      targetId === 'licenses'
    ) {
      event.preventDefault();
      try {
        window.location.hash = href;
      } catch {
        // no-op
      }
      return;
    }

    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      event.preventDefault();
      try {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {
        // Fallback for older browsers that may not support smooth behavior
        window.location.hash = href;
      }
    } else {
      // Missing anchor: route via hash so App can handle it
      event.preventDefault();
      console.warn(`[Header] Missing anchor target: ${href}`);
      try {
        window.location.hash = href;
      } catch {
        // no-op
      }
    }
  };
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <Logo size="medium" variant="dark" />
          <div className="brand-text">
            <h1>GenFuture Career</h1>
            <span className="tagline">Shape Your Future</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <div className="nav-links">
            <a href="#explore" className="nav-link active" onClick={handleNavClick}>Explore</a>
            <a href="#universities" className="nav-link" onClick={handleNavClick}>Universities</a>
            <a href="#careers" className="nav-link" onClick={handleNavClick}>Careers</a>
            <a href="#about" className="nav-link" onClick={handleNavClick}>About</a>
          </div>
        </nav>

        {/* User Menu */}
        <div className="header-user">
          <div className="user-info">
            <span className="user-greeting">Welcome back,</span>
            <span className="user-name">{user.first_name}</span>
          </div>
          
          <div className="user-dropdown">
            <button 
              className="user-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar-circle">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </div>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-details">
                    <p className="user-full-name">{user.first_name} {user.last_name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item" onClick={onProfileClick}>
                  <UserIcon className="w-4 h-4" />
                  Profile Settings
                </button>
                
                <button className="dropdown-item">
                  <Cog6ToothIcon className="w-4 h-4" />
                  Preferences
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;