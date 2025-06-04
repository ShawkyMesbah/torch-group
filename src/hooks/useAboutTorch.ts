"use client";

import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";

export type AboutTorchContent = {
  title: string;
  content: string;
};

export function useAboutTorch() {
  const { data: aboutContent, error, isLoading } = useSWR<AboutTorchContent>(
    "/api/settings/about-torch",
    (url: string) => fetch(url).then((res) => res.json())
  );

  const updateAboutContent = async (data: AboutTorchContent) => {
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
      await mutate("/api/settings/about-torch");
      toast({
        title: "Success",
        description: "About Torch content updated successfully",
      });
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update About Torch content",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    aboutContent,
    loading: isLoading,
    error,
    updateAboutContent,
  };
} 