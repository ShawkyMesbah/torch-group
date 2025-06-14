// Mock NextResponse for Jest (must be first)
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: class {
      body: any;
      status: number;
      constructor(body: any, init?: any) {
        this.body = body;
        this.status = (init && init.status) || 200;
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
      static json(data: any, init?: any) {
        return {
          status: (init && init.status) || 200,
          json: async () => data,
        };
      }
    },
  };
});

// Add this at the top of the file for type safety
declare global {
  // eslint-disable-next-line no-var
  var mockPrisma: {
    contactMessage: {
      create: jest.Mock;
      findMany: jest.Mock;
    };
    $disconnect: jest.Mock;
  };
}

jest.mock('@prisma/client', () => {
  (globalThis as any).mockPrisma = {
    contactMessage: {
      create: jest.fn(async (data) => ({ id: 'test-id', ...data.data })),
      findMany: jest.fn(async () => [{ id: 'test-id', name: 'Test', email: 'test@example.com', subject: 'Test', message: 'Test message', isRead: false, createdAt: new Date(), updatedAt: new Date() }]),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => (globalThis as any).mockPrisma) };
});

import { POST, GET } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/email', () => ({
  sendContactFormNotification: jest.fn(() => Promise.resolve()),
  sendContactFormConfirmation: jest.fn(() => Promise.resolve()),
}));

describe('/api/contact route', () => {
  afterEach(() => {
    jest.clearAllMocks();
    // Reset mockPrisma mocks
    (globalThis as any).mockPrisma.contactMessage.create.mockReset();
    (globalThis as any).mockPrisma.contactMessage.findMany.mockReset();
    (globalThis as any).mockPrisma.$disconnect.mockReset();
  });

  describe('POST', () => {
    const validBody = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a valid message.',
    };

    it('should return 201 for valid data', async () => {
      const req = new NextRequest(new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify(validBody),
        headers: { 'Content-Type': 'application/json' },
      }));
      req.json = async () => validBody;
      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json).toHaveProperty('id');
      expect(json.message).toMatch(/success/i);
    });

    it('should return 400 for invalid data', async () => {
      const req = new NextRequest(new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...validBody, email: 'bad' }),
        headers: { 'Content-Type': 'application/json' },
      }));
      req.json = async () => ({ ...validBody, email: 'bad' });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toMatch(/validation/i);
      expect(json.errors).toBeDefined();
    });

    it('should handle DB errors gracefully', async () => {
      (globalThis as any).mockPrisma.contactMessage.create.mockRejectedValueOnce(new Error('DB error'));
      const req = new NextRequest(new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify(validBody),
        headers: { 'Content-Type': 'application/json' },
      }));
      req.json = async () => validBody;
      const res = await POST(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.message).toMatch(/internal/i);
    });
  });

  describe('GET', () => {
    function createMockRequestWithSearchParams(params = '') {
      const req = new NextRequest(new Request('http://localhost/api/contact' + (params ? `?${params}` : ''), { method: 'GET' }));
      Object.defineProperty(req, 'nextUrl', {
        value: { searchParams: new URLSearchParams(params) },
        configurable: true,
      });
      return req;
    }

    beforeEach(() => {
      // Ensure the mock always returns an array for GET tests
      (globalThis as any).mockPrisma.contactMessage.findMany.mockResolvedValue([
        {
          id: 'test-id',
          name: 'Test',
          email: 'test@example.com',
          subject: 'Test',
          message: 'Test message',
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });

    it('should return messages (default)', async () => {
      const req = createMockRequestWithSearchParams();
      const res = await GET(req);
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json)).toBe(true);
    });

    it('should filter by isRead param', async () => {
      const req = createMockRequestWithSearchParams('isRead=true');
      const res = await GET(req);
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json)).toBe(true);
    });

    it('should handle DB errors and return mock data', async () => {
      (globalThis as any).mockPrisma.contactMessage.findMany.mockRejectedValue(new Error('DB error'));
      const req = createMockRequestWithSearchParams();
      const res = await GET(req);
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json)).toBe(true);
    });
  });
}); 