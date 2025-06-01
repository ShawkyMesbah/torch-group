"use client";

import { useState, useEffect } from 'react';
import { apiCache } from '@/utils/api-cache';

interface UseApiCacheOptions {
  ttl?: number;
  enabled?: boolean;
}

export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  const { ttl, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await apiCache.get(key, fetchFn, ttl);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, ttl, enabled]);

  const invalidate = () => {
    apiCache.invalidate(key);
    setIsLoading(true);
  };

  return { data, error, isLoading, invalidate };
} 