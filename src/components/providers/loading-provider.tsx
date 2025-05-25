"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  forceStopLoading: () => void;
  isInitialPageLoad: boolean;
}

// Create the context with default values
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
  forceStopLoading: () => {},
  isInitialPageLoad: true,
});

interface LoadingProviderProps {
  children: React.ReactNode;
  initialLoadingState?: boolean;
  autoHideDelay?: number;
}

export function LoadingProvider({ 
  children, 
  initialLoadingState = true,
  autoHideDelay = 2000
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = useState(true);
  const pathname = usePathname();

  // Define callbacks to ensure stability across renders
  const startLoading = useCallback(() => {
    // Only start loading if this is the initial page load
    if (isInitialPageLoad) {
    setIsLoading(true);
    }
  }, [isInitialPageLoad]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const forceStopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle initial loading on mount
  useEffect(() => {
    setIsMounted(true);
    
    if (initialLoadingState && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mark initial page load as complete
        setIsInitialPageLoad(false);
      }, autoHideDelay);
      
      // Extreme safety timeout (10 seconds)
      const safetyTimer = setTimeout(() => {
        console.log("Safety timeout triggered to stop loading");
        setIsLoading(false);
        setIsInitialPageLoad(false);
      }, 10000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(safetyTimer);
      };
    }
  }, [initialLoadingState, autoHideDelay]);

  // Ultra safety - force stop loading if it's been active for more than 15 seconds
  useEffect(() => {
    if (isLoading) {
      const ultraSafetyTimer = setTimeout(() => {
        console.log("Ultra safety timeout triggered to stop loading");
        setIsLoading(false);
        setIsInitialPageLoad(false);
      }, 15000);
      
      return () => clearTimeout(ultraSafetyTimer);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        startLoading, 
        stopLoading, 
        forceStopLoading,
        isInitialPageLoad
      }}
    >
      {children}
      {/* Comment out or remove the LoadingScreen overlay rendering */}
      {/* <LoadingScreen /> */}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  
  return context;
}