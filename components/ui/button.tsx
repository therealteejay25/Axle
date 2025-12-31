'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-base/50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-base hover:bg-base-hover text-white font-semibold',
      secondary: 'bg-base/20 hover:bg-base/30 text-white border border-white/10',
      ghost: 'bg-base/10 hover:bg-base/20 text-white border border-transparent',
      destructive: 'bg-error hover:bg-error/90 text-white',
      outline: 'bg-base/5 hover:bg-base/10 text-white border border-base/40',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { y: -1 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="loader-light" />}
        {!loading && icon}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
