import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiHealthCheck } from '../components/ApiHealthCheck';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  experience?: string;
}

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    experience: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio?.trim(),
        experience: formData.experience?.trim()
      });
      
      if (result.success) {
        setSuccess(true);
        // The AuthContext will handle the redirect after successful registration
      } else {
        setErrors({ general: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* API Health Check */}
          <ApiHealthCheck />
          
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome to ImprovCoach!</h2>
            <p className="text-gray-400 mb-6">
              Your account has been created successfully. You're being redirected to your dashboard...
            </p>
            <LoadingSpinner />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* API Health Check */}
        <ApiHealthCheck />
        
        {/* Logo */}
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-4xl font-display font-bold text-yellow-500">ImprovCoach</h1>
          <p className="text-gray-400 mt-2">Create your coaching account</p>
        </div>

        {/* Registration Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    errors.firstName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    errors.lastName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-yellow-500 focus:ring-yellow-500'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 pr-12 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                  placeholder="Create a password (min. 6 characters)"
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
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 pr-12 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Optional Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                    Teaching Experience
                  </label>
                  <input
                    id="experience"
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    placeholder="e.g., 5 years teaching improv at UCB"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    placeholder="Tell us about your improv background..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-400 hover:text-gray-200 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 ImprovCoach. Built for improv educators.</p>
        </div>
      </div>
    </div>
  );
};