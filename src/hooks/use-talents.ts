import useSWR from "swr";

interface Talent {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
  skills?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useTalents() {
  const { data, error, isLoading, mutate } = useSWR<Talent[]>("/api/talents");

  return {
    talents: data,
    isLoading,
    error,
    mutate,
  };
} 