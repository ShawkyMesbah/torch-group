# Test info

- Name: Performance Tests >> should load homepage within performance budget
- Location: C:\Users\shmes\Desktop\torch-group\e2e\performance.spec.ts:6:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 3000
Received:   6212
    at C:\Users\shmes\Desktop\torch-group\e2e\performance.spec.ts:16:22
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
   1 | import { test, expect } from '@playwright/test';
   2 | import { loginAsAdmin } from './helpers/auth';
   3 | import { checkPerformance, mockNetworkConditions } from './helpers/common';
   4 |
   5 | test.describe('Performance Tests', () => {
   6 |   test('should load homepage within performance budget', async ({ page }) => {
   7 |     // Measure initial page load
   8 |     const startTime = Date.now();
   9 |     await page.goto('/');
   10 |     const loadTime = Date.now() - startTime;
   11 |
   12 |     // Check performance metrics
   13 |     const metrics = await checkPerformance(page);
   14 |     
   15 |     // Assert performance budgets
>  16 |     expect(loadTime).toBeLessThan(3000); // 3s total load
      |                      ^ Error: expect(received).toBeLessThan(expected)
   17 |     expect(metrics.fcp).toBeLessThan(1000); // 1s First Contentful Paint
   18 |     expect(metrics.lcp).toBeLessThan(2500); // 2.5s Largest Contentful Paint
   19 |     expect(metrics.cls).toBeLessThan(0.1); // Good CLS score
   20 |   });
   21 |
   22 |   test('should maintain performance under load', async ({ page }) => {
   23 |     await loginAsAdmin(page);
   24 |
   25 |     // Create multiple blog posts
   26 |     for (let i = 0; i < 5; i++) {
   27 |       await page.goto('/dashboard/blog/new');
   28 |       await page.fill('input[name="title"]', `Test Post ${i}`);
   29 |       await page.fill('input[name="slug"]', `test-post-${i}`);
   30 |       await page.fill('textarea[name="content"]', `Content for post ${i}`);
   31 |       await page.click('button:has-text("Publish")');
   32 |     }
   33 |
   34 |     // Measure blog list load time
   35 |     const startTime = Date.now();
   36 |     await page.goto('/blog');
   37 |     const loadTime = Date.now() - startTime;
   38 |
   39 |     expect(loadTime).toBeLessThan(2000); // 2s load time with multiple posts
   40 |   });
   41 |
   42 |   test('should handle slow network conditions', async ({ page }) => {
   43 |     // Simulate 3G network
   44 |     await mockNetworkConditions(page, { latency: 100 });
   45 |
   46 |     // Load homepage
   47 |     await page.goto('/');
   48 |
   49 |     // Check if loading indicators appear
   50 |     await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
   51 |
   52 |     // Verify content loads eventually
   53 |     await expect(page.locator('h1')).toBeVisible();
   54 |     await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible();
   55 |   });
   56 |
   57 |   test('should optimize image loading', async ({ page }) => {
   58 |     await page.goto('/');
   59 |
   60 |     // Check if images use lazy loading
   61 |     const images = await page.locator('img').all();
   62 |     for (const image of images) {
   63 |       const loading = await image.getAttribute('loading');
   64 |       const isAboveTheFold = await image.isVisible();
   65 |       
   66 |       if (isAboveTheFold) {
   67 |         // Critical images should load eagerly
   68 |         expect(loading).not.toBe('lazy');
   69 |       } else {
   70 |         // Non-critical images should be lazy loaded
   71 |         expect(loading).toBe('lazy');
   72 |       }
   73 |     }
   74 |   });
   75 |
   76 |   test('should handle offline mode', async ({ page }) => {
   77 |     // Load page first
   78 |     await page.goto('/');
   79 |     
   80 |     // Enable offline mode
   81 |     await mockNetworkConditions(page, { offline: true });
   82 |     
   83 |     // Navigate to another page
   84 |     await page.click('text=About');
   85 |     
   86 |     // Should show offline message
   87 |     await expect(page.locator('text=You are offline')).toBeVisible();
   88 |     
   89 |     // Should show cached content
   90 |     await expect(page.locator('main')).not.toBeEmpty();
   91 |   });
   92 |
   93 |   test('should maintain responsive performance', async ({ page }) => {
   94 |     // Test different viewport sizes
   95 |     const viewports = [
   96 |       { width: 375, height: 667 },  // Mobile
   97 |       { width: 768, height: 1024 }, // Tablet
   98 |       { width: 1440, height: 900 }  // Desktop
   99 |     ];
  100 |
  101 |     for (const viewport of viewports) {
  102 |       await page.setViewportSize(viewport);
  103 |       
  104 |       const startTime = Date.now();
  105 |       await page.goto('/');
  106 |       const loadTime = Date.now() - startTime;
  107 |
  108 |       // Performance should be consistent across viewports
  109 |       expect(loadTime).toBeLessThan(3000);
  110 |       
  111 |       // Check for layout shifts
  112 |       const metrics = await checkPerformance(page);
  113 |       expect(metrics.cls).toBeLessThan(0.1);
  114 |     }
  115 |   });
  116 |
```