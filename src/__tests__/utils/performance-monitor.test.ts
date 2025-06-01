import { performanceMonitor } from '@/utils/performance-monitor'

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics()
    // Mock fetch for API calls
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should track metrics correctly', () => {
    const endTimer = performanceMonitor.startTimer('test-operation')
    
    // Simulate some time passing
    jest.advanceTimersByTime(1000)
    
    endTimer()
    
    const metrics = performanceMonitor.getMetrics()
    expect(metrics).toHaveLength(1)
    expect(metrics[0].name).toBe('test-operation')
    expect(metrics[0].duration).toBeGreaterThan(0)
  })

  it('should limit the number of stored metrics', () => {
    // Add more metrics than the limit
    for (let i = 0; i < 150; i++) {
      performanceMonitor.addMetric({
        name: `metric-${i}`,
        duration: 100,
        timestamp: Date.now()
      })
    }

    const metrics = performanceMonitor.getMetrics()
    expect(metrics.length).toBeLessThanOrEqual(100) // MAX_METRICS is 100
  })

  it('should send metrics to analytics service in production', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    performanceMonitor.addMetric({
      name: 'test-metric',
      duration: 100,
      timestamp: Date.now()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/log-performance',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    )

    process.env.NODE_ENV = originalEnv
  })
}) 