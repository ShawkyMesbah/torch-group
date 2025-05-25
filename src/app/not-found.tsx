"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Component that uses useSearchParams safely inside Suspense
const SearchParamsHandler = () => {
  return null; // We don't actually need to use search params for now
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        {/* Suspense boundary for any client hooks */}
        <Suspense fallback={<div>Loading...</div>}>
          <SearchParamsHandler />
        </Suspense>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 