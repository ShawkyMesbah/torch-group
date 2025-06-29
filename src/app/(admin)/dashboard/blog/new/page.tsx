import { BlogPostForm } from '@/components/dashboard/blog/BlogPostForm';

export const metadata = {
  title: 'New Blog Post | Torch Group Admin',
  description: 'Create a new blog post',
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-comfortable">
      <div>
        <h1 className="text-2xl font-semibold text-torch-text">New Blog Post</h1>
        <p className="mt-1 text-sm text-torch-text-light">
          Create a new blog post.
        </p>
      </div>

      <BlogPostForm />
    </div>
  );
} 