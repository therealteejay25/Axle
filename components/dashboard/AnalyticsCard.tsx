'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  chart?: ReactNode;
  color?: string;
  children?: ReactNode;
}

export function AnalyticsCard({
  title,
  value,
  description,
  trend,
  icon,
  chart,
  color = '#3ecf8e',
  children
}: AnalyticsCardProps) {
  
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp size={16} className="text-[#3ecf8e]" />;
    if (trend.value < 0) return <TrendingDown size={16} className="text-[#f04438]" />;
    return <Minus size={16} className="text-[#8b8b8b]" />;
  };

  const getTrendColor = () => {
    if (!trend) return '#8b8b8b';
    if (trend.value > 0) return '#3ecf8e';
    if (trend.value < 0) return '#f04438';
    return '#8b8b8b';
  };

  return (
    <Card className="p-6 bg-white/2 rounded-2xl border-2 border-white/4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-[#8b8b8b]">{title}</h3>
            {icon && <span style={{ color }}>{icon}</span>}
          </div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          {description && (
            <p className="text-sm text-[#8b8b8b]">{description}</p>
          )}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-2 mb-4">
          {getTrendIcon()}
          <span 
            className="text-sm font-semibold" 
            style={{ color: getTrendColor() }}
          >
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-[#8b8b8b]">{trend.label}</span>
        </div>
      )}

      {chart && (
        <div className="mt-4">
          {chart}
        </div>
      )}

      {children}
    </Card>
  );
}

// Stat Card with Icon (simpler version)
export function StatCard({
  label,
  value,
  icon: Icon,
  color = '#3ecf8e',
  description,
  onClick
}: {
  label: string;
  value: string | number;
  icon?: any;
  color?: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={`p-6 bg-white/2 rounded-2xl border-2 border-white/4 transition-all ${onClick ? 'cursor-pointer hover:border-white/8' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#8b8b8b]">{label}</span>
        {Icon && <Icon className="text-[20px]" style={{ color }} size={20} />}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {description && (
        <p className="text-sm text-[#8b8b8b]">{description}</p>
      )}
    </Card>
  );
}
