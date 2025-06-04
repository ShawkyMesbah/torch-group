import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if we're in a Node.js environment
const isServer = typeof window === 'undefined';

// Function to create a mock client for browser or when DATABASE_URL is missing
const createMockClient = () => {
  console.warn(
    "Using mock Prisma client. This is expected in browser environments or when DATABASE_URL is not configured."
  );
  
  // Create a mock implementation that simulates database operations
  // This allows the app to function without a real database connection
  const mockClient = {
    $connect: async () => Promise.resolve(),
    $disconnect: async () => Promise.resolve(),
    $queryRaw: async () => Promise.resolve([{ result: 1 }]),
    $executeRaw: async () => Promise.resolve(1),
    
    // Mock user operations
    user: {
      findUnique: async () => Promise.resolve({
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findMany: async () => Promise.resolve([
        {
          id: 'mock-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]),
      create: async (data) => Promise.resolve({
        id: 'mock-user-id',
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async (data) => Promise.resolve({
        id: data.where.id || 'mock-user-id',
        ...data.data,
        updatedAt: new Date(),
      }),
      delete: async () => Promise.resolve(true),
      count: async () => Promise.resolve(5),
    },
    
    // Mock analyticsEvent operations
    analyticsEvent: {
      create: async (data) => Promise.resolve({
        id: `mock-event-${Date.now()}`,
        ...data.data,
        createdAt: new Date(),
      }),
      findMany: async () => Promise.resolve([
        {
          id: 'mock-event-1',
          type: 'PAGE_VIEW',
          meta: {},
          createdAt: new Date(),
        }
      ]),
      count: async () => Promise.resolve(10),
    },
    
    // Mock contactMessage operations
    contactMessage: {
      create: async (data) => Promise.resolve({
        id: `mock-message-${Date.now()}`,
        ...data.data,
        createdAt: new Date(),
      }),
      findMany: async () => Promise.resolve([
        {
          id: 'mock-message-1',
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Test Message',
          message: 'This is a test message',
          attachment: null,
          isRead: false,
          createdAt: new Date(),
        }
      ]),
      count: async () => Promise.resolve(3),
    },
    
    // Mock blog post operations
    blogPost: {
      findMany: async (query) => {
        // Create base blog post
        const mockPost = {
          id: 'mock-blog-1',
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          excerpt: 'This is a test blog post excerpt',
          content: 'This is the full content of the test blog post. It contains detailed information about testing.',
          coverImage: null,
          authorId: 'mock-user-id',
          isPublished: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Check if author should be included
        const includeAuthor = query?.include?.author;
        
        // If author is included, add it to the response
        if (includeAuthor) {
          return Promise.resolve([{
            ...mockPost,
            author: {
              id: 'mock-user-id',
              name: 'Test User',
              email: 'test@example.com',
              image: null
            }
          }]);
        }
        
        return Promise.resolve([mockPost]);
      },
      findUnique: async (query) => {
        return Promise.resolve({
          id: 'mock-blog-1',
          title: 'Test Blog Post', 
          slug: query?.where?.slug || 'test-blog-post',
          excerpt: 'This is a test blog post excerpt',
          content: 'This is the full content of the test blog post. It contains detailed information about testing.',
          coverImage: null,
          authorId: 'mock-user-id',
          isPublished: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      },
      create: async (query) => Promise.resolve({
        id: `mock-blog-${Date.now()}`,
        ...query.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      count: async () => Promise.resolve(12),
    },
    
    // Mock talent operations
    talent: {
      findMany: async () => Promise.resolve([
        {
          id: 'mock-talent-1',
          name: 'Jane Doe',
          role: 'Designer',
          category: 'DESIGN',
          bio: 'Experienced designer with a passion for UI/UX',
          imageUrl: null,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]),
      count: async () => Promise.resolve(8),
    },
  };
  
  return mockClient as unknown as PrismaClient;
};

// Logic to get or create a Prisma client
const getPrismaClient = () => {
  // Always return a mock for client-side
  if (!isServer) {
    return createMockClient();
  }

  // For server-side, reuse client if it exists in global scope
  if (global.prisma) {
    return global.prisma;
  }

  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
    console.warn("⚠️ DATABASE_URL is not defined, using mock database client");
    const mockClient = createMockClient();
    
    // Cache it in development to avoid repeated warnings
    if (process.env.NODE_ENV !== "production") {
      global.prisma = mockClient;
    }
    
    return mockClient;
  }

  try {
    console.log("🔌 Initializing Prisma client with database connection");
    // Create a new client
    const client = new PrismaClient({
      log: ['error', 'warn'],
    });
    
    // Test the connection
    client.$connect()
      .then(() => console.log("✅ Database connection established successfully"))
      .catch(error => {
        console.error("❌ Failed to connect to database:", error);
        console.warn("⚠️ Falling back to mock database client");
        global.prisma = createMockClient();
      });
    
    // Cache it in development
    if (process.env.NODE_ENV !== "production") {
      global.prisma = client;
    }
    
    return client;
  } catch (error) {
    console.error("❌ Failed to create Prisma client:", error);
    console.warn("⚠️ Falling back to mock database client");
    const mockClient = createMockClient();
    
    if (process.env.NODE_ENV !== "production") {
      global.prisma = mockClient;
    }
    
    return mockClient;
  }
};

export const prisma = getPrismaClient();
export default prisma; 