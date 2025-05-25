"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/components/providers/loading-provider';

// Internal component that uses hooks that require suspense
const LoadingObserverContent = () => {
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Show loading screen ONLY on initial page load, not on route changes
  useEffect(() => {
    // Skip if this is not the initial load
    if (initialLoadComplete) {
      return;
    }
    
    // Clear any existing timeout to prevent state conflicts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // We're already in a loading state from the provider's initialLoadingState
    // Just mark when it's complete
    timeoutRef.current = setTimeout(() => {
      setInitialLoadComplete(true);
      timeoutRef.current = null;
    }, 1000);
    
    // Cleanup function to clear timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initialLoadComplete]);

  return null;
};

// Main component with suspense boundary
export function LoadingObserver() {
  return (
    <Suspense fallback={null}>
      <LoadingObserverContent />
    </Suspense>
  );
} 