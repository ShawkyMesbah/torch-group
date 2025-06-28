"use client";

import useSWR from "swr";
import { Talent } from '@prisma/client';

// Enhanced fetcher with proper error handling
const fetcher = async (url: string): Promise<Talent[]> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching active talents:', error);
    // Return empty array instead of throwing to prevent unhandled rejections
    return [];
  }
};

export function useActiveTalents() {
  const { data: talents, error, isLoading } = useSWR<Talent[]>(
    "/api/talents/active",
    fetcher,
    {
      // SWR configuration to handle errors gracefully
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      onError: (error) => {
        console.error('SWR error in useActiveTalents:', error);
      }
    }
  );

  return {
    talents: talents || [],
    loading: isLoading,
    error,
  };
} 