'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'failed' | 'pending' | 'running' | 'canceled' | 'active' | 'paused' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    failed: 'bg-error/10 text-error border-error/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    canceled: 'bg-text-muted/10 text-text-muted border-text-muted/20',
    active: 'bg-success/10 text-success border-success/20',
    paused: 'bg-text-muted/10 text-text-muted border-text-muted/20',
    default: 'bg-surface text-text border-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface',
        className
      )}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-text-muted mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-text">{title}</h3>
      {description && <p className="text-text-muted mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
