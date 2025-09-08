type Language = 'en' | 'hi';

interface Translations {
  [key: string]: string | Translations;
}

let currentLanguage: Language = 'en';
let translations: Record<Language, Translations> = {
  en: {},
  hi: {}
};

export const loadTranslations = async (lang: Language) => {
  try {
    const response = await fetch(`/i18n/${lang}.json`);
    const data = await response.json();
    translations[lang] = data;
    return data;
  } catch (error) {
    console.error('Failed to load translations:', error);
    return {};
  }
};

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'hi' ? 'ltr' : 'ltr'; // Both languages are LTR
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['en', 'hi'].includes(stored)) {
      return stored;
    }
  }
  return currentLanguage;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  // Fallback to English
  value = translations['en'];
  for (const k of keys) {
    value = value?.[k];
  }
  
  return typeof value === 'string' ? value : key;
};

// Initialize on client
export const initializeI18n = async () => {
  const lang = getLanguage();
  await Promise.all([
    loadTranslations('en'),
    loadTranslations('hi')
  ]);
  setLanguage(lang);
};