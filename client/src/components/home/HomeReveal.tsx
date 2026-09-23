import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type HomeRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const HomeReveal = ({ children, className = '', delay = 0 }: HomeRevealProps) => {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = revealRef.current;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (!element || prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className={`home-reveal ${isVisible ? 'home-reveal-visible' : ''} ${className}`}
      style={{ '--home-reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
};

export default HomeReveal;
