# Test info

- Name: Navigation >> should navigate to all main sections
- Location: C:\Users\shmes\Desktop\torch-group\e2e\navigation.test.ts:4:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('link', { name: /about/i }) resolved to 2 elements:
    1) <a href="/about" class="relative px-4 py-2 text-lg font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2↵                    text-gray-200 hover:text-white↵                  ">…</a> aka getByRole('banner').getByRole('link', { name: 'About' })
    2) <a href="/about" class="text-base font-bold text-white hover:text-red-600 transition-colors duration-200 underline-offset-4 hover:underline">About</a> aka getByLabel('Footer').getByRole('link', { name: 'About' })

Call log:
  - waiting for getByRole('link', { name: /about/i })

    at C:\Users\shmes\Desktop\torch-group\e2e\navigation.test.ts:11:54
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
- img "Torch Group Logo"
- text: LOADING
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Navigation', () => {
   4 |   test('should navigate to all main sections', async ({ page }) => {
   5 |     await page.goto('/');
   6 |     
   7 |     // Check hero section
   8 |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
   9 |     
  10 |     // Navigate to About
> 11 |     await page.getByRole('link', { name: /about/i }).click();
     |                                                      ^ Error: locator.click: Error: strict mode violation: getByRole('link', { name: /about/i }) resolved to 2 elements:
  12 |     await expect(page).toHaveURL(/.*about/);
  13 |     await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
  14 |     
  15 |     // Navigate to Services
  16 |     await page.getByRole('link', { name: /services/i }).click();
  17 |     await expect(page).toHaveURL(/.*services/);
  18 |     await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
  19 |     
  20 |     // Navigate to Blog
  21 |     await page.getByRole('link', { name: /blog/i }).click();
  22 |     await expect(page).toHaveURL(/.*blog/);
  23 |     await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible();
  24 |     
  25 |     // Navigate to Contact
  26 |     await page.getByRole('link', { name: /contact/i }).click();
  27 |     await expect(page).toHaveURL(/.*contact/);
  28 |     await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  29 |   });
  30 |
  31 |   test('should handle mobile navigation menu', async ({ page }) => {
  32 |     // Set viewport to mobile size
  33 |     await page.setViewportSize({ width: 375, height: 667 });
  34 |     await page.goto('/');
  35 |     
  36 |     // Open mobile menu
  37 |     const menuButton = page.getByRole('button', { name: /menu/i });
  38 |     await menuButton.click();
  39 |     
  40 |     // Check if menu items are visible
  41 |     await expect(page.getByRole('navigation')).toBeVisible();
  42 |     
  43 |     // Click a menu item
  44 |     await page.getByRole('link', { name: /about/i }).click();
  45 |     
  46 |     // Verify navigation worked and menu closed
  47 |     await expect(page).toHaveURL(/.*about/);
  48 |     await expect(page.getByRole('navigation')).not.toBeVisible();
  49 |   });
  50 | }); 
```