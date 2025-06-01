import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsUser, logout, clearAuthState } from './helpers/auth';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the login page
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginAsUser(page, 'wrong@example.com', 'wrongpassword');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should require email validation', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await logout(page);
    
    // Verify protected route access is blocked
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should handle session expiry', async ({ page }) => {
    await loginAsAdmin(page);
    await clearAuthState(page);

    // Try to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should maintain auth state across navigation', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate through protected routes
    await page.click('text=Analytics');
    await expect(page).toHaveURL('/dashboard/analytics');
    
    await page.click('text=Settings');
    await expect(page).toHaveURL('/dashboard/settings');
    
    // Verify still logged in
    await expect(page.locator('button[aria-label="Open user menu"]')).toBeVisible();
  });
}); 