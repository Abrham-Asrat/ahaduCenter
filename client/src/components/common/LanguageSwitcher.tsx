/**
 * Language Switcher Component
 * 
 * Toggle pill language switcher for EN ⇄ አማ with Globe icon.
 * Features:
 * - Click to toggle between English and Amharic
 * - Visual feedback with emerald highlight
 * - Keyboard accessible (Enter, Space)
 * - Persists language choice to localStorage + Redux
 */

import { useLanguage } from '../../i18n/hooks';
import { LANGUAGE_CODES } from '../../i18n/types';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  compact?: boolean; // Compact mode for mobile
}

const LanguageSwitcher = ({ compact = false }: LanguageSwitcherProps) => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleLanguage();
    }
  };

  const currentCode = LANGUAGE_CODES[language];

  return (
    <button
      onClick={toggleLanguage}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        border border-white/20 bg-surface-container/50
        hover:border-primary hover:bg-primary/10
        transition-all duration-200
        text-on-surface-variant hover:text-primary
        font-semibold text-sm
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${compact ? 'px-2 py-1.5' : ''}
      `}
      aria-label={t('language.switchLanguage')}
      title={t('language.current', { language: t(`language.${language}`) })}
    >
      {/* Globe icon */}
      <span className="material-symbols-outlined text-base">
        language
      </span>

      {/* Language code */}
      {!compact && (
        <span className="text-xs uppercase tracking-wider font-bold">
          {currentCode}
        </span>
      )}
    </button>
  );
};

export default LanguageSwitcher;
