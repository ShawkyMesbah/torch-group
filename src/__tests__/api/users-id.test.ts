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
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

import { GET, PATCH, DELETE } from '@/app/api/users/[id]/route';
import { NextRequest } from 'next/server';

function createMockRequest(method: string, body?: any) {
  if (body) {
    const req = new NextRequest(new Request('http://localhost/api/users/123', {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }));
    req.json = async () => body;
    return req;
  }
  return new NextRequest(new Request('http://localhost/api/users/123', { method }));
}

describe('/api/users/[id] route', () => {
  const params = { id: '123' };
  const adminSession = { user: { id: 'admin', role: 'ADMIN' } };
  const selfSession = { user: { id: '123', role: 'STAFF' } };
  const otherSession = { user: { id: '456', role: 'STAFF' } };
  const userObj = { id: '123', name: 'Test', email: 'test@example.com', role: 'STAFF', image: null, createdAt: new Date(), updatedAt: new Date() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      auth.mockResolvedValue(null);
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status).toBe(401);
    });
    it('returns 403 if not self or admin', async () => {
      auth.mockResolvedValue(otherSession);
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status).toBe(403);
    });
    it('returns 404 if user not found', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(null);
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status).toBe(404);
    });
    it('returns 200 and user data if self', async () => {
      auth.mockResolvedValue(selfSession);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(userObj);
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(json.id).toBe('123');
    });
    it('returns 200 and user data if admin', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(userObj);
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(json.id).toBe('123');
    });
    it('returns 500 on DB error', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('GET');
      const res = await GET(req, { params });
      expect(res.status).toBe(500);
    });
  });

  describe('PATCH', () => {
    const validBody = { name: 'Updated', email: 'updated@example.com' };
    it('returns 401 if not authenticated', async () => {
      auth.mockResolvedValue(null);
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status).toBe(401);
    });
    it('returns 403 if not self or admin', async () => {
      auth.mockResolvedValue(otherSession);
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status).toBe(403);
    });
    it('returns 403 if non-admin tries to change role', async () => {
      auth.mockResolvedValue(selfSession);
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('PATCH', { role: 'ADMIN' });
      const res = await PATCH(req, { params });
      expect(res.status).toBe(403);
    });
    it('returns 404 if user not found', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(null);
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status).toBe(404);
    });
    it('returns 400 for invalid input', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(userObj);
      const req = createMockRequest('PATCH', { email: 'not-an-email' });
      const res = await PATCH(req, { params });
      expect(res.status).toBe(400);
    });
    it('returns 409 if email already exists', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique
        .mockResolvedValueOnce(userObj) // first call: find user by id
        .mockResolvedValueOnce({ id: 'other', email: 'updated@example.com' }); // second call: find by email
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status).toBe(409);
    });
    it('returns 200 and updated user if successful', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique
        .mockResolvedValueOnce(userObj) // find by id
        .mockResolvedValueOnce(null);   // find by email (should be null for no duplicate)
      (globalThis as any).mockPrisma.user.update.mockResolvedValue({ ...userObj, ...validBody });
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status || 200).toBe(200);
      const json = await res.json();
      expect(json.name).toBe('Updated');
    });
    it('returns 500 on DB error', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('PATCH', validBody);
      const res = await PATCH(req, { params });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE', () => {
    it('returns 401 if not authenticated', async () => {
      auth.mockResolvedValue(null);
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(401);
    });
    it('returns 403 if not admin', async () => {
      auth.mockResolvedValue(selfSession);
      isAuthorized.mockReturnValue(false);
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(403);
    });
    it('returns 400 if admin tries to self-delete', async () => {
      auth.mockResolvedValue({ user: { id: '123', role: 'ADMIN' } });
      isAuthorized.mockReturnValue(true);
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(400);
    });
    it('returns 404 if user not found', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(null);
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(404);
    });
    it('returns 204 if successful', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockResolvedValue(userObj);
      (globalThis as any).mockPrisma.user.delete.mockResolvedValue({});
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(204);
    });
    it('returns 500 on DB error', async () => {
      auth.mockResolvedValue(adminSession);
      isAuthorized.mockReturnValue(true);
      (globalThis as any).mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('DELETE');
      const res = await DELETE(req, { params });
      expect(res.status).toBe(500);
    });
  });
}); 