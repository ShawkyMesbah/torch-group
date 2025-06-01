import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Homepage Section Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/settings/homepage');
  });

  test('should display current section order', async ({ page }) => {
    // Verify section list is visible
    const sectionList = page.locator('[data-testid="section-list"]');
    await expect(sectionList).toBeVisible();

    // Verify all default sections are present
    await expect(page.locator('text=Hero Section')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Torch Group')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();
    await expect(page.locator('text=Torch Talents')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
  });

  test('should reorder sections using drag and drop', async ({ page }) => {
    // Get initial order
    const sections = await page.locator('[data-testid="section-item"]').all();
    const initialOrder = await Promise.all(
      sections.map(section => section.textContent())
    );

    // Perform drag and drop
    const sourceSection = sections[1]; // Second section
    const targetSection = sections[3]; // Fourth section

    // Get source and target positions
    const sourceBox = await sourceSection.boundingBox();
    const targetBox = await targetSection.boundingBox();

    if (sourceBox && targetBox) {
      // Perform drag and drop
      await page.mouse.move(
        sourceBox.x + sourceBox.width / 2,
        sourceBox.y + sourceBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2
      );
      await page.mouse.up();
    }

    // Save changes
    await page.click('button:has-text("Save Order")');

    // Verify success message
    await expect(page.locator('text=Section order updated successfully')).toBeVisible();

    // Verify new order
    const updatedSections = await page.locator('[data-testid="section-item"]').all();
    const newOrder = await Promise.all(
      updatedSections.map(section => section.textContent())
    );

    // Verify the moved section is in the new position
    expect(newOrder[3]).toBe(initialOrder[1]);
  });

  test('should persist section order after page reload', async ({ page }) => {
    // Get current order
    const sections = await page.locator('[data-testid="section-item"]').all();
    const initialOrder = await Promise.all(
      sections.map(section => section.textContent())
    );

    // Reload page
    await page.reload();

    // Get order after reload
    const updatedSections = await page.locator('[data-testid="section-item"]').all();
    const newOrder = await Promise.all(
      updatedSections.map(section => section.textContent())
    );

    // Verify order is maintained
    expect(newOrder).toEqual(initialOrder);
  });

  test('should handle section visibility toggles', async ({ page }) => {
    // Find a section toggle
    const toggleButton = page.locator('[data-testid="section-toggle"]').first();
    
    // Get initial state
    const initialState = await toggleButton.getAttribute('aria-checked');
    
    // Toggle visibility
    await toggleButton.click();
    
    // Save changes
    await page.click('button:has-text("Save Order")');
    
    // Verify success message
    await expect(page.locator('text=Section order updated successfully')).toBeVisible();
    
    // Verify toggle state changed
    const newState = await toggleButton.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
    
    // Check homepage reflects change
    await page.goto('/');
    if (newState === 'true') {
      await expect(page.locator('[data-testid="section-hero"]')).toBeVisible();
    } else {
      await expect(page.locator('[data-testid="section-hero"]')).not.toBeVisible();
    }
  });

  test('should validate minimum visible sections', async ({ page }) => {
    // Try to hide all sections
    const toggles = await page.locator('[data-testid="section-toggle"]').all();
    for (const toggle of toggles) {
      const isChecked = await toggle.getAttribute('aria-checked') === 'true';
      if (isChecked) {
        await toggle.click();
      }
    }

    // Try to save
    await page.click('button:has-text("Save Order")');

    // Verify error message
    await expect(page.locator('text=At least one section must be visible')).toBeVisible();
  });

  test('should handle concurrent edits', async ({ page, browser }) => {
    // Open a second browser context
    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    
    // Login in second page
    await loginAsAdmin(secondPage);
    await secondPage.goto('/dashboard/settings/homepage');

    // Make changes in first page
    const sections = await page.locator('[data-testid="section-item"]').all();
    const sourceBox = await sections[0].boundingBox();
    const targetBox = await sections[1].boundingBox();

    if (sourceBox && targetBox) {
      await page.mouse.move(
        sourceBox.x + sourceBox.width / 2,
        sourceBox.y + sourceBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2
      );
      await page.mouse.up();
    }

    // Save in first page
    await page.click('button:has-text("Save Order")');

    // Try to save in second page
    await secondPage.click('button:has-text("Save Order")');

    // Verify conflict message
    await expect(secondPage.locator('text=Changes have been made by another user')).toBeVisible();

    // Clean up
    await secondContext.close();
  });
}); 