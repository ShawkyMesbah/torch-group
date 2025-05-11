"use client";

import { useState } from "react";
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

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTalents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/talents");
      
      if (!response.ok) {
        throw new Error("Failed to fetch talents");
      }

      const data = await response.json();
      setTalents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load talents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTalent = async (data: TalentFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/talents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create talent");
      }

      const newTalent = await response.json();
      setTalents([...talents, newTalent]);
      
      toast({
        title: "Success",
        description: "Talent created successfully",
      });
      
      return newTalent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to create talent",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTalent = async (id: string, data: Partial<TalentFormData>) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/talents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update talent");
      }

      const updatedTalent = await response.json();
      setTalents(talents.map(talent => 
        talent.id === id ? updatedTalent : talent
      ));
      
      toast({
        title: "Success",
        description: "Talent updated successfully",
      });
      
      return updatedTalent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update talent",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTalent = async (id: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/talents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete talent");
      }

      setTalents(talents.filter(talent => talent.id !== id));
      
      toast({
        title: "Success",
        description: "Talent deleted successfully",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to delete talent",
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
    fetchTalents,
    createTalent,
    updateTalent,
    deleteTalent,
  };
} 