"use client";

import { ReactNode } from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

interface DataLoaderProps<T> {
  isLoading: boolean;
  error: string | null;
  data: T[] | null;
  onRetry: () => void;
  emptyMessage?: string;
  children: (data: T[]) => ReactNode;
  loadingComponent?: ReactNode;
}

export function DataLoader<T>({
  isLoading,
  error,
  data,
  onRetry,
  emptyMessage = "No data found",
  children,
  loadingComponent,
}: DataLoaderProps<T>) {
  // Loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <div className="w-full space-y-cozy torch-section-compact">
        <div className="flex justify-center items-center py-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-32 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full mx-auto border-red-200 bg-red-50 my-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className="w-full mx-auto my-6 border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-600">No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{emptyMessage}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onRetry}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Data loaded successfully
  return <>{children(data)}</>;
} 