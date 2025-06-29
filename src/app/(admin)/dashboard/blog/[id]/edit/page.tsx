import { notFound } from 'next/navigation';
import { BlogPostForm } from '@/components/dashboard/blog/BlogPostForm';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Edit Blog Post | Torch Group Admin',
  description: 'Edit an existing blog post',
};

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      isPublished: true,
      tags: true,
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-comfortable">
      <div>
        <h1 className="text-2xl font-semibold text-torch-text">Edit Blog Post</h1>
        <p className="mt-1 text-sm text-torch-text-light">
          Edit an existing blog post.
        </p>
      </div>

      <BlogPostForm initialData={post} postId={post.id} />
    </div>
  );
} 