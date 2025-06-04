"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { BlogPost } from '@prisma/client';

type BlogPostFormData = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
};

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (publishedOnly?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const url = publishedOnly 
        ? "/api/blog?published=true" 
        : "/api/blog";
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const data = await response.json();
      setPosts(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPostBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }

      const data = await response.json();
      setCurrentPost(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: BlogPostFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      
      toast({
        title: "Success",
        description: `Post "${newPost.title}" created successfully`,
      });
      
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (slug: string, data: Partial<BlogPostFormData>) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog post");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.slug === slug ? updatedPost : post
      ));
      
      // Update currentPost if it's the one being edited
      if (currentPost?.slug === slug) {
        setCurrentPost(updatedPost);
      }
      
      toast({
        title: "Success",
        description: `Post "${updatedPost.title}" updated successfully`,
      });
      
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (slug: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      setPosts(posts.filter(post => post.slug !== slug));
      
      // Clear currentPost if it's the one being deleted
      if (currentPost?.slug === slug) {
        setCurrentPost(null);
      }
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const publishPost = async (slug: string, isPublished: boolean) => {
    return await updatePost(slug, { isPublished });
  };

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
    publishPost,
  };
} 