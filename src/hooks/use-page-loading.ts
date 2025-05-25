"use client";

import { useEffect, useCallback, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/components/providers/loading-provider';

interface UsePageLoadingOptions {
  enabled?: boolean;
  loadingDuration?: number;
  minLoadingTime?: number;
  maxLoadingTime?: number;
  showInitialLoading?: boolean;
}

export function usePageLoading({
  enabled = true,
  loadingDuration = 1000,
  minLoadingTime = 500,
  maxLoadingTime = 5000,
  showInitialLoading = true,
}: UsePageLoadingOptions = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading, isLoading, isInitialPageLoad } = useLoading();
  const [manuallyTriggered, setManuallyTriggered] = useState(false);
  const [initialPageVisited, setInitialPageVisited] = useState(false);
  
  // Mark initial page as visited after first render
  useEffect(() => {
    setInitialPageVisited(true);
  }, []);
  
  // Start loading manually and track state - but only for initial page load
  const startPageLoading = useCallback(() => {
    if (!enabled || !isInitialPageLoad) return;
    
    setManuallyTriggered(true);
    startLoading();
    
    // Safety timeout to ensure loading doesn't get stuck
    setTimeout(() => {
      setManuallyTriggered(false);
      stopLoading();
    }, maxLoadingTime);
  }, [enabled, maxLoadingTime, startLoading, stopLoading, isInitialPageLoad]);
  
  // Stop loading manually
  const stopPageLoading = useCallback(() => {
    if (manuallyTriggered) {
      setManuallyTriggered(false);
      setTimeout(() => {
        stopLoading();
      }, minLoadingTime);
    }
  }, [manuallyTriggered, minLoadingTime, stopLoading]);
  
  // Handle route changes - but only show loading on initial page load
  useEffect(() => {
    if (!enabled) return;
    
    // Don't trigger loading again if it was manually triggered
    if (manuallyTriggered) return;
    
    // Only show loading on initial page load, not on navigation
    if (!showInitialLoading || initialPageVisited || !isInitialPageLoad) return;
    
    startLoading();
    
    const timer = setTimeout(() => {
      stopLoading();
    }, loadingDuration);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, startLoading, stopLoading, enabled, 
      loadingDuration, manuallyTriggered, showInitialLoading, 
      initialPageVisited, isInitialPageLoad]);
  
  return {
    startPageLoading,
    stopPageLoading,
    isLoading
  };
} 