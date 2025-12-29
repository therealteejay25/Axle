'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

export function Card({ children, className, variant = 'default', hover = false }: CardProps) {
  const variants = {
    default: 'bg-surface border-2 border-white/4',
    glass: 'glass-card border-2 border-white/4',
    gradient: 'gradient-border',
  };

  return (
    <div
      className={cn(
        'rounded-lg',
        variants[variant],
        hover && 'transition-all hover:shadow-lg hover:shadow-base/5',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 border-2 border-white/4', className)}>{children}</div>;
}

function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 border-2 border-white/4', className)}>{children}</div>;
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 border-2 border-white/4', className)}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
