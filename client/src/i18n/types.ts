/**
 * i18n Type Definitions
 * 
 * Defines language types and constants for the internationalization system.
 */

export type Language = 'en' | 'am';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'am'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  am: 'አማርኛ'
};

export const LANGUAGE_CODES: Record<Language, string> = {
  en: 'EN',
  am: 'አማ'
};

// Type augmentation for i18next (enables typed translation keys)
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
