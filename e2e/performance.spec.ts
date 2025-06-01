import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { checkPerformance, mockNetworkConditions } from './helpers/common';

test.describe('Performance Tests', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    // Measure initial page load
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Check performance metrics
    const metrics = await checkPerformance(page);
    
    // Assert performance budgets
    expect(loadTime).toBeLessThan(3000); // 3s total load
    expect(metrics.fcp).toBeLessThan(1000); // 1s First Contentful Paint
    expect(metrics.lcp).toBeLessThan(2500); // 2.5s Largest Contentful Paint
    expect(metrics.cls).toBeLessThan(0.1); // Good CLS score
  });

  test('should maintain performance under load', async ({ page }) => {
    await loginAsAdmin(page);

    // Create multiple blog posts
    for (let i = 0; i < 5; i++) {
      await page.goto('/dashboard/blog/new');
      await page.fill('input[name="title"]', `Test Post ${i}`);
      await page.fill('input[name="slug"]', `test-post-${i}`);
      await page.fill('textarea[name="content"]', `Content for post ${i}`);
      await page.click('button:has-text("Publish")');
    }

    // Measure blog list load time
    const startTime = Date.now();
    await page.goto('/blog');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000); // 2s load time with multiple posts
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate 3G network
    await mockNetworkConditions(page, { latency: 100 });

    // Load homepage
    await page.goto('/');

    // Check if loading indicators appear
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();

    // Verify content loads eventually
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible();
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/');

    // Check if images use lazy loading
    const images = await page.locator('img').all();
    for (const image of images) {
      const loading = await image.getAttribute('loading');
      const isAboveTheFold = await image.isVisible();
      
      if (isAboveTheFold) {
        // Critical images should load eagerly
        expect(loading).not.toBe('lazy');
      } else {
        // Non-critical images should be lazy loaded
        expect(loading).toBe('lazy');
      }
    }
  });

  test('should handle offline mode', async ({ page }) => {
    // Load page first
    await page.goto('/');
    
    // Enable offline mode
    await mockNetworkConditions(page, { offline: true });
    
    // Navigate to another page
    await page.click('text=About');
    
    // Should show offline message
    await expect(page.locator('text=You are offline')).toBeVisible();
    
    // Should show cached content
    await expect(page.locator('main')).not.toBeEmpty();
  });

  test('should maintain responsive performance', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1440, height: 900 }  // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      // Performance should be consistent across viewports
      expect(loadTime).toBeLessThan(3000);
      
      // Check for layout shifts
      const metrics = await checkPerformance(page);
      expect(metrics.cls).toBeLessThan(0.1);
    }
  });

  test('should optimize form submission', async ({ page }) => {
    await page.goto('/contact');

    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');

    // Measure submission time
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await page.locator('text=Message sent').waitFor();
    const submitTime = Date.now() - startTime;

    expect(submitTime).toBeLessThan(1000); // 1s submission time
  });
}); 