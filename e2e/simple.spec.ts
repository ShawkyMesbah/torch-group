import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Simple Demo Form', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/simple');
  });

  test('should submit simple form successfully', async ({ page }) => {
    await page.getByLabel(/demo input/i).fill('Test Value');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/form submitted/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/input is required/i)).toBeVisible();
  });

  test('should handle API error on submission', async ({ page }) => {
    await page.getByLabel(/demo input/i).fill('Test Value');
    await page.route('/api/simple', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
}); 