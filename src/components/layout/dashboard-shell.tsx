"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Loader2 } from "lucide-react";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Role } from "@/lib/authorization";
import { Card } from "@/components/ui/card";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  requiredRole?: Role;
  isLoading?: boolean;
}

export function DashboardShell({
  children,
  title,
  description,
  requiresAuth = true,
  requiredRole = "STAFF",
  isLoading = false,
}: DashboardShellProps) {
  const { isAuthorized, isLoading: authLoading } = 
    requiresAuth ? useAuthorization(requiredRole) : { isAuthorized: true, isLoading: false };
  
  const showLoadingState = isLoading || authLoading;

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6 space-y-6">
        {title && (
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        )}

        {showLoadingState ? (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : !isAuthorized && requiresAuth ? (
          <Card className="p-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this section.
              </p>
            </div>
          </Card>
        ) : (
          children
        )}
      </div>
    </ErrorBoundary>
  );
} 