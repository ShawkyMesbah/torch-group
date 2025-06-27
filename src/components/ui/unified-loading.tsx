"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  variant = "spinner", 
  size = "md", 
  text, 
  className,
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen && "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
    className
  );

  const renderSpinner = () => (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={cn("animate-spin torch-text-primary-warm", sizeClasses[size])} />
      {text && (
        <p className={cn("torch-text-primary-warm font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderDots = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse",
              size === "sm" && "w-1 h-1",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-3 h-3",
              size === "xl" && "w-4 h-4"
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.4s"
            }}
          />
        ))}
      </div>
      {text && (
        <p className={cn("torch-text-primary-warm font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "bg-gradient-to-r from-orange-500/20 to-red-600/20 border-2 border-orange-400/40 rounded-full torch-pulse shadow-[0_0_20px_rgba(255,87,34,0.2)]",
        sizeClasses[size]
      )} />
      {text && (
        <p className={cn("torch-text-primary-warm font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderSkeleton = () => (
            <div className="w-full space-y-cozy">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700/40 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700/40 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-700/40 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/40 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-700/40 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-700/40 rounded w-3/4"></div>
      </div>
      {text && (
        <p className={cn("torch-text-primary font-medium text-center", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoading()}
    </div>
  );
}

// Specialized loading components for common use cases
export function PageLoading({ text = "Loading page..." }: { text?: string }) {
  return <Loading variant="spinner" size="lg" text={text} fullScreen />;
}

export function SectionLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="py-12">
      <Loading variant="spinner" size="md" text={text} />
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="torch-card p-6">
      <Loading variant="skeleton" />
    </div>
  );
}

export function ButtonLoading({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <Loading variant="spinner" size={size} className="p-2" />;
} 