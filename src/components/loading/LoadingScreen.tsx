"use client";

import { useEffect, useState } from "react";
import { AnimatedFadeIn } from "@/components/animations/AnimatedFadeIn";
import { AnimatedGridBackground } from "@/components/animations/AnimatedGridBackground";

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  showProgress?: boolean;
}

export function LoadingScreen({
  isLoading,
  message = "Loading...",
  showProgress = false,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setDots("");
      return;
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + Math.random() * 10, 100);
      });
    }, 200);

    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <AnimatedFadeIn>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <AnimatedGridBackground />
        <div className="relative z-10 flex flex-col items-center space-y-4 text-white">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-red-500 blur-lg opacity-50" />
            <img
              src="/images/logo.svg"
              alt="Logo"
              className="h-16 w-16 relative z-10"
            />
          </div>

          {/* Message */}
          <p className="text-lg font-medium">
            {message}
            <span className="inline-block w-8">{dots}</span>
          </p>

          {/* Progress Bar */}
          {showProgress && (
            <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </AnimatedFadeIn>
  );
} 