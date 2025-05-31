import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiHealthCheck } from '../components/ApiHealthCheck';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  // Pre-fill with test credentials for development
  const fillTestCredentials = () => {
    setEmail('johndoe@gmail.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* API Health Check */}
        <ApiHealthCheck />
        
        {/* Logo */}
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-4xl font-display font-bold text-yellow-500">ImprovCoach</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            {/* Registration Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Don't have an account?
              </p>
              <Link to="/register">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Development Helper */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm text-center mb-3">
                For development/testing:
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fillTestCredentials}
                className="w-full"
              >
                Use Test Credentials
              </Button>
              <p className="text-gray-500 text-xs text-center mt-2">
                johndoe@gmail.com / password123
              </p>
            </div>
          </form>
        </Card>

        {/* Additional Registration Option */}
        <Card className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-opacity-10 border-yellow-500 border-opacity-30">
          <div className="text-center">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="text-lg font-bold text-yellow-300 mb-2">New to ImprovCoach?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Join thousands of improv coaches using our platform to organize lessons, 
              track progress, and build better comedy.
            </p>
            <Link to="/register">
              <Button variant="secondary" className="w-full bg-yellow-500 bg-opacity-20 border-yellow-500 text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-30">
                <UserPlus className="h-4 w-4 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 ImprovCoach. Built for improv educators.</p>
        </div>
      </div>
    </div>
  );
};