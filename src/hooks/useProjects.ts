"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  technologies?: string[];
  demoUrl?: string;
  repoUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectFormData = {
  title: string;
  slug?: string;
  description: string;
  content: string;
  coverImage?: string;
  technologies?: string[];
  demoUrl?: string;
  repoUrl?: string;
  isPublished: boolean;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (publishedOnly?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const url = publishedOnly 
        ? "/api/projects?published=true" 
        : "/api/projects";
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${slug}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await response.json();
      setCurrentProject(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: ProjectFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      
      toast({
        title: "Success",
        description: `Project "${newProject.title}" created successfully`,
      });
      
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (slug: string, data: Partial<ProjectFormData>) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const updatedProject = await response.json();
      setProjects(projects.map(project => 
        project.slug === slug ? updatedProject : project
      ));
      
      // Update currentProject if it's the one being edited
      if (currentProject?.slug === slug) {
        setCurrentProject(updatedProject);
      }
      
      toast({
        title: "Success",
        description: `Project "${updatedProject.title}" updated successfully`,
      });
      
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (slug: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter(project => project.slug !== slug));
      
      // Clear currentProject if it's the one being deleted
      if (currentProject?.slug === slug) {
        setCurrentProject(null);
      }
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const publishProject = async (slug: string, isPublished: boolean) => {
    return await updateProject(slug, { isPublished });
  };
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
    publishProject,
    generateSlug,
  };
} 