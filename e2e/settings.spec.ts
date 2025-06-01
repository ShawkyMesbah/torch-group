import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { fillForm, waitForToast, TEST_DATA } from './helpers/common';

test.describe('Settings Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/settings');
  });

  test('should manage email templates', async ({ page }) => {
    // Navigate to email templates
    await page.click('text=Email Templates');

    // Create new template
    await page.click('text=New Template');
    await fillForm(page, {
      name: 'Welcome Email',
      subject: 'Welcome to Torch Group',
      content: 'Hello {{name}}, welcome to Torch Group!'
    });
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'Template saved');

    // Test template preview
    await page.click('[data-testid="preview-template"]');
    await expect(page.locator('.preview-content')).toContainText('Hello John');

    // Edit template
    await page.click('[data-testid="edit-template"]');
    await fillForm(page, {
      subject: 'Updated Welcome Email'
    });
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'Template updated');

    // Delete template
    await page.click('[data-testid="delete-template"]');
    await page.click('button:has-text("Confirm")');
    await waitForToast(page, 'Template deleted');
  });

  test('should manage user permissions', async ({ page }) => {
    // Navigate to permissions
    await page.click('text=Permissions');

    // Add new role
    await page.click('text=New Role');
    await fillForm(page, {
      name: 'Content Editor',
      description: 'Can edit blog posts and content'
    });
    
    // Set permissions
    await page.click('text=Blog Management');
    await page.click('text=Content Management');
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'Role created');

    // Assign role to user
    await page.click('text=Users');
    await page.click('[data-testid="edit-user"]');
    await page.selectOption('select[name="role"]', 'Content Editor');
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'User updated');
  });

  test('should manage site configuration', async ({ page }) => {
    // Navigate to site config
    await page.click('text=Site Configuration');

    // Update social links
    await fillForm(page, {
      'social.linkedin': 'https://linkedin.com/company/torch-group',
      'social.twitter': 'https://twitter.com/torchgroup'
    });
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'Configuration saved');

    // Update contact info
    await fillForm(page, {
      'contact.email': 'contact@torchgroup.co',
      'contact.phone': '+1234567890'
    });
    await page.click('button:has-text("Save")');
    await waitForToast(page, 'Configuration saved');

    // Verify changes persist after reload
    await page.reload();
    await expect(page.locator('input[name="social.linkedin"]'))
      .toHaveValue('https://linkedin.com/company/torch-group');
  });

  test('should handle validation errors', async ({ page }) => {
    await page.click('text=Email Templates');
    await page.click('text=New Template');
    
    // Try to save without required fields
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Subject is required')).toBeVisible();
    await expect(page.locator('text=Content is required')).toBeVisible();
  });

  test('should handle concurrent edits', async ({ page, browser }) => {
    // Open template in two browsers
    await page.click('text=Email Templates');
    const template = await page.locator('[data-testid="edit-template"]').first();
    await template.click();

    // Open second browser
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await loginAsAdmin(page2);
    await page2.goto('/dashboard/settings/email-templates');
    await page2.click('[data-testid="edit-template"]');

    // Edit in first browser
    await fillForm(page, {
      subject: 'Updated in browser 1'
    });
    await page.click('button:has-text("Save")');

    // Try to edit in second browser
    await fillForm(page2, {
      subject: 'Updated in browser 2'
    });
    await page2.click('button:has-text("Save")');

    // Should show conflict warning
    await expect(page2.locator('text=This template has been modified')).toBeVisible();

    await context2.close();
  });
}); 