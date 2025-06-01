import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/analytics');
  });

  test('should display analytics overview', async ({ page }) => {
    // Verify main metrics are visible
    await expect(page.locator('[data-testid="total-visitors"]')).toBeVisible();
    await expect(page.locator('[data-testid="page-views"]')).toBeVisible();
    await expect(page.locator('[data-testid="bounce-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="avg-session"]')).toBeVisible();
  });

  test('should filter analytics by date range', async ({ page }) => {
    // Open date picker
    await page.click('[data-testid="date-range-picker"]');
    
    // Select last 7 days
    await page.click('text=Last 7 days');
    
    // Verify data updates
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    
    // Verify chart is updated
    await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible();
  });

  test('should handle offline mode gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/api/analytics/**', (route) => route.abort());
    
    // Refresh page
    await page.reload();
    
    // Verify offline message
    await expect(page.locator('text=Using offline data')).toBeVisible();
    
    // Verify fallback data is shown
    await expect(page.locator('[data-testid="total-visitors"]')).not.toBeEmpty();
  });

  test('should export analytics data', async ({ page }) => {
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-button"]');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify file name
    expect(download.suggestedFilename()).toMatch(/analytics-export.*\.csv$/);
  });

  test('should display performance metrics', async ({ page }) => {
    // Navigate to performance tab
    await page.click('text=Performance');
    
    // Verify performance metrics
    await expect(page.locator('[data-testid="lcp-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="fid-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="cls-score"]')).toBeVisible();
    
    // Check performance chart
    await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible();
  });

  test('should handle data sync', async ({ page }) => {
    // Click sync button
    await page.click('[data-testid="sync-button"]');
    
    // Verify sync status
    await expect(page.locator('text=Syncing data')).toBeVisible();
    await expect(page.locator('text=Sync complete')).toBeVisible();
    
    // Verify last sync time updates
    const lastSync = await page.locator('[data-testid="last-sync"]').textContent();
    expect(lastSync).toContain('less than a minute ago');
  });

  test('should customize chart views', async ({ page }) => {
    // Open chart settings
    await page.click('[data-testid="chart-settings"]');
    
    // Toggle metrics
    await page.click('text=Page Views');
    await page.click('text=Unique Visitors');
    
    // Apply changes
    await page.click('button:has-text("Apply")');
    
    // Verify chart updates
    const chart = page.locator('[data-testid="analytics-chart"]');
    await expect(chart.locator('.page-views-line')).not.toBeVisible();
    await expect(chart.locator('.visitors-line')).not.toBeVisible();
  });

  test('should handle error states', async ({ page }) => {
    // Simulate API error
    await page.route('**/api/analytics/stats', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Refresh page
    await page.reload();
    
    // Verify error message
    await expect(page.locator('text=Error loading analytics')).toBeVisible();
    await expect(page.locator('text=Try again')).toBeVisible();
    
    // Click retry
    await page.click('text=Try again');
    
    // Verify loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });
}); 