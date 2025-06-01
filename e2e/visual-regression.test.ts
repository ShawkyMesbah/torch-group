import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport size for screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('homepage should match snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2, // Allow 0.2% pixel difference
    });
  });

  test('about page should match snapshot', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('services page should match snapshot', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveScreenshot('services.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('blog page should match snapshot', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveScreenshot('blog.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('contact page should match snapshot', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('mobile homepage should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('dashboard should match snapshot', async ({ page }) => {
    // Login first
    await page.goto('/admin-login');
    await page.getByLabel(/email/i).fill('admin@torchgroup.co');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Take dashboard screenshot
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
}); 