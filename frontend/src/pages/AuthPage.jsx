import React, { useState, useEffect } from 'react';
import './AuthPage.css';
import { login, register } from '../services/api';

const AuthPage = ({ onAuth, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode === 'register' ? 'signup' : 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMode(initialMode === 'register' ? 'signup' : 'login');
  }, [initialMode]);

  const validateEmail = (email) => {
    if (!email || email.trim() === '') return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';
    return null;
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === '') return 'Password is required.';
    if (password.trim().length < 8) return 'Password must be at least 8 characters long.';
    return null;
  };

  const validateSignupExtras = () => {
    const extras = {};
    if (!formData.firstName || formData.firstName.trim() === '') {
      extras.firstName = 'First name is required.';
    }
    if (!formData.lastName || formData.lastName.trim() === '') {
      extras.lastName = 'Last name is required.';
    }
    if (formData.password !== formData.confirmPassword) {
      extras.confirmPassword = 'Passwords do not match.';
    }
    return extras;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.info('[Auth] submit', {
        mode,
        email: (formData?.email || '').trim(),
        hasPassword: !!formData?.password,
        hasConfirm: !!formData?.confirmPassword,
        hasNames: !!formData?.firstName && !!formData?.lastName
      });
    }

    const newErrors = {};
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    if (mode === 'signup') {
      const extras = validateSignupExtras();
      Object.assign(newErrors, extras);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.info('[Auth] submitting flow', mode);
      }
      if (mode === 'login') {
        const response = await login(formData.email.trim(), formData.password);
        localStorage.setItem('genFutureToken', response.data.access_token);
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
          console.info('[Auth] login ok', { email: formData.email.trim(), token: !!response.data?.access_token });
        }
        onAuth && onAuth(response.data);
      } else {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
          console.info('[Auth] register request', {
            email: formData.email.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim()
          });
        }
        await register({
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          password: formData.password,
        });
        const response = await login(formData.email.trim(), formData.password);
        localStorage.setItem('genFutureToken', response.data.access_token);
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
          console.info('[Auth] register+login ok', { email: formData.email.trim(), token: !!response.data?.access_token });
        }
        onAuth && onAuth(response.data);
      }
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const detail = data?.detail;

      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.error('[Auth] flow failed', { status, data, message: error?.message });
      }

      // UX improvement: if signup fails because the email is already registered,
      // automatically attempt a login with the provided credentials.
      if (
        mode === 'signup' &&
        status === 400 &&
        (detail === 'Email already registered' || (typeof detail === 'string' && /already registered/i.test(detail)))
      ) {
        try {
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            console.info('[Auth] user exists, attempting login');
          }
          const response = await login(formData.email.trim(), formData.password);
          localStorage.setItem('genFutureToken', response.data.access_token);
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            console.info('[Auth] auto-login ok', { email: formData.email.trim(), token: !!response.data?.access_token });
          }
          onAuth && onAuth(response.data);
          return;
        } catch (loginErr) {
          const apiError = loginErr?.response?.data?.detail || 'Login failed after registration attempt.';
          setErrors({ api: apiError });
          return;
        }
      }

      const fallbackMsg = 'Incorrect email or password. Sign up to create an account or use the demo account.';
      let apiError;
      if (!error?.response) {
        apiError = 'Network error. Ensure the backend is running at http://localhost:8000 and CORS allows http://localhost:5173.';
      } else if (status === 401) {
        apiError = fallbackMsg;
      } else if (status === 422) {
        apiError = 'Invalid input. Please check your email and password format.';
      } else if (status === 404) {
        apiError = 'Authentication endpoint not found. Verify API base URL configuration.';
      } else if (status >= 500) {
        apiError = 'Server error. Please try again.';
      } else {
        apiError = detail || 'An unexpected error occurred.';
      }
      setErrors({ api: apiError });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      const demoEmail = 'demo@genfuture.com';
      const demoPassword = 'password123';
      const response = await login(demoEmail, demoPassword);
      localStorage.setItem('genFutureToken', response.data.access_token);
      onAuth && onAuth(response.data);
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const detail = data?.detail;

      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.error('[Auth] flow failed', { status, data, message: error?.message });
      }

      // UX improvement: if signup fails because the email is already registered,
      // automatically attempt a login with the provided credentials.
      if (
        mode === 'signup' &&
        status === 400 &&
        (detail === 'Email already registered' || (typeof detail === 'string' && /already registered/i.test(detail)))
      ) {
        try {
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            console.info('[Auth] user exists, attempting login');
          }
          const response = await login(formData.email.trim(), formData.password);
          localStorage.setItem('genFutureToken', response.data.access_token);
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            console.info('[Auth] auto-login ok', { email: formData.email.trim(), token: !!response.data?.access_token });
          }
          onAuth && onAuth(response.data);
          return;
        } catch (loginErr) {
          const apiError = loginErr?.response?.data?.detail || 'Login failed after registration attempt.';
          setErrors({ api: apiError });
          return;
        }
      }

      const fallbackMsg = 'Incorrect email or password. Sign up to create an account or use the demo account.';
      let apiError;
      if (!error?.response) {
        apiError = 'Network error. Ensure the backend is running at http://localhost:8000 and CORS allows http://localhost:5173.';
      } else if (status === 401) {
        apiError = fallbackMsg;
      } else if (status === 422) {
        apiError = 'Invalid input. Please check your email and password format.';
      } else if (status === 404) {
        apiError = 'Authentication endpoint not found. Verify API base URL configuration.';
      } else if (status >= 500) {
        apiError = 'Server error. Please try again.';
      } else {
        apiError = detail || 'An unexpected error occurred.';
      }
      setErrors({ api: apiError });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <h1>GenFuture</h1>
        </div>

        {mode === 'login' ? (
          <>
            <h2>Welcome Back!</h2>
            <p>Enter your credentials to access your account.</p>
          </>
        ) : (
          <>
            <h2>Create Your Account</h2>
            <p>Fill in your details to get started.</p>
          </>
        )}

        <form id="loginForm" onSubmit={handleSubmit}>
          {errors.api && (
            <div className="error-message show" id="apiError">{errors.api}</div>
          )}

          {mode === 'signup' && (
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
              <div className={`error-message ${errors.firstName ? 'show' : ''}`} id="firstNameError">
                {errors.firstName}
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
              <div className={`error-message ${errors.lastName ? 'show' : ''}`} id="lastNameError">
                {errors.lastName}
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            <div className={`error-message ${errors.email ? 'show' : ''}`} id="emailError">
              {errors.email}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <div className={`error-message ${errors.password ? 'show' : ''}`} id="passwordError">
              {errors.password}
            </div>
          </div>

          {mode === 'signup' && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <div className={`error-message ${errors.confirmPassword ? 'show' : ''}`} id="confirmPasswordError">
                {errors.confirmPassword}
              </div>
            </div>
          )}

          <div className="options">
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
          {mode === 'login' && (
            <button
              type="button"
              className="login-btn demo"
              onClick={handleDemoLogin}
              disabled={isLoading}
              title="Use a pre-seeded demo account"
              style={{ marginTop: '0.75rem', backgroundColor: '#1e40af' }}
            >
              Use Demo Account
            </button>
          )}
        </form>

        <div className="signup-link">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMode();
                }}
              >
                Sign Up
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMode();
                }}
              >
                Sign In
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;