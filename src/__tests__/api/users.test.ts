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

jest.mock('@prisma/client', () => {
  (globalThis as any).mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => (globalThis as any).mockPrisma) };
});

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }));
const { auth } = require('@/lib/auth');

jest.mock('@/lib/authorization', () => ({ isAuthorized: jest.fn() }));
const { isAuthorized } = require('@/lib/authorization');

jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
const { hash } = require('bcryptjs');

import { GET, POST } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

function createMockRequest(method: string, body?: any) {
  if (body) {
    const req = new NextRequest(new Request('http://localhost/api/users', {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }));
    req.json = async () => body;
    return req;
  }
  return new NextRequest(new Request('http://localhost/api/users', { method }));
}

describe('/api/users route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      auth.mockResolvedValue(null);
      const req = createMockRequest('GET');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it('returns 403 if not admin', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'STAFF' } });
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('GET');
      const res = await GET(req);
      expect(res.status).toBe(403);
    });

    it('returns 200 and user list if admin', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      const users = [{ id: '1', name: 'Test', email: 'test@example.com', role: 'ADMIN', image: null, createdAt: new Date(), updatedAt: new Date() }];
      (globalThis as any).mockPrisma.user.findMany.mockResolvedValue(users);
      const req = createMockRequest('GET');
      const res = await GET(req);
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json)).toBe(true);
      expect(json[0].email).toBe('test@example.com');
    });

    it('returns 500 on DB error', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findMany.mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('GET');
      const res = await GET(req);
      expect(res.status).toBe(500);
    });
  });

  describe('POST', () => {
    const validBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'ADMIN',
    };

    it('returns 401 if not authenticated', async () => {
      auth.mockResolvedValue(null);
      const req = createMockRequest('POST', validBody);
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 403 if not admin', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'STAFF' } });
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('POST', validBody);
      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid input', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      const req = createMockRequest('POST', { ...validBody, email: 'not-an-email' });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it('returns 409 if email already exists', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue({ id: '2', email: validBody.email });
      const req = createMockRequest('POST', validBody);
      const res = await POST(req);
      expect(res.status).toBe(409);
    });

    it('returns 201 and user data if successful', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(null);
      hash.mockResolvedValue('hashed-password');
      const createdUser = { ...validBody, id: '3', password: undefined, createdAt: new Date(), updatedAt: new Date() };
      (globalThis as any).mockPrisma.user.create.mockResolvedValue(createdUser);
      const req = createMockRequest('POST', validBody);
      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.email).toBe(validBody.email);
      expect(json.id).toBe('3');
    });

    it('returns 500 on DB error', async () => {
      auth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('POST', validBody);
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });
}); 