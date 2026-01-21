import type { ReactNode, CSSProperties } from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className, hover = true, style }: CardProps) {
  return (
    <div 
      className={cn(
        "rounded-xl border border-primary-500/20 bg-dark-50 shadow-[0_10px_40px_rgba(0,0,0,0.35)] overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-[0_18px_70px_rgba(0,0,0,0.55)] hover:-translate-y-1 hover:border-primary-500/40",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

