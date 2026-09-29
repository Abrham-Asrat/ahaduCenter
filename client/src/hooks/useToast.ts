/**
 * useToast Hook
 * 
 * Centralized toast notification hook with i18n support.
 * Manages toast state and provides methods to show/hide toasts with translations.
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  toast: Toast | null;
  showToast: (translationKey: string, interpolationParams?: Record<string, string | number>, type?: ToastType) => void;
  hideToast: () => void;
}

const AUTO_DISMISS_DELAY = 3000; // 3 seconds

export const useToast = (): UseToastReturn => {
  const { t } = useTranslation();
  const [toast, setToast] = useState<Toast | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback(
    (translationKey: string, interpolationParams?: Record<string, string | number>, type: ToastType = 'success') => {
      const message = t(translationKey, interpolationParams);
      setToast({ message, type });
    },
    [t]
  );

  // Auto-dismiss toast after delay
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, AUTO_DISMISS_DELAY);

      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return {
    toast,
    showToast,
    hideToast,
  };
};
