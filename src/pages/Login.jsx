import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Login.css';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions to continue.');
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Login failed. Please check your credentials.');
        setLoading(false);
      } else {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          onLogin(email, username);
          navigate('/');
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim() || !username.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions to continue.');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Signup failed. Please try again.');
        setLoading(false);
      } else {
        setSuccessMessage('Account created! Check your email for verification.');
        setTimeout(() => {
          setEmail('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setTermsAccepted(false);
          setIsCreatingAccount(false);
          setLoading(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  const handleSubmit = isCreatingAccount ? handleSignup : handleLogin;

  const dots = Array.from({ length: 25 });

  return (
    <div className="login-page">

      {/* ── LEFT PANEL ── */}
      <div className="login-left">
        <div className="brand-word">
          <span>THRIFT</span>
          <span>AF</span>
        </div>

        <div className="left-dots">
          {dots.map((_, i) => <span key={i} />)}
        </div>

        <div className="left-content">
          <span className="tag">Nairobi, Kenya</span>
          <h2>
            Street style,<br />
            <em>curated</em> for you.
          </h2>
          <p>
            Exclusive thrifted fashion, jewelry, and accessories. 
            Discover rare finds and sustainable streetwear.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        <div className="login-form-wrap">

          <div className="login-logo">
            <h1>THRIFT <span>AF</span></h1>
            <p>Members Club</p>
          </div>

          <div className="form-heading">
            <h3>{isCreatingAccount ? 'Create your account' : 'Welcome back'}</h3>
            <p>
              {isCreatingAccount
                ? 'Fill in your details to register and continue shopping.'
                : 'Enter your username and password to continue shopping.'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="e.g. yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {isCreatingAccount && (
              <div className="field-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. Dave"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
                disabled={loading}
              />
            </div>

            {isCreatingAccount && (
              <div className="field-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            )}

            <div className="checkbox-group">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms">
                By {isCreatingAccount ? 'creating an account or logging in' : 'logging in'} you accept the terms and conditions.
              </label>
            </div>

            {error && <p className="login-error">{error}</p>}
            {successMessage && <p className="login-success">{successMessage}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Processing...' : isCreatingAccount ? 'Create Account' : 'Continue to Store'}
            </button>
          </form>

          <div className="auth-toggle">
            {isCreatingAccount ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsCreatingAccount(false)}>
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{' '}
                <button type="button" onClick={() => setIsCreatingAccount(true)}>
                  Create one
                </button>
              </p>
            )}
          </div>

          <div className="forgot-password">
            <a href="mailto:support@thriftaf.com?subject=Forgot%20Password">Forgot password?</a>
          </div>

          <div className="login-footer">
            <div className="login-footer-dot" />
            <p>Discover hidden gems and sustainable style. Shop the freshest thrifted pieces in Kenya.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
