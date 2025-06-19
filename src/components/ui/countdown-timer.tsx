"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date | string;
  title?: string;
  description?: string;
  onComplete?: () => void;
  className?: string;
  variant?: "default" | "minimal" | "bordered";
}

export function CountdownTimer({
  targetDate,
  title,
  description,
  onComplete,
  className,
  variant = "default",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Normalize target date
    const target = typeof targetDate === "string" 
      ? new Date(targetDate) 
      : targetDate;

    // Calculate time difference
    const calculateTimeLeft = () => {
      const difference = +target - +new Date();
      
      // If countdown complete
      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  // Format number to always have two digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  // Render time unit box
  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    if (variant === "minimal") {
      return (
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold mr-1 text-white">{formatNumber(value)}</span>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      );
    }
    
    if (variant === "bordered") {
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-2">
            <div className="absolute inset-0 bg-gray-900/50 border border-gray-800"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
              {formatNumber(value)}
            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 torch-bg-primary text-white text-[10px] px-2 py-0.5">
              {label}
            </div>
          </div>
        </div>
      );
    }
    
    // Default variant
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-1 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{formatNumber(value)}</span>
          </div>
          {/* Animated pulsing red border */}
          <div className="absolute inset-0 border border-red-600/30 animate-pulse-slow"></div>
          {/* Red line at the bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-1 torch-bg-primary"></div>
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  return (
    <div className={cn("text-center", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-400 text-sm mb-5">{description}</p>
      )}
      
      <div 
        className={cn(
          "flex items-center justify-center gap-4",
          variant === "minimal" && "gap-6",
          isComplete && "opacity-50"
        )}
      >
        <TimeUnit value={timeLeft.days} label="days" />
        <div className="text-gray-600 text-2xl pb-4">:</div>
        <TimeUnit value={timeLeft.hours} label="hours" />
        <div className="text-gray-600 text-2xl pb-4">:</div>
        <TimeUnit value={timeLeft.minutes} label="mins" />
        <div className="text-gray-600 text-2xl pb-4">:</div>
        <TimeUnit value={timeLeft.seconds} label="secs" />
      </div>
      
      {isComplete && (
                    <p className="torch-text-error mt-4 text-sm font-medium">
          The countdown has ended!
        </p>
      )}
    </div>
  );
} 