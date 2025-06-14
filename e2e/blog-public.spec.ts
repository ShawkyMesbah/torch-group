import { test, expect } from '@playwright/test';

test.describe('Public Blog', () => {
  test('should display blog list', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /our blog/i })).toBeVisible();
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('should view a blog post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.getByRole('article').first();
    await firstPost.click();
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page).toHaveURL(/\/blog\//);
  });

  // Add more tests for comments or newsletter subscription if present
}); 