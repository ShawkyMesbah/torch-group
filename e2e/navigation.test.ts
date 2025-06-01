import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Navigate to About
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
    
    // Navigate to Services
    await page.getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/.*services/);
    await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
    
    // Navigate to Blog
    await page.getByRole('link', { name: /blog/i }).click();
    await expect(page).toHaveURL(/.*blog/);
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible();
    
    // Navigate to Contact
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });

  test('should handle mobile navigation menu', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();
    
    // Check if menu items are visible
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Click a menu item
    await page.getByRole('link', { name: /about/i }).click();
    
    // Verify navigation worked and menu closed
    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('navigation')).not.toBeVisible();
  });
}); 