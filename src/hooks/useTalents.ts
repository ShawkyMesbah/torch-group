"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Talent, TalentCategory, TalentStatus } from "@/generated/prisma";

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

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Helper to handle API request with retries
  const fetchWithRetry = useCallback(async (
    url: string, 
    options?: RequestInit, 
    retries = MAX_RETRIES
  ): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
      
      return response;
    } catch (err) {
      if (retries <= 0) throw err;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
  }, []);

  const fetchTalents = useCallback(async (skipLoadingState = false) => {
    if (!skipLoadingState) setLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const response = await fetchWithRetry("/api/talents");
      const data = await response.json();
      setTalents(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load talents. Retrying...",
        variant: "destructive",
      });
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
      
      // Auto-retry up to MAX_RETRIES if not manually triggered
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => fetchTalents(true), RETRY_DELAY);
      }
      
      return null;
    } finally {
      if (!skipLoadingState) setLoading(false);
    }
  }, [fetchWithRetry, retryCount]);

  const createTalent = async (data: TalentFormData) => {
    setLoading(true);
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticTalent = {
      id: tempId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Talent;
    
    setTalents(prev => [...prev, optimisticTalent]);
    
    try {
      const response = await fetchWithRetry("/api/talents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const newTalent = await response.json();
      
      // Replace the optimistic talent with the real one
      setTalents(prev => prev.map(t => 
        t.id === tempId ? newTalent : t
      ));
      
      toast({
        title: "Success",
        description: "Talent created successfully",
      });
      
      return newTalent;
    } catch (err) {
      // Remove the optimistic talent on error
      setTalents(prev => prev.filter(t => t.id !== tempId));
      
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to create talent. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTalent = async (id: string, data: Partial<TalentFormData>) => {
    setLoading(true);
    
    // Save current state for rollback
    const originalTalents = [...talents];
    
    // Optimistic update
    const updatedTalents = talents.map(talent => 
      talent.id === id ? { ...talent, ...data, updatedAt: new Date() } : talent
    );
    
    setTalents(updatedTalents);
    
    try {
      const response = await fetchWithRetry(`/api/talents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const updatedTalent = await response.json();
      
      // Update with the server response
      setTalents(prev => prev.map(talent => 
        talent.id === id ? updatedTalent : talent
      ));
      
      toast({
        title: "Success",
        description: "Talent updated successfully",
      });
      
      return updatedTalent;
    } catch (err) {
      // Rollback on error
      setTalents(originalTalents);
      
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to update talent. Changes have been reverted.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalent = async (id: string) => {
    setLoading(true);
    
    // Save current state for rollback
    const originalTalents = [...talents];
    
    // Optimistic update
    setTalents(talents.filter(talent => talent.id !== id));
    
    try {
      await fetchWithRetry(`/api/talents/${id}`, {
        method: "DELETE",
      });
      
      toast({
        title: "Success",
        description: "Talent deleted successfully",
      });
      
      return true;
    } catch (err) {
      // Rollback on error
      setTalents(originalTalents);
      
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to delete talent. Changes have been reverted.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    talents,
    loading,
    error,
    retryCount,
    fetchTalents,
    createTalent,
    updateTalent,
    deleteTalent,
  };
} 