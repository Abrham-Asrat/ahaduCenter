/**
 * Language Redux Slice
 * 
 * Manages language state in Redux store and syncs with i18next.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Language } from '../../i18n/types';
import i18n from '../../i18n/config';

interface LanguageState {
  language: Language;
}

const initialState: LanguageState = {
  language: 'en',
};

const safeLanguage = (value?: string): Language => {
  if (value === 'am') return 'am';
  return 'en';
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Sync with i18next
      i18n.changeLanguage(action.payload);
      // Update HTML lang attribute
      if (typeof document !== 'undefined') {
        document.documentElement.lang = action.payload;
      }
    },
    initializeLanguage: (state) => {
      // Initialize from i18next (which reads from localStorage/navigator)
      const currentLang = safeLanguage(i18n.resolvedLanguage ?? i18n.language);
      state.language = currentLang;
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
