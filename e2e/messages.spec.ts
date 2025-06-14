import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Contact Messages Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/messages');
  });

  test('should display messages list', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should view a message', async ({ page }) => {
    const messageRow = page.locator('tr').first();
    await messageRow.getByRole('button', { name: /view/i }).click();
    await expect(page.getByText(/message details/i)).toBeVisible();
  });

  test('should reply to a message', async ({ page }) => {
    const messageRow = page.locator('tr').first();
    await messageRow.getByRole('button', { name: /view/i }).click();
    await page.getByLabel(/reply/i).fill('Thank you for your message!');
    await page.getByRole('button', { name: /send reply/i }).click();
    await expect(page.getByText(/reply sent/i)).toBeVisible();
  });

  test('should delete a message', async ({ page }) => {
    const messageRow = page.locator('tr').first();
    await messageRow.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(messageRow).not.toBeVisible();
  });

  test('should handle API error on reply', async ({ page }) => {
    const messageRow = page.locator('tr').first();
    await messageRow.getByRole('button', { name: /view/i }).click();
    await page.getByLabel(/reply/i).fill('Error test reply');
    await page.route('/api/contact/reply', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await page.getByRole('button', { name: /send reply/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
}); 