"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";

interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  siteLogoUrl?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export function useSiteConfig() {
  const { data: config, error, isLoading } = useSWR<SiteConfig>("/api/settings/site-config", fetcher);
  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async (updatedConfig: SiteConfig) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings/site-config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || "Failed to save site configuration");
      }

      mutate("/api/settings/site-config", updatedConfig, true); 

      toast({
        title: "Settings Saved",
        description: "Homepage settings updated successfully.",
      });

      return true;
    } catch (err) {
      console.error("Failed to save site config:", err);
       toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save site configuration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    isLoading,
    isSaving,
    error,
    saveConfig,
  };
} 