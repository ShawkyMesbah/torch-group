"use client";

import { useState, useEffect } from "react";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";

export function LoadingToggle() {
  // Always return null to ensure this component never renders
  return null;

  /* Original code commented out
  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState(2500);
  const [error, setError] = useState<string | null>(null);
  const [loadingHookError, setLoadingHookError] = useState<string | null>(null);
  
  // Always attempt to get loading context, but catch errors
  let loadingContext;
  try {
    loadingContext = useLoading();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // Store error in state instead of trying to use setError directly
    if (mounted) {
      setLoadingHookError(errorMessage);
    }
  }
  
  // Only mount the component after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== "development" || !mounted) {
    return null;
  }

  // Show error state if loading context is not available
  if (loadingHookError) {
    return (
      <div className="fixed bottom-4 right-4 z-[9990] bg-red-950/80 p-3 rounded-md border border-red-800 shadow-xl">
        <h4 className="text-sm font-medium text-white mb-2">Loading Error</h4>
        <p className="text-xs text-red-300">{loadingHookError}</p>
      </div>
    );
  }
  
  // If we have a valid loading context, render the control panel
  if (loadingContext) {
    const { isLoading, startLoading, stopLoading, forceStopLoading } = loadingContext;

    const handleStartLoading = () => {
      startLoading();
      setTimeout(() => {
        stopLoading();
      }, duration);
    };

    return (
      <div className="fixed bottom-4 right-4 z-[9990] bg-black/80 p-3 rounded-md border border-gray-800 shadow-xl">
        <h4 className="text-sm font-medium text-white mb-2">Loading Control</h4>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Duration:</span>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{duration}ms</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleStartLoading}
              disabled={isLoading}
              className="text-xs h-7 px-2"
            >
              {isLoading ? "Loading..." : "Test Loading"}
            </Button>
            {isLoading && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={stopLoading}
                className="text-xs h-7 px-2"
              >
                Stop
              </Button>
            )}
          </div>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={forceStopLoading}
            className="text-xs h-7 px-2"
          >
            Force Reset
          </Button>
        </div>
      </div>
    );
  }
  
  // Fallback in case we have some other unexpected state
  return null;
  */
} 