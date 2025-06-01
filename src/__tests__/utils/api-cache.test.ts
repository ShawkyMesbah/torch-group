import { apiCache } from '@/utils/api-cache'

describe('APICache', () => {
  beforeEach(() => {
    apiCache.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should cache and return data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
    
    const result1 = await apiCache.get('test-key', mockFetch)
    expect(result1).toEqual({ data: 'test' })
    expect(mockFetch).toHaveBeenCalledTimes(1)

    const result2 = await apiCache.get('test-key', mockFetch)
    expect(result2).toEqual({ data: 'test' })
    expect(mockFetch).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should respect TTL', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
    const ttl = 1000 // 1 second

    await apiCache.get('test-key', mockFetch, ttl)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Advance time by less than TTL
    jest.advanceTimersByTime(500)
    await apiCache.get('test-key', mockFetch, ttl)
    expect(mockFetch).toHaveBeenCalledTimes(1) // Should use cache

    // Advance time beyond TTL
    jest.advanceTimersByTime(1000)
    await apiCache.get('test-key', mockFetch, ttl)
    expect(mockFetch).toHaveBeenCalledTimes(2) // Should fetch again
  })

  it('should invalidate cache entries', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
    
    await apiCache.get('test-key', mockFetch)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    apiCache.invalidate('test-key')
    await apiCache.get('test-key', mockFetch)
    expect(mockFetch).toHaveBeenCalledTimes(2) // Should fetch again
  })

  it('should invalidate by pattern', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
    
    await apiCache.get('test-1', mockFetch)
    await apiCache.get('test-2', mockFetch)
    await apiCache.get('other', mockFetch)
    expect(mockFetch).toHaveBeenCalledTimes(3)

    apiCache.invalidatePattern(/^test-/)
    expect(apiCache.getCacheSize()).toBe(1) // Only 'other' should remain
  })

  it('should track cache size', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
    
    expect(apiCache.getCacheSize()).toBe(0)
    
    await apiCache.get('key1', mockFetch)
    expect(apiCache.getCacheSize()).toBe(1)
    
    await apiCache.get('key2', mockFetch)
    expect(apiCache.getCacheSize()).toBe(2)
    
    apiCache.invalidate('key1')
    expect(apiCache.getCacheSize()).toBe(1)
  })
}) 