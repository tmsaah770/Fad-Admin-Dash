import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@parkly.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated with a valid real token, redirect directly to dashboard
  useEffect(() => {
    const token = localStorage.getItem('parkly_token');
    if (token && token !== 'demo_admin_jwt_token') {
      navigate('/', { replace: true });
    } else {
      // Clear out any old fake/demo token
      localStorage.removeItem('parkly_token');
      localStorage.removeItem('parkly_user');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Direct call to live backend: POST https://parkly-backend.up.railway.app/api/auth/login
      const res = await authService.login({ email: email.trim(), password });
      
      if (res?.isSuccess && res?.data?.token) {
        // Authenticated successfully with backend
        navigate('/', { replace: true });
      } else {
        setErrorMsg(res?.message || 'Invalid Email or Password.');
      }
    } catch (err) {
      console.warn('Backend login response:', err);
      // Strictly show backend error without any bypass
      const message =
        err?.data?.message ||
        err?.message ||
        'Invalid Email or Password. Please check your credentials.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-page" id="login-page">
      {/* =============================================
          LEFT HERO SECTION
          ============================================= */}
      <div className="login-left-side">
        {/* Top Brand Logo */}
        <div className="login-brand-logo">
          <div className="login-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 7C5 5.34315 6.34315 4 8 4H14C16.7614 4 19 6.23858 19 9C19 11.7614 16.7614 14 14 14H9V20H5V7Z"
                fill="#2B76F6"
              />
              <path
                d="M9 7H13.5C14.8807 7 16 8.11929 16 9.5C16 10.8807 14.8807 12 13.5 12H9V7Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <span className="login-brand-name">PARKLY</span>
        </div>

        {/* Center Graphic & Slogan */}
        <div className="login-center-content">
          <div className="login-graphic-container">
            {/* White Floating Pin */}
            <div className="login-graphic-pin">
              <div className="login-graphic-pin-inner"></div>
            </div>

            {/* Parking Badge */}
            <div className="login-graphic-p-badge">P</div>

            {/* Glassmorphic Parking Bays with Stylized Cars */}
            <div className="login-parking-bays">
              <div className="login-bay-card">
                <div className="login-bay-lines">
                  <div className="login-car-silhouette"></div>
                </div>
              </div>

              <div className="login-bay-card">
                <div className="login-bay-lines">
                  <div className="login-car-silhouette"></div>
                </div>
              </div>
            </div>

            {/* Road dashed line */}
            <div className="login-road-dashes"></div>
          </div>

          <h2 className="login-headline">
            Smart Parking.
            <br />
            Simple Reservations.
          </h2>
          <p className="login-subheadline">
            Manage parking, reservations and availability with ease.
          </p>
        </div>

        {/* Left Footer Copyright */}
        <div className="login-left-footer">
          © 2026 Parkly. All rights reserved.
        </div>
      </div>

      {/* =============================================
          RIGHT LOGIN FORM SECTION
          ============================================= */}
      <div className="login-right-side">
        <div className="login-form-card">
          {/* Admin Role Pill Badge */}
          <div className="login-admin-badge">
            <span className="login-admin-dot"></span>
            <span>Parking Admin</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="login-card-title">Welcome Back</h1>
          <p className="login-card-sub">
            Sign in to manage your parking locations.
          </p>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#FEF3F2',
                color: '#D92D20',
                borderRadius: '10px',
                fontSize: '12.5px',
                marginBottom: '16px',
                border: '1px solid #FECDCA',
              }}
            >
              <AlertCircle size={16} flexShrink={0} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrapper">
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                className="login-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link requested for ' + email);
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Help Footer */}
          <p className="login-help-text">
            Need help?
            <a
              href="#support"
              className="login-help-link"
              onClick={(e) => {
                e.preventDefault();
                alert('Contact Support: support@parkly.com');
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
