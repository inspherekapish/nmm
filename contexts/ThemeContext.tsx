'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  fontSizeLevel: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isDyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  fontSizeLevel: 0,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  isHighContrast: false,
  toggleHighContrast: () => {},
  isDyslexiaFont: false,
  toggleDyslexiaFont: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // -2 to +2
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem('nmm_theme') as Theme;
    const savedFontSize = parseInt(localStorage.getItem('nmm_fontsize') || '0');
    const savedHighContrast = localStorage.getItem('nmm_highcontrast') === 'true';
    const savedDyslexiaFont = localStorage.getItem('nmm_dyslexia') === 'true';

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    setFontSizeLevel(Math.max(-2, Math.min(2, savedFontSize)));
    setIsHighContrast(savedHighContrast);
    setIsDyslexiaFont(savedDyslexiaFont);
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('nmm_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font size
    const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
    const currentSize = sizes[fontSizeLevel + 2];
    document.documentElement.style.setProperty('--font-size-base', currentSize);
    localStorage.setItem('nmm_fontsize', fontSizeLevel.toString());
  }, [fontSizeLevel]);

  useEffect(() => {
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    localStorage.setItem('nmm_highcontrast', isHighContrast.toString());
  }, [isHighContrast]);

  useEffect(() => {
    // Apply dyslexia font
    document.documentElement.classList.toggle('dyslexia-font', isDyslexiaFont);
    localStorage.setItem('nmm_dyslexia', isDyslexiaFont.toString());
  }, [isDyslexiaFont]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const increaseFontSize = () => {
    setFontSizeLevel(prev => Math.min(2, prev + 1));
  };

  const decreaseFontSize = () => {
    setFontSizeLevel(prev => Math.max(-2, prev - 1));
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  const toggleDyslexiaFont = () => {
    setIsDyslexiaFont(prev => !prev);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    fontSizeLevel,
    increaseFontSize,
    decreaseFontSize,
    isHighContrast,
    toggleHighContrast,
    isDyslexiaFont,
    toggleDyslexiaFont
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};