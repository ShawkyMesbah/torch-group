"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/ui/file-upload";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
}

export function BlogEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPost((prev) => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  };

  const handleImageUpload = (url: string) => {
    setPost((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      router.push("/dashboard/blog");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={post.title}
          onChange={handleTitleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={post.slug}
          onChange={(e) => setPost((prev) => ({ ...prev, slug: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={post.excerpt}
          onChange={(e) =>
            setPost((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={post.content}
          onChange={(e) =>
            setPost((prev) => ({ ...prev, content: e.target.value }))
          }
          required
          disabled={isLoading}
          className="min-h-[300px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <FileUpload
          endpoint="blogImage"
          onUploadComplete={(res) => {
            handleImageUpload(res[0].url);
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          checked={post.published}
          onChange={(e) =>
            setPost((prev) => ({ ...prev, published: e.target.checked }))
          }
          disabled={isLoading}
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
} 