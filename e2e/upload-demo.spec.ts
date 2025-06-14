import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Upload Demo', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/upload-demo');
  });

  test('should upload a valid file', async ({ page }) => {
    const fileInput = await page.getByLabel(/file upload/i);
    await fileInput.setInputFiles('e2e/helpers/test-upload.pdf');
    await page.getByRole('button', { name: /upload/i }).click();
    await expect(page.getByText(/upload successful/i)).toBeVisible();
  });

  test('should show error for invalid file type', async ({ page }) => {
    const fileInput = await page.getByLabel(/file upload/i);
    await fileInput.setInputFiles('e2e/helpers/invalid.txt');
    await page.getByRole('button', { name: /upload/i }).click();
    await expect(page.getByText(/invalid file type/i)).toBeVisible();
  });

  test('should handle API error on upload', async ({ page }) => {
    const fileInput = await page.getByLabel(/file upload/i);
    await fileInput.setInputFiles('e2e/helpers/test-upload.pdf');
    await page.route('/api/uploadthing', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await page.getByRole('button', { name: /upload/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
}); 