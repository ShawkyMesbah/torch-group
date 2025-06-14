import { test, expect } from '@playwright/test';

test.describe('Services Form', () => {
  test('should submit services form successfully', async ({ page }) => {
    await page.goto('/services');
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/service/i).selectOption('consulting');
    await page.getByLabel(/message/i).fill('I need help with my project.');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/request received/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/service is required/i)).toBeVisible();
    await expect(page.getByText(/message is required/i)).toBeVisible();
  });

  test('should handle API error on submission', async ({ page }) => {
    await page.goto('/services');
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/service/i).selectOption('consulting');
    await page.getByLabel(/message/i).fill('I need help with my project.');
    await page.route('/api/services', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
}); 