"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Talent } from "@/generated/prisma";

export function useActiveTalents() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveTalents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/talents/active");
      
      if (!response.ok) {
        throw new Error("Failed to fetch active talents");
      }

      const data = await response.json();
      setTalents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      console.error("Error fetching active talents:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    talents,
    loading,
    error,
    fetchActiveTalents
  };
} 