"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseAPIOptions<T> {
  url: string;
  initialData?: T | null;
  fetchOnMount?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  maxRetries?: number;
  retryDelay?: number;
}

interface APIResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  fetch: (skipLoadingState?: boolean) => Promise<T | null>;
  create: <P>(payload: P) => Promise<any>;
  update: <P>(id: string, payload: P) => Promise<any>;
  remove: (id: string) => Promise<boolean>;
  mutate: (newData: T) => void;
}

export function useAPI<T>({
  url,
  initialData = null,
  fetchOnMount = true,
  onSuccess,
  onError,
  maxRetries = 3,
  retryDelay = 1000,
}: UseAPIOptions<T>): APIResponse<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Helper to handle API request with retries
  const fetchWithRetry = useCallback(
    async (
      endpoint: string,
      options?: RequestInit,
      retries = maxRetries
    ): Promise<Response> => {
      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || `Request failed with status ${response.status}`
          );
        }

        return response;
      } catch (err) {
        if (retries <= 0) throw err;

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return fetchWithRetry(endpoint, options, retries - 1);
      }
    },
    [maxRetries, retryDelay]
  );

  // Fetch data
  const fetchData = useCallback(
    async (skipLoadingState = false): Promise<T | null> => {
      if (!skipLoadingState) setLoading(true);
      setError(null);
      
      try {
        const response = await fetchWithRetry(url);
        const result = await response.json();
        setData(result);
        onSuccess?.(result);
        setRetryCount(0);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
        
        // Increment retry count
        setRetryCount((prev) => {
          const newCount = prev + 1;
          
          // Auto-retry if we haven't exceeded the maximum retries
          if (newCount <= maxRetries) {
            setTimeout(() => fetchData(true), retryDelay);
          }
          
          return newCount;
        });
        
        toast({
          title: "Error",
          description: `Failed to load data. ${retryCount < maxRetries ? "Retrying..." : ""}`,
          variant: "destructive",
        });
        
        return null;
      } finally {
        if (!skipLoadingState) setLoading(false);
      }
    },
    [fetchWithRetry, url, onSuccess, onError, retryCount, maxRetries, retryDelay]
  );

  // Create new item
  const createItem = async <P>(payload: P): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const newItem = await response.json();
      
      // Update local data if it's an array
      if (Array.isArray(data)) {
        setData([...data, newItem] as unknown as T);
      }
      
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      
      return newItem;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update item
  const updateItem = async <P>(id: string, payload: P): Promise<any> => {
    setLoading(true);
    
    // Save original data for rollback
    const originalData = data;
    
    // Optimistically update if data is an array
    if (Array.isArray(data)) {
      const updatedItems = data.map((item: any) =>
        item.id === id ? { ...item, ...payload } : item
      ) as unknown as T;
      
      setData(updatedItems);
    }
    
    try {
      const response = await fetchWithRetry(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const updatedItem = await response.json();
      
      // Update with server response if data is an array
      if (Array.isArray(data)) {
        setData(
          data.map((item: any) =>
            item.id === id ? updatedItem : item
          ) as unknown as T
        );
      }
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      return updatedItem;
    } catch (err) {
      // Rollback on error
      setData(originalData);
      
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to update item. Changes have been reverted.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    
    // Save original data for rollback
    const originalData = data;
    
    // Optimistically update if data is an array
    if (Array.isArray(data)) {
      setData(data.filter((item: any) => item.id !== id) as unknown as T);
    }
    
    try {
      await fetchWithRetry(`${url}/${id}`, {
        method: "DELETE",
      });
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      return true;
    } catch (err) {
      // Rollback on error
      setData(originalData);
      
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to delete item. Changes have been reverted.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Manually update the data
  const mutate = (newData: T) => {
    setData(newData);
  };

  // Fetch on mount if needed
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchOnMount, fetchData]);

  return {
    data,
    loading,
    error,
    retryCount,
    fetch: fetchData,
    create: createItem,
    update: updateItem,
    remove: deleteItem,
    mutate,
  };
} 