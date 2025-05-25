"use client";

import { ReactNode } from "react";
import { useLoading } from "@/components/providers/loading-provider";
import { PageLoading } from "@/components/layout/page-loading";

interface LoadingWrapperProps {
  children: ReactNode;
  showLoading?: boolean;
}

export function LoadingWrapper({ 
  children, 
  showLoading = false 
}: LoadingWrapperProps) {
  const { isLoading } = useLoading();
  
  return (
    <div className="relative">
      {/* Show PageLoading component only if showLoading is true and isLoading is true */}
      {showLoading && isLoading && <PageLoading />}
      
      {/* Always render children - they'll be obscured when loading */}
      {children}
    </div>
  );
} 