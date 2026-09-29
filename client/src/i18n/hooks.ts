/**
 * useLanguage Hook
 * 
 * Custom hook for managing language state across Redux and i18next.
 * Provides language getters/setters and RTL support.
 */

import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLanguage as setLanguageAction, initializeLanguage } from '../redux/slices/languageSlice';
import type { Language } from './types';
import { LANGUAGE_NAMES } from './types';

interface UseLanguageReturn {
  language: Language;
  languageName: string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean; // Always false for now (both languages are LTR)
}

export const useLanguage = (): UseLanguageReturn => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.language.language);

  // Initialize language from i18next on mount
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  const setLanguage = useCallback(
    (lang: Language) => {
      dispatch(setLanguageAction(lang));
    },
    [dispatch]
  );

  const toggleLanguage = useCallback(() => {
    const newLang: Language = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
  }, [language, setLanguage]);

  const languageName = LANGUAGE_NAMES[language];

  return {
    language,
    languageName,
    setLanguage,
    toggleLanguage,
    isRTL: false, // Both English and Amharic are LTR
  };
};
