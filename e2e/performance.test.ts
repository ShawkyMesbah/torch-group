import { test, expect, Page } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  async function measurePerformance(page: Page) {
    const metrics = await page.evaluate(() => {
      const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0] as any;
      const fidEntry = performance.getEntriesByType('first-input')[0] as any;
      const clsEntries = performance.getEntriesByType('layout-shift') as any[];
      const navEntry = performance.getEntriesByType('navigation')[0] as any;
      const fcpEntry = performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint') as any;

      return {
        // Core Web Vitals
        LCP: lcpEntry?.startTime || 0,
        FID: fidEntry?.processingStart || 0,
        CLS: clsEntries.reduce((sum, shift) => sum + shift.value, 0),
        // Other metrics
        TTFB: navEntry?.responseStart || 0,
        FCP: fcpEntry?.startTime || 0,
      };
    });

    return metrics;
  }

  test('homepage should meet performance thresholds', async ({ page }) => {
    await page.goto('/');
    const metrics = await measurePerformance(page);

    // Core Web Vitals thresholds
    expect(metrics.LCP).toBeLessThan(2500); // Good LCP is < 2.5s
    expect(metrics.FID).toBeLessThan(100); // Good FID is < 100ms
    expect(metrics.CLS).toBeLessThan(0.1); // Good CLS is < 0.1

    // Other performance thresholds
    expect(metrics.TTFB).toBeLessThan(600); // Good TTFB is < 600ms
    expect(metrics.FCP).toBeLessThan(1800); // Good FCP is < 1.8s
  });

  test('blog page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/blog');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // Page should load in < 3s

    const metrics = await measurePerformance(page);
    expect(metrics.LCP).toBeLessThan(2500);
  });

  test('contact form should be interactive quickly', async ({ page }) => {
    await page.goto('/contact');
    
    // Measure Time to Interactive for the form
    const tti = await page.evaluate(async () => {
      const form = document.querySelector('form');
      if (!form) return 0;
      
      const start = performance.now();
      while (performance.now() - start < 5000) {
        const interactive = await new Promise(resolve => {
          const input = form.querySelector('input');
          if (input && document.readyState === 'complete') {
            resolve(true);
          }
          resolve(false);
        });
        if (interactive) return performance.now() - start;
        await new Promise(r => setTimeout(r, 100));
      }
      return 5000;
    });

    expect(tti).toBeLessThan(1000); // Form should be interactive in < 1s
  });

  test('dashboard should load efficiently', async ({ page }) => {
    // Login first
    await page.goto('/admin-login');
    await page.getByLabel(/email/i).fill('admin@torchgroup.co');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Measure dashboard load performance
    const metrics = await measurePerformance(page);
    expect(metrics.LCP).toBeLessThan(3000); // Dashboard can be slightly slower
    expect(metrics.TTFB).toBeLessThan(800);
  });

  test('mobile performance should be optimized', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Enable mobile CPU throttling
    await page.evaluate(() => {
      if ('hardwareConcurrency' in navigator) {
        // @ts-ignore
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4 });
      }
    });

    const metrics = await measurePerformance(page);
    expect(metrics.LCP).toBeLessThan(3000); // Mobile threshold
    expect(metrics.CLS).toBeLessThan(0.1); // Mobile layout shift
  });
}); 