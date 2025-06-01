"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/utils/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view
    analytics.pageView(
      pathname,
      document.referrer,
      window.navigator.userAgent
    );
  }, [pathname, searchParams]);

  return null;
}

// Helper functions to track custom events
export const trackFormSubmit = (
  formId: string,
  formData?: Record<string, any>,
  path?: string
) => analytics.formSubmit(formId, formData, path);

export const trackPhoneVerified = (phone: string, path?: string) =>
  analytics.phoneVerified(phone, path);

export const trackTalentClick = (
  talentId: string,
  talentName: string,
  path?: string
) => analytics.talentClick(talentId, talentName, path); 