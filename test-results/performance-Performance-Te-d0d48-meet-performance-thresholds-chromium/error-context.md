# Test info

- Name: Performance Tests >> homepage should meet performance thresholds
- Location: C:\Users\shmes\Desktop\torch-group\e2e\performance.test.ts:31:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 600
Received:   6463.199999988079
    at C:\Users\shmes\Desktop\torch-group\e2e\performance.test.ts:41:26
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
- img "Torch Group Logo"
- text: LOADING
```

# Test source

```ts
   1 | import { test, expect, Page } from '@playwright/test';
   2 |
   3 | test.describe('Performance Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Enable performance metrics
   6 |     await page.setViewportSize({ width: 1280, height: 720 });
   7 |   });
   8 |
   9 |   async function measurePerformance(page: Page) {
   10 |     const metrics = await page.evaluate(() => {
   11 |       const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0] as any;
   12 |       const fidEntry = performance.getEntriesByType('first-input')[0] as any;
   13 |       const clsEntries = performance.getEntriesByType('layout-shift') as any[];
   14 |       const navEntry = performance.getEntriesByType('navigation')[0] as any;
   15 |       const fcpEntry = performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint') as any;
   16 |
   17 |       return {
   18 |         // Core Web Vitals
   19 |         LCP: lcpEntry?.startTime || 0,
   20 |         FID: fidEntry?.processingStart || 0,
   21 |         CLS: clsEntries.reduce((sum, shift) => sum + shift.value, 0),
   22 |         // Other metrics
   23 |         TTFB: navEntry?.responseStart || 0,
   24 |         FCP: fcpEntry?.startTime || 0,
   25 |       };
   26 |     });
   27 |
   28 |     return metrics;
   29 |   }
   30 |
   31 |   test('homepage should meet performance thresholds', async ({ page }) => {
   32 |     await page.goto('/');
   33 |     const metrics = await measurePerformance(page);
   34 |
   35 |     // Core Web Vitals thresholds
   36 |     expect(metrics.LCP).toBeLessThan(2500); // Good LCP is < 2.5s
   37 |     expect(metrics.FID).toBeLessThan(100); // Good FID is < 100ms
   38 |     expect(metrics.CLS).toBeLessThan(0.1); // Good CLS is < 0.1
   39 |
   40 |     // Other performance thresholds
>  41 |     expect(metrics.TTFB).toBeLessThan(600); // Good TTFB is < 600ms
      |                          ^ Error: expect(received).toBeLessThan(expected)
   42 |     expect(metrics.FCP).toBeLessThan(1800); // Good FCP is < 1.8s
   43 |   });
   44 |
   45 |   test('blog page should load quickly', async ({ page }) => {
   46 |     const startTime = Date.now();
   47 |     await page.goto('/blog');
   48 |     const loadTime = Date.now() - startTime;
   49 |
   50 |     expect(loadTime).toBeLessThan(3000); // Page should load in < 3s
   51 |
   52 |     const metrics = await measurePerformance(page);
   53 |     expect(metrics.LCP).toBeLessThan(2500);
   54 |   });
   55 |
   56 |   test('contact form should be interactive quickly', async ({ page }) => {
   57 |     await page.goto('/contact');
   58 |     
   59 |     // Measure Time to Interactive for the form
   60 |     const tti = await page.evaluate(async () => {
   61 |       const form = document.querySelector('form');
   62 |       if (!form) return 0;
   63 |       
   64 |       const start = performance.now();
   65 |       while (performance.now() - start < 5000) {
   66 |         const interactive = await new Promise(resolve => {
   67 |           const input = form.querySelector('input');
   68 |           if (input && document.readyState === 'complete') {
   69 |             resolve(true);
   70 |           }
   71 |           resolve(false);
   72 |         });
   73 |         if (interactive) return performance.now() - start;
   74 |         await new Promise(r => setTimeout(r, 100));
   75 |       }
   76 |       return 5000;
   77 |     });
   78 |
   79 |     expect(tti).toBeLessThan(1000); // Form should be interactive in < 1s
   80 |   });
   81 |
   82 |   test('dashboard should load efficiently', async ({ page }) => {
   83 |     // Login first
   84 |     await page.goto('/admin-login');
   85 |     await page.getByLabel(/email/i).fill('admin@torchgroup.co');
   86 |     await page.getByLabel(/password/i).fill('admin123');
   87 |     await page.getByRole('button', { name: /sign in/i }).click();
   88 |
   89 |     // Measure dashboard load performance
   90 |     const metrics = await measurePerformance(page);
   91 |     expect(metrics.LCP).toBeLessThan(3000); // Dashboard can be slightly slower
   92 |     expect(metrics.TTFB).toBeLessThan(800);
   93 |   });
   94 |
   95 |   test('mobile performance should be optimized', async ({ page }) => {
   96 |     await page.setViewportSize({ width: 375, height: 667 });
   97 |     await page.goto('/');
   98 |
   99 |     // Enable mobile CPU throttling
  100 |     await page.evaluate(() => {
  101 |       if ('hardwareConcurrency' in navigator) {
  102 |         // @ts-ignore
  103 |         Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4 });
  104 |       }
  105 |     });
  106 |
  107 |     const metrics = await measurePerformance(page);
  108 |     expect(metrics.LCP).toBeLessThan(3000); // Mobile threshold
  109 |     expect(metrics.CLS).toBeLessThan(0.1); // Mobile layout shift
  110 |   });
  111 | }); 
```