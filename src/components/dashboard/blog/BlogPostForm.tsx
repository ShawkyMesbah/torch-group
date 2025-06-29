'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Editor } from "@/components/ui/editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags: string[];
  category: string | null;
  isPublished: boolean;
}

interface BlogPostFormProps {
  initialData?: Partial<BlogPostFormData>;
  postId?: string;
}

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().nullable(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().nullable(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
  category: z.string().nullable()
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export function BlogPostForm({ initialData, postId }: BlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || null,
      content: initialData?.content || '',
      coverImage: initialData?.coverImage || null,
      isPublished: initialData?.isPublished || false,
      tags: initialData?.tags || [],
      category: initialData?.category || null
    }
  });

  const isPublished = watch('isPublished');

  const onSubmit: SubmitHandler<BlogPostFormData> = async (data) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/blog' + (postId ? `/${postId}` : ''), {
        method: postId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      toast({
        title: 'Success',
        description: `Blog post ${postId ? 'updated' : 'created'} successfully.`,
      });

      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Failed to save blog post:', error);
      toast({
        title: 'Error',
        description: `Failed to ${postId ? 'update' : 'create'} blog post. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title')}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register('slug')}
            className={errors.slug ? 'border-red-500' : ''}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            {...register('excerpt')}
            className={errors.excerpt ? 'border-red-500' : ''}
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...register('content')}
            rows={10}
            className={errors.content ? 'border-red-500' : ''}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            {...register('coverImage')}
            className={errors.coverImage ? 'border-red-500' : ''}
          />
          {errors.coverImage && (
            <p className="mt-1 text-sm text-red-500">{errors.coverImage.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...register('category')}
            className={errors.category ? 'border-red-500' : ''}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isPublished"
            checked={isPublished}
            onCheckedChange={(checked) => setValue('isPublished', checked)}
          />
          <Label htmlFor="isPublished">Publish post</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/blog')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
} 