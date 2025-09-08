'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Sun, Moon, Globe, Settings, LogOut, User, Bell } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/constants';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const openProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };


  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Skip Link */}
          <div className="flex items-center">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
              tabIndex={1}
            >
              {t('accessibility.skipToContent')}
            </a>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">NMM</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t('landing.title')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/resources"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              {t('nav.resources')}
            </Link>
            <Link
              href="/helpdesk"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              {t('nav.helpdesk')}
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Accessibility Controls */}
            <div className="relative">
              <button
                onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label={t('accessibility.toggleMenu')}
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Accessibility Panel */}
              <AccessibilityPanel isOpen={showAccessibilityPanel} onClose={() => setShowAccessibilityPanel(false)} />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label={t('accessibility.toggleTheme')}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label={t('accessibility.toggleLanguage')}
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => openProfileMenu()} className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    ({ROLE_LABELS[user.role]})
                  </span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
                  <Link
                    href={`/${user.role.replace('-', '')}/dashboard`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  {t('common.login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label={t('accessibility.toggleMenu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                href="/resources"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.resources')}
              </Link>
              <Link
                href="/helpdesk"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.helpdesk')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const AccessibilityPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { increaseFontSize, decreaseFontSize, toggleHighContrast, toggleDyslexiaFont, isHighContrast, isDyslexiaFont } = useTheme();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Font Size Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
          <div className="flex space-x-2">
            <button
              onClick={decreaseFontSize}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              A-
            </button>
            <button
              onClick={increaseFontSize}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              A+
            </button>
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Contrast</span>
            <input
              type="checkbox"
              checked={isHighContrast}
              onChange={toggleHighContrast}
              className="rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Dyslexia Font Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dyslexia-Friendly Font</span>
            <input
              type="checkbox"
              checked={isDyslexiaFont}
              onChange={toggleDyslexiaFont}
              className="rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};