# Test info

- Name: Admin Dashboard >> should manage blog posts
- Location: C:\Users\shmes\Desktop\torch-group\e2e\admin.test.ts:32:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected pattern: /.*dashboard/
Received string:  "http://localhost:3000/login?admin=1"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    8 × locator resolved to <html lang="en" class="dark">…</html>
      - unexpected value "http://localhost:3000/login?admin=1"

    at C:\Users\shmes\Desktop\torch-group\e2e\admin.test.ts:12:24
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
- banner:
  - navigation:
    - button "Toggle menu"
- main:
  - heading "Admin Login" [level=1]
  - paragraph: Enter your admin credentials to sign in.
  - text: Email
  - textbox "Email": admin@torchgroup.co
  - text: Password
  - textbox "Password": admin123
  - text: Admin Code
  - textbox "Admin Code"
  - button "Sign in"
  - link "Forgot password?":
    - /url: /forgot-password
  - link "Regular Login":
    - /url: /login
- contentinfo:
  - img "Torch Logo"
  - navigation "Footer":
    - link "About":
      - /url: /about
    - link "Services":
      - /url: /services
    - link "Blog":
      - /url: /blog
    - link "Contact":
      - /url: /contact
  - link "Facebook":
    - /url: https://facebook.com/torchgroup
  - link "Instagram":
    - /url: https://instagram.com/torchgroup
  - link "Twitter":
    - /url: https://twitter.com/torchgroup
  - link "LinkedIn":
    - /url: https://linkedin.com/company/torchgroup
  - paragraph: © 2025 Torch Group. All rights reserved.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Admin Dashboard', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Login as admin
   6 |     await page.goto('/admin-login');
   7 |     await page.getByLabel(/email/i).fill('admin@torchgroup.co');
   8 |     await page.getByLabel(/password/i).fill('admin123');
   9 |     await page.getByRole('button', { name: /sign in/i }).click();
  10 |     
  11 |     // Verify we're logged in
> 12 |     await expect(page).toHaveURL(/.*dashboard/);
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  13 |   });
  14 |
  15 |   test('should navigate admin sections', async ({ page }) => {
  16 |     // Analytics
  17 |     await page.getByRole('link', { name: /analytics/i }).click();
  18 |     await expect(page).toHaveURL(/.*analytics/);
  19 |     await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  20 |
  21 |     // Blog Management
  22 |     await page.getByRole('link', { name: /blog/i }).click();
  23 |     await expect(page).toHaveURL(/.*blog/);
  24 |     await expect(page.getByRole('button', { name: /new post/i })).toBeVisible();
  25 |
  26 |     // Settings
  27 |     await page.getByRole('link', { name: /settings/i }).click();
  28 |     await expect(page).toHaveURL(/.*settings/);
  29 |     await expect(page.getByRole('tab', { name: /email templates/i })).toBeVisible();
  30 |   });
  31 |
  32 |   test('should manage blog posts', async ({ page }) => {
  33 |     await page.goto('/dashboard/blog');
  34 |
  35 |     // Create new post
  36 |     await page.getByRole('button', { name: /new post/i }).click();
  37 |     await page.getByLabel(/title/i).fill('Test Blog Post');
  38 |     await page.getByLabel(/content/i).fill('This is a test blog post content.');
  39 |     await page.getByRole('button', { name: /publish/i }).click();
  40 |
  41 |     // Verify post was created
  42 |     await expect(page.getByText('Test Blog Post')).toBeVisible();
  43 |   });
  44 |
  45 |   test('should manage homepage sections', async ({ page }) => {
  46 |     await page.goto('/dashboard/settings/homepage');
  47 |
  48 |     // Check if section reordering is available
  49 |     await expect(page.getByRole('button', { name: /save order/i })).toBeVisible();
  50 |
  51 |     // Verify sections are present
  52 |     await expect(page.getByText(/hero section/i)).toBeVisible();
  53 |     await expect(page.getByText(/services/i)).toBeVisible();
  54 |     await expect(page.getByText(/blog/i)).toBeVisible();
  55 |   });
  56 |
  57 |   test('should handle user management', async ({ page }) => {
  58 |     await page.goto('/dashboard/users');
  59 |
  60 |     // Check user list
  61 |     await expect(page.getByRole('table')).toBeVisible();
  62 |
  63 |     // Try to add new user
  64 |     await page.getByRole('button', { name: /add user/i }).click();
  65 |     await page.getByLabel(/email/i).fill('test@example.com');
  66 |     await page.getByLabel(/role/i).selectOption('editor');
  67 |     await page.getByRole('button', { name: /save/i }).click();
  68 |
  69 |     // Verify user was added
  70 |     await expect(page.getByText('test@example.com')).toBeVisible();
  71 |   });
  72 | }); 
```