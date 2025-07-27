import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: {
      id?: string;
      email?: string;
      username?: string;
    };
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  }
) {
  if (typeof window === 'undefined') {
    // Server-side
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level || 'error',
    });
  } else {
    // Client-side
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level || 'error',
    });
  }
}

/**
 * Capture a message with context
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
) {
  Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: {
  id?: string;
  email?: string;
  username?: string;
  ip_address?: string;
} | null) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for better error tracking
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  data?: Record<string, unknown>;
  timestamp?: number;
}) {
  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || 'custom',
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
    timestamp: breadcrumb.timestamp || Date.now() / 1000,
  });
}

/**
 * Create a transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  op: string = 'custom'
): ReturnType<typeof Sentry.startSpan> | null {
  if (typeof window === 'undefined') {
    return null; // Skip on server for now
  }
  
  return Sentry.startSpan({
    name,
    op,
  }, (span) => span);
}

/**
 * Wrap an async function with Sentry error tracking
 */
export function withSentry<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: {
    name?: string;
    tags?: Record<string, string>;
    data?: Record<string, unknown>;
  }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      addBreadcrumb({
        message: `Calling ${context?.name || fn.name}`,
        category: 'function',
        data: context?.data,
      });
      
      const result = await fn(...args);
      
      return result;
    } catch (error) {
      captureException(error, {
        tags: {
          ...context?.tags,
          function: context?.name || fn.name,
        },
        extra: {
          ...context?.data,
          arguments: args,
        },
      });
      
      throw error;
    }
  }) as T;
}

/**
 * React hook for error tracking
 */
export function useErrorHandler() {
  return (error: Error | unknown, errorInfo?: { componentStack?: string }) => {
    captureException(error, {
      extra: {
        componentStack: errorInfo?.componentStack,
      },
      tags: {
        component: 'React',
      },
    });
  };
}