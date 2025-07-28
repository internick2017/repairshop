"use client";

import { useEffect, useMemo } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { setUserContext } from '@/lib/sentry-utils';

export function SentryUserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id || undefined,
      email: user.email || undefined,
      username: user.given_name && user.family_name 
        ? `${user.given_name} ${user.family_name}` 
        : user.given_name || undefined,
    };
  }, [user?.id, user?.email, user?.given_name, user?.family_name]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userData) {
        // Set user context in Sentry
        setUserContext(userData);
      } else {
        // Clear user context when not authenticated
        setUserContext(null);
      }
    }
  }, [userData, isAuthenticated, isLoading]);

  return <>{children}</>;
}