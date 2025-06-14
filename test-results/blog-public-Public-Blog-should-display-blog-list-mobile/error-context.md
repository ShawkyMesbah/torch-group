# Test info

- Name: Public Blog >> should display blog list
- Location: C:\Users\shmes\Desktop\torch-group\e2e\blog-public.spec.ts:4:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByRole('heading', { name: /our blog/i })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('heading', { name: /our blog/i })

    at C:\Users\shmes\Desktop\torch-group\e2e\blog-public.spec.ts:6:68
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
  - text: INSIGHTS AND INSPIRATION
  - heading "Torch Blog" [level=1]
  - paragraph: Discover strategies, insights, and expert advice to help your business thrive in the digital world
  - paragraph: No blog posts found matching your criteria.
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
   3 | test.describe('Public Blog', () => {
   4 |   test('should display blog list', async ({ page }) => {
   5 |     await page.goto('/blog');
>  6 |     await expect(page.getByRole('heading', { name: /our blog/i })).toBeVisible();
     |                                                                    ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   7 |     await expect(page.getByRole('article')).toBeVisible();
   8 |   });
   9 |
  10 |   test('should view a blog post', async ({ page }) => {
  11 |     await page.goto('/blog');
  12 |     const firstPost = page.getByRole('article').first();
  13 |     await firstPost.click();
  14 |     await expect(page.getByRole('heading')).toBeVisible();
  15 |     await expect(page).toHaveURL(/\/blog\//);
  16 |   });
  17 |
  18 |   // Add more tests for comments or newsletter subscription if present
  19 | }); 
```