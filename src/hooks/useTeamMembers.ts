"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "@/components/ui/use-toast";

type SocialLinks = Record<string, string>;

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  socialLinks: SocialLinks;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type TeamMemberFormData = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  socialLinks?: SocialLinks;
  isPublished: boolean;
};

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch team members");
  return res.json();
});

export function useTeamMembers() {
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SWR for the main team members list
  const {
    data: members = [],
    isLoading,
    mutate
  } = useSWR<TeamMember[]>("/api/team", fetcher, { revalidateOnFocus: false });

  // Fetch all members (optionally published only)
  const fetchMembers = async (publishedOnly?: boolean) => {
    try {
      const url = publishedOnly ? "/api/team?published=true" : "/api/team";
      await mutate(async () => fetcher(url), true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  // Fetch a single member by ID (not cached)
  const fetchMemberById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/team/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch team member");
      }
      const data = await response.json();
      setCurrentMember(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load team member",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new member
  const createMember = async (data: TeamMemberFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team member");
      }
      const newMember = await response.json();
      await mutate(); // revalidate list
      toast({
        title: "Success",
        description: `Team member "${newMember.name}" created successfully`,
      });
      return newMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to create team member",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a member
  const updateMember = async (id: string, data: Partial<TeamMemberFormData>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update team member");
      }
      const updatedMember = await response.json();
      await mutate(); // revalidate list
      if (currentMember?.id === id) {
        setCurrentMember(updatedMember);
      }
      toast({
        title: "Success",
        description: `Team member "${updatedMember.name}" updated successfully`,
      });
      return updatedMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a member
  const deleteMember = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }
      await mutate(); // revalidate list
      if (currentMember?.id === id) {
        setCurrentMember(null);
      }
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle publish status
  const togglePublishStatus = async (id: string, isPublished: boolean) => {
    return updateMember(id, { isPublished });
  };

  return {
    members,
    currentMember,
    loading: isLoading || loading,
    error,
    fetchMembers,
    fetchMemberById,
    createMember,
    updateMember,
    deleteMember,
    togglePublishStatus,
  };
} 