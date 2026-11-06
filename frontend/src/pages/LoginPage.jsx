import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHead from '../components/site/PageHead';
import Pass from '../components/site/Pass';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalContent } from '../contexts/ContentContext';
import { isValidEmail } from '../utils/emailValidator';
import { derivePasswordKey } from '../utils/passwordKey';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function LoginPage() {
  const globalContent = useGlobalContent();
  const auth = globalContent?.auth || {};
  const { setUser, setBanned } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = formData.email.trim();
    if (identifier.includes('@') && !isValidEmail(identifier)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const saltRes = await fetch(`${API_BASE}/api/auth/salt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginIdentifier: identifier }),
      });
      if (!saltRes.ok) throw new Error(`Login failed (${saltRes.status})`);
      const { salt } = await saltRes.json();
      const passwordKey = await derivePasswordKey(formData.password, salt);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ loginIdentifier: identifier, passwordKey }),
      });
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Non-JSON response:', text);
        const snippet = text.length > 100 ? text.slice(0, 100) + '...' : text;
        throw new Error(`Server returned invalid response. ${snippet.includes('<!DOCTYPE') ? 'Check VITE_API_URL or backend logs.' : 'Details: ' + snippet}`);
      }

      if (!res.ok) {
        if (res.status === 403 && data.error === 'Account banned') {
          setBanned?.({ isBanned: true, banReason: data.reason || 'Your account has been suspended.' });
          setError(data.reason || data.error || 'Your account has been suspended.');
        } else {
          setError(data.error || `Login failed (${res.status})`);
        }
        setIsSubmitting(false);
        return;
      }

      setUser(data.user);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pg-auth pg-wrap">
        <div className="pg-auth-main">
          <PageHead
            size="md"
            title={auth.loginTitle || 'Login'}
            lede={auth.loginSubtitle || 'Sign in to your YoutubeADwords account'}
          />

          {/* Login Form Card */}
          <div className="pg-auth-card pg-in">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Username Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {auth.emailOrUsernameLabel || 'Email or Username'} <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={auth.emailPlaceholder || 'email@example.com or username'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {auth.passwordLabel || 'Password'} <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={auth.passwordPlaceholder || 'Enter your password'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                  />
                  <span className="ml-2 text-sm text-gray-700">{auth.rememberMe || 'Remember me'}</span>
                </label>
                <Link to="/contact?reason=support&topic=password" className="text-sm text-brand-red hover:underline">
                  {auth.forgotPassword || 'Forgot password?'}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-[#C62828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (auth.loggingInButton || 'Logging in...') : (auth.logInButton || 'Login')}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {auth.noAccount || "Don't have an account?"}{' '}
                <Link to="/signup" className="text-brand-red font-semibold hover:underline">
                  {auth.signUpLinkText || 'Sign up here'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* A returning member's pass, already issued */}
        <aside className="pg-auth-side">
          <div aria-hidden="true">
            <Pass
              kind="Member pass"
              serial="YAW-0001"
              tone="dark"
              strap="var(--red)"
              title="Welcome back"
              rows={[
                { label: 'Signing in as', value: formData.email, mono: true },
                { label: 'Inside', value: 'Your orders, receipts and support tickets' },
              ]}
            />
          </div>
          <p className="pg-auth-note pg-in" style={{ '--d': '1.1s' }}>Track every order from My Orders once you are signed in.</p>
        </aside>
      </div>
    </Layout>
  );
}
