import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@palitana99yatra.org');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yatra-maroon via-yatra-maroonDark to-yatra-purple flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <span className="text-[250px] font-serif font-black text-amber-100">卐</span>
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Back to Home Link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs text-amber-200/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-gujarati">મુખ્ય વેબસાઇટ પર પાછા જાઓ (Back to Website)</span>
          </Link>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-3xl border-2 border-yatra-gold p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yatra-maroon to-yatra-maroonLight text-amber-100 flex items-center justify-center mx-auto shadow-md border-2 border-yatra-gold">
              <Shield className="w-8 h-8 text-yatra-goldAccent" />
            </div>
            <h2 className="text-2xl font-extrabold text-yatra-maroon font-serifHeading">
              Admin Portal Login
            </h2>
            <p className="text-xs text-gray-500 font-gujarati">
              શ્રી શત્રુંજય પાલિતાણા ૯૯ યાત્રા વહીવટી સંચાલન
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@palitana99yatra.org"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-yatra-maroon hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-yatra-maroon to-yatra-maroonLight hover:from-yatra-maroonLight hover:to-yatra-maroon text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2 border border-yatra-goldLight/40"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-200" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-3.5 py-1.5 text-xs text-yatra-maroon bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 font-semibold transition-all flex items-center justify-center space-x-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-yatra-goldDark" />
              <span>Fill Default Admin Credentials (admin@palitana99yatra.org)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <Shield className="w-10 h-10 text-yatra-maroon mx-auto" />
            <h4 className="font-bold text-base text-yatra-maroon">Administrator Password Recovery</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-gujarati">
              For security, administrator password resets are handled via the root admin credentials or directly in the system configuration file (.env).
            </p>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 font-mono">
              Default Password: <strong>admin123</strong>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-yatra-maroon text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
