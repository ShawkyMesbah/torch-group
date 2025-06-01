import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');

    // Fill out the form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('+1234567890');
    await page.getByLabel(/message/i).fill('This is a test message');

    // Submit the form
    await page.getByRole('button', { name: /send/i }).click();

    // Check for success message
    await expect(page.getByText(/message sent/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/contact');

    // Submit empty form
    await page.getByRole('button', { name: /send/i }).click();

    // Check for validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/message is required/i)).toBeVisible();
  });

  test('should handle phone verification', async ({ page }) => {
    await page.goto('/contact');

    // Fill form except phone
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');

    // Enter invalid phone
    await page.getByLabel(/phone/i).fill('invalid');
    await page.getByRole('button', { name: /send/i }).click();

    // Check for phone validation error
    await expect(page.getByText(/invalid phone number/i)).toBeVisible();

    // Enter valid phone
    await page.getByLabel(/phone/i).fill('+1234567890');
    
    // Request verification code
    await page.getByRole('button', { name: /verify/i }).click();
    
    // Check for verification code input
    await expect(page.getByLabel(/verification code/i)).toBeVisible();
  });
}); 