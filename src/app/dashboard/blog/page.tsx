import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogPostList } from "@/components/dashboard/blog/BlogPostList";
import { BlogHeader } from "@/components/dashboard/blog/BlogHeader";

export const metadata: Metadata = {
  title: "Blog Posts | Torch Admin",
  description: "Manage your blog posts and articles",
};

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return posts;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-comfortable">
      <BlogHeader />
      <BlogPostList initialPosts={posts} />
    </div>
  );
} 