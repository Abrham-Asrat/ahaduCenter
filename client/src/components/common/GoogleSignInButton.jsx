import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';

const GoogleSignInButton = ({ onCredential }) => {
  const buttonRef = useRef(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setAvailable(false);
      return undefined;
    }

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredential });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 360,
        text: 'signin_with',
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
      return undefined;
    }

    let script = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = GOOGLE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderButton);
    return () => script.removeEventListener('load', renderButton);
  }, [onCredential]);

  if (!available) {
    return <p className="text-center text-sm text-red-400">Google sign-in is not configured.</p>;
  }

  return <div ref={buttonRef} className="flex min-h-10 justify-center" />;
};

export default GoogleSignInButton;