"use client";

import { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4" role="status">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

// Error boundary for dynamic imports
const DynamicErrorBoundary = ({ error }: { error: Error }) => (
  <div className="p-4 text-red-500">
    <p>Error loading component: {error.message}</p>
  </div>
);

// Dynamic import wrapper
export function withDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent = LoadingFallback
) {
  const LazyComponent = lazy(importFn);

  return function DynamicComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Example usage:
// export const DynamicChart = withDynamicImport(() => import('./Chart')); 