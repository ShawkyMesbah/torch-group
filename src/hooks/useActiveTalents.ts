"use client";

import useSWR from "swr";
import { Talent } from '@prisma/client';

export function useActiveTalents() {
  const { data: talents, error, isLoading } = useSWR<Talent[]>(
    "/api/talents/active",
    (url: string) => fetch(url).then((res) => res.json())
  );

  return {
    talents: talents || [],
    loading: isLoading,
    error,
  };
} 