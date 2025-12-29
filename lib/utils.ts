import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as dfFormat, formatDistanceToNow as dfFormatDistanceToNow, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function safeFormat(date: any, formatStr: string = 'PPpp'): string {
  const d = new Date(date);
  if (!isValid(d)) return 'N/A';
  return dfFormat(d, formatStr);
}

export function safeFormatDistanceToNow(date: any, options?: any): string {
  const d = new Date(date);
  if (!isValid(d)) return 'N/A';
  return dfFormatDistanceToNow(d, options);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'text-green-600 dark:text-green-400',
    failed: 'text-red-600 dark:text-red-400',
    pending: 'text-yellow-600 dark:text-yellow-400',
    running: 'text-blue-600 dark:text-blue-400',
    canceled: 'text-gray-600 dark:text-gray-400',
  };
  return colors[status] || colors.pending;
}

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    paused: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  };
  return classes[status] || classes.pending;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(',')),
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
