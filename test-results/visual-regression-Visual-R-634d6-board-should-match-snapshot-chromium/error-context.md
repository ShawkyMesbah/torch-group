# Test info

- Name: Visual Regression Tests >> dashboard should match snapshot
- Location: C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:58:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected)

  6607 pixels (ratio 0.01 of all image pixels) are different.

Expected: C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts-snapshots\dashboard-chromium-win32.png
Received: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-634d6-board-should-match-snapshot-chromium\dashboard-actual.png
    Diff: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-634d6-board-should-match-snapshot-chromium\dashboard-diff.png

Call log:
  - expect.toHaveScreenshot(dashboard.png) with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 1003 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 1490 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 5 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 6607 pixels (ratio 0.01 of all image pixels) are different.

    at C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:66:24
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
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
    - link "Services":
      - /url: /services
    - link "Blog":
      - /url: /blog
    - link "Contact":
      - /url: /contact
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
   3 | test.describe('Visual Regression Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Set a consistent viewport size for screenshots
   6 |     await page.setViewportSize({ width: 1280, height: 720 });
   7 |   });
   8 |
   9 |   test('homepage should match snapshot', async ({ page }) => {
  10 |     await page.goto('/');
  11 |     await expect(page).toHaveScreenshot('homepage.png', {
  12 |       fullPage: true,
  13 |       threshold: 0.2, // Allow 0.2% pixel difference
  14 |     });
  15 |   });
  16 |
  17 |   test('about page should match snapshot', async ({ page }) => {
  18 |     await page.goto('/about');
  19 |     await expect(page).toHaveScreenshot('about.png', {
  20 |       fullPage: true,
  21 |       threshold: 0.2,
  22 |     });
  23 |   });
  24 |
  25 |   test('services page should match snapshot', async ({ page }) => {
  26 |     await page.goto('/services');
  27 |     await expect(page).toHaveScreenshot('services.png', {
  28 |       fullPage: true,
  29 |       threshold: 0.2,
  30 |     });
  31 |   });
  32 |
  33 |   test('blog page should match snapshot', async ({ page }) => {
  34 |     await page.goto('/blog');
  35 |     await expect(page).toHaveScreenshot('blog.png', {
  36 |       fullPage: true,
  37 |       threshold: 0.2,
  38 |     });
  39 |   });
  40 |
  41 |   test('contact page should match snapshot', async ({ page }) => {
  42 |     await page.goto('/contact');
  43 |     await expect(page).toHaveScreenshot('contact.png', {
  44 |       fullPage: true,
  45 |       threshold: 0.2,
  46 |     });
  47 |   });
  48 |
  49 |   test('mobile homepage should match snapshot', async ({ page }) => {
  50 |     await page.setViewportSize({ width: 375, height: 667 });
  51 |     await page.goto('/');
  52 |     await expect(page).toHaveScreenshot('homepage-mobile.png', {
  53 |       fullPage: true,
  54 |       threshold: 0.2,
  55 |     });
  56 |   });
  57 |
  58 |   test('dashboard should match snapshot', async ({ page }) => {
  59 |     // Login first
  60 |     await page.goto('/admin-login');
  61 |     await page.getByLabel(/email/i).fill('admin@torchgroup.co');
  62 |     await page.getByLabel(/password/i).fill('admin123');
  63 |     await page.getByRole('button', { name: /sign in/i }).click();
  64 |
  65 |     // Take dashboard screenshot
> 66 |     await expect(page).toHaveScreenshot('dashboard.png', {
     |                        ^ Error: expect(page).toHaveScreenshot(expected)
  67 |       fullPage: true,
  68 |       threshold: 0.2,
  69 |     });
  70 |   });
  71 | }); 
```