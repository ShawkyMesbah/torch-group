# Test info

- Name: Authentication Flow >> should show error with invalid credentials
- Location: C:\Users\shmes\Desktop\torch-group\e2e\auth.spec.ts:15:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Invalid credentials')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Invalid credentials')

    at C:\Users\shmes\Desktop\torch-group\e2e\auth.spec.ts:17:60
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list:
    - status:
      - text: Error CredentialsSignin
      - button
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
  - heading "Welcome back" [level=1]
  - paragraph: Enter your credentials to sign in to your account
  - text: Email
  - textbox "Email": wrong@example.com
  - text: Password
  - textbox "Password": wrongpassword
  - button "Sign in"
  - link "Forgot password?":
    - /url: /forgot-password
  - link "Admin Login":
    - /url: /login?admin=1
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
   2 | import { loginAsAdmin, loginAsUser, logout, clearAuthState } from './helpers/auth';
   3 |
   4 | test.describe('Authentication Flow', () => {
   5 |   test.beforeEach(async ({ page }) => {
   6 |     // Start from the login page
   7 |     await page.goto('/login');
   8 |   });
   9 |
  10 |   test('should login successfully with valid credentials', async ({ page }) => {
  11 |     await loginAsAdmin(page);
  12 |     await expect(page.locator('text=Welcome back')).toBeVisible();
  13 |   });
  14 |
  15 |   test('should show error with invalid credentials', async ({ page }) => {
  16 |     await loginAsUser(page, 'wrong@example.com', 'wrongpassword');
> 17 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
     |                                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  18 |   });
  19 |
  20 |   test('should require email validation', async ({ page }) => {
  21 |     // Submit empty form
  22 |     await page.click('button[type="submit"]');
  23 |     
  24 |     // Verify validation messages
  25 |     await expect(page.locator('text=Email is required')).toBeVisible();
  26 |     await expect(page.locator('text=Password is required')).toBeVisible();
  27 |   });
  28 |
  29 |   test('should logout successfully', async ({ page }) => {
  30 |     await loginAsAdmin(page);
  31 |     await logout(page);
  32 |     
  33 |     // Verify protected route access is blocked
  34 |     await page.goto('/dashboard');
  35 |     await expect(page).toHaveURL('/login');
  36 |   });
  37 |
  38 |   test('should handle session expiry', async ({ page }) => {
  39 |     await loginAsAdmin(page);
  40 |     await clearAuthState(page);
  41 |
  42 |     // Try to access protected route
  43 |     await page.goto('/dashboard');
  44 |     await expect(page).toHaveURL('/login');
  45 |   });
  46 |
  47 |   test('should maintain auth state across navigation', async ({ page }) => {
  48 |     await loginAsAdmin(page);
  49 |
  50 |     // Navigate through protected routes
  51 |     await page.click('text=Analytics');
  52 |     await expect(page).toHaveURL('/dashboard/analytics');
  53 |     
  54 |     await page.click('text=Settings');
  55 |     await expect(page).toHaveURL('/dashboard/settings');
  56 |     
  57 |     // Verify still logged in
  58 |     await expect(page.locator('button[aria-label="Open user menu"]')).toBeVisible();
  59 |   });
  60 | }); 
```