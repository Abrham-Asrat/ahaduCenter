import { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';

type GooglePromptNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

type GoogleIdClient = {
  initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
  renderButton: (element: Element, options: { theme: 'filled_black'; size: 'large'; width: number; text: string }) => void;
  prompt?: (callback?: (notification: GooglePromptNotification) => void) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdClient;
      };
    };
  }
}

let initializedClientId: string | null = null;
let activeCredentialCallback: ((response: GoogleCredentialResponse) => void) | null = null;

const handleCredential = (response: GoogleCredentialResponse) => {
  activeCredentialCallback?.(response);
};

type GoogleSignInButtonProps = {
  onCredential: (response: GoogleCredentialResponse) => void;
};

const GoogleSignInButton = ({ onCredential }: GoogleSignInButtonProps) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setAvailable(false);
      return undefined;
    }

    activeCredentialCallback = onCredential;
    const cleanup = () => {
      if (activeCredentialCallback === onCredential) activeCredentialCallback = null;
    };

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return false;
      if (initializedClientId !== clientId) {
        window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
        initializedClientId = clientId;
      }
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 360,
        text: 'signin_with',
      });
      setAvailable(true);
      return true;
    };

    if (window.google?.accounts?.id) {
      renderButton();
      return cleanup;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = GOOGLE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      if (!renderButton()) setAvailable(false);
    };
    const handleError = () => setAvailable(false);
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    // A script tag can already be complete without emitting a load event here.
    if (script.readyState === 'complete') handleLoad();

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      cleanup();
    };
  }, [onCredential]);

  if (available === false) {
    return <p className="text-center text-sm text-red-400">Google sign-in is not configured.</p>;
  }

  return <div ref={buttonRef} className="flex min-h-10 justify-center" aria-label="Continue with Google" />;
};

export default GoogleSignInButton;