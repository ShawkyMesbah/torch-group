interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.observePageLoadMetrics();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private observePageLoadMetrics() {
    if ('PerformanceObserver' in window) {
      // Observe page load metrics
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.addMetric({
            name: entry.name,
            duration: entry.duration,
            timestamp: entry.startTime,
            context: {
              entryType: entry.entryType,
            },
          });
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    }
  }

  public startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.addMetric({
        name,
        duration,
        timestamp: Date.now(),
      });
    };
  }

  public addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(metric);
    }
  }

  private async sendToAnalyticsService(metric: PerformanceMetric) {
    try {
      await fetch('/api/log-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (e) {
      console.error('Failed to send metric to analytics service:', e);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 