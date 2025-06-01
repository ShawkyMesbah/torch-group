import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin-login');
    await page.getByLabel(/email/i).fill('admin@torchgroup.co');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify we're logged in
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate admin sections', async ({ page }) => {
    // Analytics
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();

    // Blog Management
    await page.getByRole('link', { name: /blog/i }).click();
    await expect(page).toHaveURL(/.*blog/);
    await expect(page.getByRole('button', { name: /new post/i })).toBeVisible();

    // Settings
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.getByRole('tab', { name: /email templates/i })).toBeVisible();
  });

  test('should manage blog posts', async ({ page }) => {
    await page.goto('/dashboard/blog');

    // Create new post
    await page.getByRole('button', { name: /new post/i }).click();
    await page.getByLabel(/title/i).fill('Test Blog Post');
    await page.getByLabel(/content/i).fill('This is a test blog post content.');
    await page.getByRole('button', { name: /publish/i }).click();

    // Verify post was created
    await expect(page.getByText('Test Blog Post')).toBeVisible();
  });

  test('should manage homepage sections', async ({ page }) => {
    await page.goto('/dashboard/settings/homepage');

    // Check if section reordering is available
    await expect(page.getByRole('button', { name: /save order/i })).toBeVisible();

    // Verify sections are present
    await expect(page.getByText(/hero section/i)).toBeVisible();
    await expect(page.getByText(/services/i)).toBeVisible();
    await expect(page.getByText(/blog/i)).toBeVisible();
  });

  test('should handle user management', async ({ page }) => {
    await page.goto('/dashboard/users');

    // Check user list
    await expect(page.getByRole('table')).toBeVisible();

    // Try to add new user
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/role/i).selectOption('editor');
    await page.getByRole('button', { name: /save/i }).click();

    // Verify user was added
    await expect(page.getByText('test@example.com')).toBeVisible();
  });
}); 