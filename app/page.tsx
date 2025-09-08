'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/lib/constants';
import {
  GraduationCap,
  Users,
  School,
  ClipboardCheck,
  BarChart3,
  Settings,
  ArrowRight,
  BookOpen,
  Award,
  Target
} from 'lucide-react';

const roleIcons = {
  [ROLES.MENTEE]: GraduationCap,
  [ROLES.MENTOR]: Users,
  [ROLES.SCHOOL_HEAD]: School,
  // [ROLES.REVIEWER]: ClipboardCheck,
  // [ROLES.STATE_ADMIN]: BarChart3,
  // [ROLES.MAIN_ADMIN]: Settings,
};

export default function HomePage() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect authenticated users to their dashboard
    const dashboardPath = `/${user.role.replace('-', '')}/dashboard`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Continue to your {ROLE_LABELS[user.role]} dashboard
            </p>
            <Link
              href={dashboardPath}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('landing.title')}
          </h1>

          <p className="text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">
            {t('landing.subtitle')}
          </p>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            {t('landing.description')}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Mentors</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50,000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Teachers Mentored</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1,00,000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Sessions Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('landing.chooseRole')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select your role to access the appropriate features and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(ROLES).map((role) => {
            const Icon = roleIcons[role];
            return (
              <Link
                key={role}
                href="/register"
                className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t(`roles.${role}`) || ROLE_LABELS[role]}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {ROLE_DESCRIPTIONS[role]}
                </p>

                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive tools for effective mentoring and professional development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                E-Resources Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access comprehensive educational materials, guides, and tutorials
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mentoring Sessions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Schedule and conduct one-on-one and group mentoring sessions
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor learning progress with detailed analytics and reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators in our mission to improve teaching quality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors"
            >
              {t('common.register')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors"
            >
              {t('common.login')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}