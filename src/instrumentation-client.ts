// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Session Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 0.5 : 0.1,

  // Environment and release tracking
  environment: process.env.NODE_ENV,
  
  // Enhanced integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false, // Allow text capture for better debugging (be mindful of PII)
      blockAllMedia: true,
      maskAllInputs: true, // Mask form inputs to protect sensitive data
    }),
    Sentry.browserTracingIntegration({
      // Enable automatic instrumentation of user interactions
      enableInp: true,
    }),
  ],

  // Enhanced error filtering
  beforeSend(event, hint) {
    // Filter out non-actionable errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Filter out ResizeObserver loop limit exceeded errors (common, non-actionable)
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message?.includes('ResizeObserver loop limit exceeded')) {
          return null;
        }
        
        // Filter out network errors that are likely user connectivity issues
        if (message?.includes('NetworkError') || message?.includes('fetch')) {
          // Only capture if it's a server error (5xx)
          if (!message.includes('5')) {
            return null;
          }
        }
      }
    }
    
    return event;
  },

  // Enhanced breadcrumb filtering
  beforeBreadcrumb(breadcrumb) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
      return null;
    }
    
    return breadcrumb;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;