"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

type AboutTorchContent = {
  title: string;
  content: string;
};

export function useAboutTorch() {
  const [aboutContent, setAboutContent] = useState<AboutTorchContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/settings/about-torch");
      
      if (!response.ok) {
        throw new Error("Failed to fetch About Torch content");
      }

      const data = await response.json();
      setAboutContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load About Torch content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAboutContent = async (data: AboutTorchContent) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/settings/about-torch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update About Torch content");
      }

      const result = await response.json();
      setAboutContent(result.content);
      
      toast({
        title: "Success",
        description: "About Torch content updated successfully",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update About Torch content",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    aboutContent,
    loading,
    error,
    fetchAboutContent,
    updateAboutContent,
  };
} 