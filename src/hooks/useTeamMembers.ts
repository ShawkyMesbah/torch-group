"use client";

import { useState } from "react";
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

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async (publishedOnly?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const url = publishedOnly 
        ? "/api/team?published=true" 
        : "/api/team";
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }

      const data = await response.json();
      setMembers(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

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

  const createMember = async (data: TeamMemberFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team member");
      }

      const newMember = await response.json();
      setMembers([newMember, ...members]);
      
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

  const updateMember = async (id: string, data: Partial<TeamMemberFormData>) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update team member");
      }

      const updatedMember = await response.json();
      setMembers(members.map(member => 
        member.id === id ? updatedMember : member
      ));
      
      // Update currentMember if it's the one being edited
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

  const deleteMember = async (id: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      setMembers(members.filter(member => member.id !== id));
      
      // Clear currentMember if it's the one being deleted
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
  
  const togglePublishStatus = async (id: string, isPublished: boolean) => {
    return await updateMember(id, { isPublished });
  };

  return {
    members,
    currentMember,
    loading,
    error,
    fetchMembers,
    fetchMemberById,
    createMember,
    updateMember,
    deleteMember,
    togglePublishStatus,
  };
} 