import { useTranslation } from 'react-i18next';

interface MobileFilterButtonProps {
  onClick: () => void;
  activeCount?: number;
}

const MobileFilterButton = ({ onClick, activeCount = 0 }: MobileFilterButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('filters.mobileButton.ariaLabel')}
      className="fixed bottom-24 right-4 z-40 flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary p-3 font-bold text-black shadow-2xl transition-transform hover:scale-105 md:hidden sm:right-6 sm:p-4"
    >
      <span className="material-symbols-outlined">tune</span>
      <span className="text-sm">{t('filters.mobileButton.label')}</span>
      {activeCount > 0 && (
        <span className="text-xs opacity-80">
          {t('filters.mobileButton.activeCount', { count: activeCount })}
        </span>
      )}
    </button>
  );
};

export default MobileFilterButton;
