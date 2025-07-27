"use client";

import { useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { setUserContext } from '@/lib/sentry-utils';

export function SentryUserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Set user context in Sentry
        setUserContext({
          id: user.id || undefined,
          email: user.email || undefined,
          username: user.given_name && user.family_name 
            ? `${user.given_name} ${user.family_name}` 
            : user.given_name || undefined,
        });
      } else {
        // Clear user context when not authenticated
        setUserContext(null);
      }
    }
  }, [user, isAuthenticated, isLoading]);

  return <>{children}</>;
}