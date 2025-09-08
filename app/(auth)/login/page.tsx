'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { loginUser } from '@/lib/mockApi';
import { UserRole } from '@/lib/types';
import { ROLES, ROLE_LABELS } from '@/lib/constants';
import { validateEmail, validateMobile } from '@/lib/validators';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    role: '' as UserRole | '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  const roleOptions = Object.values(ROLES).map(role => ({
    value: role,
    label: ROLE_LABELS[role]
  }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrMobile) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    } else {
      const isEmail = formData.emailOrMobile.includes('@');
      if (isEmail && !validateEmail(formData.emailOrMobile)) {
        newErrors.emailOrMobile = 'Invalid email format';
      } else if (!isEmail && !validateMobile(formData.emailOrMobile)) {
        newErrors.emailOrMobile = 'Invalid mobile number format';
      }
    }

    if (loginMethod === 'password' && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const authState = await loginUser(
        formData.emailOrMobile,
        formData.password,
        formData.role as UserRole
      );
      
      login(authState.user!);
      
      // Redirect to role-specific dashboard
      const dashboardPath = `/${formData.role.replace('-', '')}/dashboard`;
      router.push(dashboardPath);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          {/* Login Method Tabs */}
          <div className="flex space-x-1 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <Select
              label={t('auth.role')}
              options={roleOptions}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              error={errors.role}
              placeholder="Select your role"
              required
            />

            {/* Email/Mobile Input */}
            <Input
              label={loginMethod === 'otp' ? t('auth.mobile') : `${t('auth.email')} or ${t('auth.mobile')}`}
              type={loginMethod === 'otp' ? 'tel' : 'text'}
              value={formData.emailOrMobile}
              onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
              error={errors.emailOrMobile}
              placeholder={loginMethod === 'otp' ? 'Enter mobile number' : 'Enter email or mobile'}
              required
            />

            {/* Password Input (only for password method) */}
            {loginMethod === 'password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('auth.password')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {errors.submit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Link (only for password method) */}
            {loginMethod === 'password' && (
              <div className="text-sm text-center">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {loginMethod === 'password' ? t('common.login') : 'Continue with OTP'}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p><strong>Mentee:</strong> mentee@example.com</p>
              <p><strong>Mentor:</strong> mentor@example.com</p>
              <p><strong>Password:</strong> any password (demo)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}