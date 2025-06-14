# Test info

- Name: Simple Demo Form >> should submit simple form successfully
- Location: C:\Users\shmes\Desktop\torch-group\e2e\simple.spec.ts:10:7

# Error details

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/dashboard" until "load"
============================================================
    at loginAsAdmin (C:\Users\shmes\Desktop\torch-group\e2e\helpers\auth.ts:8:14)
    at C:\Users\shmes\Desktop\torch-group\e2e\simple.spec.ts:6:5
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
  - heading "Welcome back" [level=1]
  - paragraph: Enter your credentials to sign in to your account
  - text: Email
  - textbox "Email": admin@torchgroup.co
  - text: Password
  - textbox "Password": admin123
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
   1 | import { Page } from '@playwright/test';
   2 |
   3 | export async function loginAsAdmin(page: Page) {
   4 |   await page.goto('/login');
   5 |   await page.fill('input[name="email"]', 'admin@torchgroup.co');
   6 |   await page.fill('input[name="password"]', 'admin123');
   7 |   await page.click('button[type="submit"]');
>  8 |   await page.waitForURL('/dashboard');
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
   9 | }
  10 |
  11 | export async function loginAsUser(page: Page, email: string, password: string) {
  12 |   await page.goto('/login');
  13 |   await page.fill('input[name="email"]', email);
  14 |   await page.fill('input[name="password"]', password);
  15 |   await page.click('button[type="submit"]');
  16 | }
  17 |
  18 | export async function logout(page: Page) {
  19 |   await page.click('button[aria-label="Open user menu"]');
  20 |   await page.click('text=Logout');
  21 |   await page.waitForURL('/login');
  22 | }
  23 |
  24 | export async function clearAuthState(page: Page) {
  25 |   await page.evaluate(() => {
  26 |     window.localStorage.clear();
  27 |     window.sessionStorage.clear();
  28 |     document.cookie.split(";").forEach((c) => {
  29 |       document.cookie = c
  30 |         .replace(/^ +/, "")
  31 |         .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  32 |     });
  33 |   });
  34 | } 
```