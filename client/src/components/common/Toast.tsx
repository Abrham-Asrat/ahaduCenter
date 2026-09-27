/**
 * Toast Component
 * 
 * Reusable toast notification component with animations.
 * Displays success, error, or info messages with appropriate icons.
 */

import type { ToastType } from '../../hooks/useToast';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'check_circle';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-primary text-black border-primary/50';
      case 'error':
        return 'bg-error/10 text-error border-error/50';
      case 'info':
        return 'bg-surface-container text-white border-white/20';
      default:
        return 'bg-primary text-black border-primary/50';
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-8 md:bottom-8 z-50 ${getStyles()} px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border backdrop-blur-sm`}
      role="alert"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-xl">{getIcon()}</span>
      <span className="text-sm font-semibold">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  );
};

export default Toast;
