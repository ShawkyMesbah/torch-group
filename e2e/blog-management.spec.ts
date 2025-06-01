import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Blog Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/blog');
  });

  test('should create a new blog post', async ({ page }) => {
    // Click new post button
    await page.click('text=New Post');
    await expect(page).toHaveURL('/dashboard/blog/new');

    // Fill in blog post form
    await page.fill('input[name="title"]', 'Test Blog Post');
    await page.fill('input[name="slug"]', 'test-blog-post');
    await page.fill('textarea[name="excerpt"]', 'This is a test blog post excerpt');
    
    // Fill rich text editor
    const editorFrame = page.frameLocator('.ProseMirror');
    await editorFrame.locator('p').fill('This is the content of the test blog post.');

    // Upload featured image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image data'),
    });

    // Save post
    await page.click('button:has-text("Publish")');

    // Verify success message
    await expect(page.locator('text=Post published successfully')).toBeVisible();

    // Verify post appears in list
    await page.goto('/dashboard/blog');
    await expect(page.locator('text=Test Blog Post')).toBeVisible();
  });

  test('should edit an existing blog post', async ({ page }) => {
    // Find and click edit button for first post
    await page.click('[aria-label="Edit post"]');

    // Update title
    await page.fill('input[name="title"]', 'Updated Blog Post');
    
    // Update content
    const editorFrame = page.frameLocator('.ProseMirror');
    await editorFrame.locator('p').fill('This is the updated content.');

    // Save changes
    await page.click('button:has-text("Save changes")');

    // Verify success message
    await expect(page.locator('text=Post updated successfully')).toBeVisible();

    // Verify changes in list
    await page.goto('/dashboard/blog');
    await expect(page.locator('text=Updated Blog Post')).toBeVisible();
  });

  test('should delete a blog post', async ({ page }) => {
    // Store initial post count
    const initialPosts = await page.locator('tr').count();

    // Click delete button on first post
    await page.click('[aria-label="Delete post"]');

    // Confirm deletion in modal
    await page.click('button:has-text("Delete")');

    // Verify success message
    await expect(page.locator('text=Post deleted successfully')).toBeVisible();

    // Verify post count decreased
    const finalPosts = await page.locator('tr').count();
    expect(finalPosts).toBe(initialPosts - 1);
  });

  test('should handle draft and publish states', async ({ page }) => {
    // Create new draft post
    await page.click('text=New Post');
    await page.fill('input[name="title"]', 'Draft Post');
    await page.fill('input[name="slug"]', 'draft-post');
    
    // Save as draft
    await page.click('button:has-text("Save as draft")');
    
    // Verify draft status
    await page.goto('/dashboard/blog');
    await expect(page.locator('text=Draft')).toBeVisible();
    
    // Publish draft
    await page.click('[aria-label="Edit post"]');
    await page.click('button:has-text("Publish")');
    
    // Verify published status
    await page.goto('/dashboard/blog');
    await expect(page.locator('text=Published')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to create post without required fields
    await page.click('text=New Post');
    await page.click('button:has-text("Publish")');

    // Verify validation messages
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Slug is required')).toBeVisible();
    await expect(page.locator('text=Content is required')).toBeVisible();
  });

  test('should handle image upload errors', async ({ page }) => {
    await page.click('text=New Post');

    // Try to upload invalid file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not an image'),
    });

    // Verify error message
    await expect(page.locator('text=Invalid file type')).toBeVisible();
  });
}); 