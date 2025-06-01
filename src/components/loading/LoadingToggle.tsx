"use client";

import { Button } from "@/components/ui/button";
import { usePageLoading } from "./hooks/usePageLoading";

export function LoadingToggle() {
  const { isLoading, startLoading, stopLoading } = usePageLoading();

  const handleClick = () => {
    if (isLoading) {
      stopLoading();
    } else {
      startLoading();
    }
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50"
    >
      {isLoading ? "Stop Loading" : "Start Loading"}
    </Button>
  );
} 