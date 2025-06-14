"use client";

import { useState } from "react";
import { BlogEditor, BlogPost } from "@/components/dashboard/blog/BlogEditor";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function NewBlogPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Function to save a blog post
  const handleSavePost = async (post: BlogPost): Promise<BlogPost | undefined> => {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // For this demo, we'll simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a fake ID for the new post
      const savedPost: BlogPost = {
        ...post,
        id: `post-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      
      toast({
        title: "Post saved",
        description: "Your post has been saved successfully.",
      });
      
      return savedPost;
    } catch (error) {
      console.error("Error saving post:", error);
      
      toast({
        title: "Save failed",
        description: "There was an error saving your post. Please try again.",
        variant: "destructive",
      });
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle post preview
  const handlePreviewPost = (post: BlogPost) => {
    // In a real application, this would navigate to a preview page
    // or open a preview modal
    toast({
      title: "Post Preview",
      description: "Preview functionality would open in a new tab or modal.",
    });
    
    console.log("Preview post:", post);
  };
  
  // Function to publish a blog post
  const handlePublishPost = async (post: BlogPost): Promise<BlogPost | undefined> => {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // For this demo, we'll simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a fake ID for the new post if it doesn't exist
      const publishedPost: BlogPost = {
        ...post,
        id: post.id || `post-${Date.now()}`,
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      toast({
        title: "Post published",
        description: "Your post has been published successfully.",
      });
      
      // In a real application, we might redirect to the post detail page
      // router.push(`/dashboard/blog/${publishedPost.id}`);
      
      return publishedPost;
    } catch (error) {
      console.error("Error publishing post:", error);
      
      toast({
        title: "Publish failed",
        description: "There was an error publishing your post. Please try again.",
        variant: "destructive",
      });
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12">
      <BlogEditor 
        onSave={handleSavePost}
        onPreview={handlePreviewPost}
        onPublish={handlePublishPost}
        isLoading={isLoading}
      />
    </div>
  );
} 