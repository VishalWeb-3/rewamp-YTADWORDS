import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalContent } from '../contexts/ContentContext';

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
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          loginIdentifier: formData.email.trim(),
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error === 'Account banned') {
          setBanned?.({ isBanned: true, banReason: data.reason || 'Your account has been suspended.' });
          setError(data.reason || data.error || 'Your account has been suspended.');
        } else {
          setError(data.error || 'Login failed');
        }
        setIsSubmitting(false);
        return;
      }

      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError('Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              {auth.loginTitle || 'Login'}
            </h1>
            <p className="text-gray-600">
              {auth.loginSubtitle || 'Sign in to your YoutubeADwords account'}
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                <a href="#" className="text-sm text-brand-red hover:underline">
                  {auth.forgotPassword || 'Forgot password?'}
                </a>
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
      </div>
    </Layout>
  );
}
