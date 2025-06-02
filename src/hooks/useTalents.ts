"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Talent, TalentCategory, TalentStatus } from "@/generated/prisma";
import useSWR, { mutate } from 'swr';

type TalentFormData = {
  name: string;
  role: string;
  category: TalentCategory;
  bio: string;
  imageUrl?: string;
  status: TalentStatus;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Define a fetcher function
const fetcher = async (url: string) => {
  const fetchWithRetry = async (
    fetchUrl: string, 
    options?: RequestInit, 
    retries = MAX_RETRIES
  ): Promise<any> => { // Change return type to any for flexibility with JSON
    try {
      const response = await fetch(fetchUrl, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
      
      return response.json(); // Return parsed JSON
    } catch (err) {
      if (retries <= 0) throw err;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(fetchUrl, options, retries - 1);
    }
  };
  return fetchWithRetry(url);
};

export function useTalents() {
  // Use useSWR for data fetching
  const { data: talents, error, isLoading: loading } = useSWR<Talent[]>('/api/talents', fetcher);

  const createTalent = async (data: TalentFormData) => {
    // Optimistic update (optional but good practice with SWR)
    const optimisticTalent = {
      id: `temp-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Talent; // Cast for optimistic update structure

    const options = {
      optimisticData: talents ? [...talents, optimisticTalent] : [optimisticTalent],
      revalidate: false, // Don't revalidate immediately
    };

    try {
      // Use mutate to update the cache and trigger revalidation in the background
      const newTalent = await mutate('/api/talents', async () => {
        const response = await fetch("/api/talents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Request failed with status ${response.status}`);
        }
        const result = await response.json();
        return talents ? [...talents, result] : [result]; // Update local data with the new talent
      }, options);

      toast({
        title: "Success",
        description: "Talent created successfully",
      });

      return newTalent;
    } catch (err) {
      // Rollback optimistic update on error
      mutate('/api/talents', talents, false); // Revert to previous data without revalidation

      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: "Failed to create talent. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTalent = async (id: string, data: Partial<TalentFormData>) => {
    // Optimistic update
    const originalTalents = talents; // Store original data for rollback
    const updatedTalents = originalTalents?.map(talent =>
      talent.id === id ? { ...talent, ...data, updatedAt: new Date() } : talent
    );

    const options = {
      optimisticData: updatedTalents,
      revalidate: false,
    };

    try {
      const updatedTalent = await mutate(`/api/talents/${id}`, async () => {
        const response = await fetch(`/api/talents/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Request failed with status ${response.status}`);
        }
        const result = await response.json();
        return originalTalents?.map(talent => // Update local data with the updated talent
          talent.id === id ? result : talent
        );
      }, options);

      toast({
        title: "Success",
        description: "Talent updated successfully",
      });

      return updatedTalent;
    } catch (err) {
      // Rollback on error
      mutate('/api/talents', originalTalents, false); // Revert to previous data without revalidation

      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: "Failed to update talent. Changes have been reverted.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTalent = async (id: string) => {
    // Optimistic update
    const originalTalents = talents; // Store original data for rollback
    const filteredTalents = originalTalents?.filter(talent => talent.id !== id);

    const options = {
      optimisticData: filteredTalents,
      revalidate: false,
    };

    try {
      await mutate(`/api/talents/${id}`, async () => {
        const response = await fetch(`/api/talents/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Request failed with status ${response.status}`);
        }
        return filteredTalents; // Update local data after deletion
      }, options);

      toast({
        title: "Success",
        description: "Talent deleted successfully",
      });

      return true;
    } catch (err) {
      // Rollback on error
      mutate('/api/talents', originalTalents, false); // Revert to previous data without revalidation

      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: "Failed to delete talent. Changes have been reverted.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    talents: talents || [], // Provide empty array if data is not yet loaded
    loading,
    error,
    fetchTalents: () => mutate('/api/talents'), // Expose mutate for manual revalidation if needed
    createTalent,
    updateTalent,
    deleteTalent,
  };
} 