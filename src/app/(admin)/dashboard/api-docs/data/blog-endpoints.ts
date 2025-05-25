import { ApiEndpointType } from "../components/endpoint-list";

export const blogEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/blog',
    description: 'Fetch all blog posts. Can filter by published status and limit results.',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: [
      {
        id: "post_1",
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        excerpt: "A beginner's guide to Next.js framework",
        content: "Next.js is a React framework that enables functionality such as server-side rendering and static site generation...",
        coverImage: "https://example.com/nextjs-cover.jpg",
        isPublished: true,
        publishedAt: "2023-01-01T00:00:00.000Z",
        author: {
          id: "user_1",
          name: "John Doe",
          email: "john@example.com",
          image: "https://example.com/avatar1.jpg"
        },
        createdAt: "2022-12-28T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
      },
      {
        id: "post_2",
        title: "Advanced React Patterns",
        slug: "advanced-react-patterns",
        excerpt: "Learn about compound components, render props, and more",
        content: "This article explores advanced patterns in React development...",
        coverImage: "https://example.com/react-patterns.jpg",
        isPublished: true,
        publishedAt: "2023-01-05T00:00:00.000Z",
        author: {
          id: "user_2",
          name: "Jane Smith",
          email: "jane@example.com",
          image: "https://example.com/avatar2.jpg"
        },
        createdAt: "2023-01-02T00:00:00.000Z",
        updatedAt: "2023-01-05T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/blog/[slug]',
    description: 'Fetch a specific blog post by slug',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      id: "post_1",
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      excerpt: "A beginner's guide to Next.js framework",
      content: "Next.js is a React framework that enables functionality such as server-side rendering and static site generation...",
      coverImage: "https://example.com/nextjs-cover.jpg",
      isPublished: true,
      publishedAt: "2023-01-01T00:00:00.000Z",
      author: {
        id: "user_1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/avatar1.jpg"
      },
      createdAt: "2022-12-28T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/blog',
    description: 'Create a new blog post',
    authorization: 'Staff or Admin',
    requestBody: {
      title: "New Blog Post",
      slug: "new-blog-post",
      excerpt: "This is a summary of the new blog post",
      content: "This is the full content of the blog post with detailed information...",
      coverImage: "https://example.com/new-post.jpg",
      isPublished: false
    },
    responseExample: {
      id: "post_3",
      title: "New Blog Post",
      slug: "new-blog-post",
      excerpt: "This is a summary of the new blog post",
      content: "This is the full content of the blog post with detailed information...",
      coverImage: "https://example.com/new-post.jpg",
      isPublished: false,
      publishedAt: null,
      authorId: "user_1",
      createdAt: "2023-01-10T00:00:00.000Z",
      updatedAt: "2023-01-10T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/blog/[slug]',
    description: 'Update an existing blog post',
    authorization: 'Staff or Admin (author or admin role)',
    requestBody: {
      title: "Updated Blog Post",
      excerpt: "This is an updated summary",
      content: "This is the updated content of the blog post...",
      coverImage: "https://example.com/updated-cover.jpg",
      isPublished: true
    },
    responseExample: {
      id: "post_1",
      title: "Updated Blog Post",
      slug: "getting-started-with-nextjs",
      excerpt: "This is an updated summary",
      content: "This is the updated content of the blog post...",
      coverImage: "https://example.com/updated-cover.jpg",
      isPublished: true,
      publishedAt: "2023-01-15T00:00:00.000Z",
      authorId: "user_1",
      createdAt: "2022-12-28T00:00:00.000Z",
      updatedAt: "2023-01-15T00:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/blog/[slug]',
    description: 'Delete a blog post',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "Blog post deleted successfully"
    }
  },
  {
    method: 'GET',
    path: '/api/blog/count',
    description: 'Get total count of blog posts',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      count: 24
    }
  }
]; 