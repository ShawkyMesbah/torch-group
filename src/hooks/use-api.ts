import useSWR from 'swr';
import { toast } from '@/components/ui/use-toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.message = await res.text();
    throw error;
  }
  return res.json();
};

interface UseApiOptions {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  shouldRetryOnError?: boolean;
  retryCount?: number;
  dedupingInterval?: number;
}

export function useApi<T>(
  url: string | null,
  options: UseApiOptions = {}
) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR<T>(
    url,
    fetcher,
    {
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      revalidateOnReconnect: options.revalidateOnReconnect ?? true,
      refreshInterval: options.refreshInterval ?? 0,
      shouldRetryOnError: options.shouldRetryOnError ?? true,
      retryCount: options.retryCount ?? 3,
      dedupingInterval: options.dedupingInterval ?? 2000,
      onError: (err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    isEmpty: !isLoading && !data,
  };
}

export function useApiMutation<T>(url: string) {
  const { mutate: globalMutate } = useSWR(url);

  const trigger = async (data?: any, options: { optimisticData?: any; revalidate?: boolean } = {}) => {
    try {
      if (options.optimisticData) {
        await globalMutate(options.optimisticData, false);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      
      if (options.revalidate !== false) {
        await globalMutate();
      }

      toast({
        title: 'Success',
        description: 'Operation completed successfully',
      });

      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    trigger,
  };
} 