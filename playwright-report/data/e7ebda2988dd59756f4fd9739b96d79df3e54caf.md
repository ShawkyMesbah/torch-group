# Test info

- Name: Visual Regression Tests >> services page should match snapshot
- Location: C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:25:7

# Error details

```
Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)

  Failed to take two consecutive stable screenshots.
Previous: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-437f6--page-should-match-snapshot-mobile\services-previous.png
Received: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-437f6--page-should-match-snapshot-mobile\services-actual.png
    Diff: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-437f6--page-should-match-snapshot-mobile\services-diff.png

Call log:
  - expect.toHaveScreenshot(services.png) with timeout 5000ms
    - generating new stable screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 2791px, received 1280px by 720px. 916145 pixels (ratio 0.26 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 5134 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Timeout 5000ms exceeded.

    at C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:27:24
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
  - main:
    - heading "Our Services" [level=1]
    - paragraph: Comprehensive digital solutions tailored to your business needs
    - heading "Our Core Services" [level=2]
    - paragraph: We offer a range of specialized services to help businesses grow their digital presence and reach their target audience.
    - img "Media Press"
    - heading "Media Press" [level=3]
    - paragraph: Our digital marketing services will help your business grow online and attract more customers through strategic campaigns and content.
    - list:
      - listitem: • Content marketing and distribution
      - listitem: • Public relations and media outreach
      - listitem: • Press release writing and publishing
    - img "Talent Support"
    - heading "Talent Support" [level=3]
    - paragraph: Strategic marketing campaigns to grow your brand presence and reach your target audience effectively.
    - list:
      - listitem: • Influencer partnerships and management
      - listitem: • Talent discovery and development
      - listitem: • Brand ambassador programs
    - img "Marketing Systems"
    - heading "Marketing Systems" [level=3]
    - paragraph: Connect with the best professionals in the industry to scale your team effectively and achieve your business goals.
    - list:
      - listitem: • Marketing automation and CRM setup
      - listitem: • Lead generation and nurturing systems
      - listitem: • Analytics and reporting systems
    - heading "Additional Services" [level=2]
    - paragraph: Beyond our core offerings, we provide specialized services to complement your digital strategy.
    - heading "AI Integration" [level=3]
    - paragraph: Leverage artificial intelligence to enhance your business processes and customer experiences.
    - heading "Web Development" [level=3]
    - paragraph: Custom website development using the latest technologies to create engaging user experiences.
    - heading "Mobile Apps" [level=3]
    - paragraph: Native and cross-platform mobile application development to reach your audience on any device.
    - heading "Performance Optimization" [level=3]
    - paragraph: Speed up your digital platforms and improve conversion rates through data-driven optimization.
    - heading "Our Process" [level=2]
    - paragraph: We follow a proven methodology to deliver exceptional results for our clients.
    - text: "1"
    - heading "Discovery" [level=3]
    - paragraph: We start by understanding your business, goals, and challenges to develop a tailored strategy.
    - text: "2"
    - heading "Strategy" [level=3]
    - paragraph: Based on our findings, we create a comprehensive strategy to achieve your specific objectives.
    - text: "3"
    - heading "Implementation" [level=3]
    - paragraph: Our expert team executes the strategy with precision, keeping you informed throughout the process.
    - text: "4"
    - heading "Optimization" [level=3]
    - paragraph: We continuously monitor, analyze, and refine our approach to maximize your results and ROI.
    - heading "Ready to elevate your digital presence?" [level=2]
    - paragraph: Contact us today to discuss how our services can help your business reach new heights.
    - link "Get in touch":
      - /url: /contact
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
> 27 |     await expect(page).toHaveScreenshot('services.png', {
     |                        ^ Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)
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
  66 |     await expect(page).toHaveScreenshot('dashboard.png', {
  67 |       fullPage: true,
  68 |       threshold: 0.2,
  69 |     });
  70 |   });
  71 | }); 
```