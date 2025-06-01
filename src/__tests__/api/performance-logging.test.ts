import { POST } from '@/app/api/log-performance/route'
import { NextRequest } from 'next/server'

describe('Performance Logging API', () => {
  let mockConsoleLog: jest.SpyInstance

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    mockConsoleLog.mockRestore()
  })

  it('should log valid performance data', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-performance', {
      method: 'POST',
      body: JSON.stringify({
        name: 'LCP',
        duration: 1500,
        timestamp: Date.now(),
        url: '/test',
        value: 1500,
        id: 'test-metric',
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toEqual({ success: true })
    expect(mockConsoleLog).toHaveBeenCalled()
  })

  it('should handle invalid performance data', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-performance', {
      method: 'POST',
      body: JSON.stringify({
        name: 'LCP',
        // Missing required fields
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data).toEqual({ error: 'Invalid performance data' })
  })

  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-performance', {
      method: 'POST',
      body: 'invalid json',
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data).toEqual({ error: 'Invalid JSON' })
  })

  it('should validate metric name', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-performance', {
      method: 'POST',
      body: JSON.stringify({
        name: 'InvalidMetric',
        duration: 1500,
        timestamp: Date.now(),
        url: '/test',
        value: 1500,
        id: 'test-metric',
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data).toEqual({ error: 'Invalid performance data' })
  })

  it('should validate numeric values', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/log-performance', {
      method: 'POST',
      body: JSON.stringify({
        name: 'LCP',
        duration: 'not a number',
        timestamp: Date.now(),
        url: '/test',
        value: 'invalid',
        id: 'test-metric',
      }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data).toEqual({ error: 'Invalid performance data' })
  })
}) 