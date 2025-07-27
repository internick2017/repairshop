/**
 * Simple in-memory cache utility for expensive operations
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired entries first
    this.cleanExpired();
    return this.cache.size;
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Clean expired entries periodically
  startCleanupInterval(interval = 10 * 60 * 1000): NodeJS.Timeout { // 10 minutes
    return setInterval(() => {
      this.cleanExpired();
    }, interval);
  }
}

// Create singleton instances for different cache types
export const queryCache = new SimpleCache<unknown>(5 * 60 * 1000); // 5 minutes for query results
export const userCache = new SimpleCache<unknown>(10 * 60 * 1000); // 10 minutes for user data
export const searchCache = new SimpleCache<unknown>(2 * 60 * 1000); // 2 minutes for search results

// Generic cache function with automatic key generation
export function withCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  cache: SimpleCache<R> = queryCache as SimpleCache<R>,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);
    
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, execute function and cache result
    const result = await fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  };
}

// Memoization for synchronous functions
export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyGenerator?: (...args: T) => string,
  cache: SimpleCache<R> = queryCache as SimpleCache<R>
) {
  const getKey = keyGenerator || ((...args: T) => JSON.stringify(args));
  
  return (...args: T): R => {
    const key = getKey(...args);
    
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, execute function and cache result
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
}

// React hook for caching
import { useCallback, useRef } from 'react';

export function useCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  deps: React.DependencyList = []
) {
  const cacheRef = useRef(new SimpleCache<R>());
  
  const cachedFn = useCallback(
    withCache(
      fn,
      (...args: T) => JSON.stringify(args),
      cacheRef.current
    ),
    [fn, ...deps]
  );

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { execute: cachedFn, clearCache };
}