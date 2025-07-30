/**
 * Simple date formatting utilities
 */

export function formatDistanceToNow(date: Date | string, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'just now' : 'less than a minute';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}${suffix}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}${suffix}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}${suffix}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''}${suffix}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}${suffix}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  const suffix = options?.addSuffix ? ' ago' : '';
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''}${suffix}`;
}

export function formatDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 