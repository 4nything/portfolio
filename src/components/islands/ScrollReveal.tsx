import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Simplified component that relies on the global script in BaseLayout
// This avoids needing client:load/visible on every usage
export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  return (
    <div
      className={`reveal ${className}`.trim()}
      data-reveal-delay={delay}
    >
      {children}
    </div>
  );
}
