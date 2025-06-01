import { POST } from '@/app/api/log-error/route'
import { NextRequest } from 'next/server'

describe('Error Logging API', () => {
  let mockConsoleError: jest.SpyInstance

  beforeEach(() => {
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    mockConsoleError.mockRestore()
  })

  it('should log valid error data', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-error', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test error',
        stack: 'Error: Test error\n    at Test.test (/test.ts:1:1)',
        url: '/test',
        timestamp: Date.now(),
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(mockConsoleError).toHaveBeenCalled()
  })

  it('should handle invalid error data', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-error', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test error',
        // Missing required fields
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid error data' })
  })

  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-error', {
      method: 'POST',
      body: 'invalid json',
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid JSON' })
  })

  it('should validate error data schema', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-error', {
      method: 'POST',
      body: JSON.stringify({
        message: '',  // Empty message
        stack: 'Error stack',
        url: '/test',
        timestamp: Date.now(),
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid error data' })
  })
}) 