/**
 * i18next Configuration
 * 
 * Initializes i18next with:
 * - Language detection (localStorage → navigator → fallback)
 * - English and Amharic locale resources
 * - Dynamic HTML lang attribute updates
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import am from './locales/am.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      am: {
        translation: am,
      },
    },
    fallbackLng: 'en', // Fallback language
    supportedLngs: ['en', 'am'], // Supported languages
    debug: import.meta.env.DEV, // Enable debug mode in development
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
      lookupLocalStorage: 'ahadu.lang', // localStorage key
      caches: ['localStorage'], // Cache language selection
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    returnNull: false, // Return key instead of null for missing translations
  });

// Update HTML lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

// Set initial HTML lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export default i18n;
