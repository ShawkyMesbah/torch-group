import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/users');
  });

  test('should create a new user', async ({ page }) => {
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/role/i).selectOption('editor');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText('newuser@example.com')).toBeVisible();
  });

  test('should edit an existing user', async ({ page }) => {
    const userRow = page.locator('tr', { hasText: 'newuser@example.com' });
    await userRow.getByRole('button', { name: /edit/i }).click();
    await page.getByLabel(/role/i).selectOption('admin');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(userRow).toContainText('admin');
  });

  test('should delete a user', async ({ page }) => {
    const userRow = page.locator('tr', { hasText: 'newuser@example.com' });
    await userRow.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(userRow).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/role is required/i)).toBeVisible();
  });

  test('should handle API error on user creation', async ({ page }) => {
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByLabel(/email/i).fill('erroruser@example.com');
    await page.route('/api/users', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
}); 