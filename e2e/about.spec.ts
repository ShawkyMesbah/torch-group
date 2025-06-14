import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should display about page content', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
  });

  // Add more tests here if there are interactive features or forms
}); 