import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/dashboard/blog/BlogPostForm";

export const metadata: Metadata = {
  title: "Edit Blog Post | Torch Admin",
  description: "Edit an existing blog post",
};

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

async function getBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await getBlogPost(params.id);

  return (
    <div className="space-y-comfortable">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Edit Blog Post
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Edit and update your blog post
        </p>
      </div>

      <BlogPostForm post={post} />
    </div>
  );
} 