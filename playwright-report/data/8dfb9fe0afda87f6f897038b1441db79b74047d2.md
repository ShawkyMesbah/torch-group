# Test info

- Name: Visual Regression Tests >> about page should match snapshot
- Location: C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:17:7

# Error details

```
Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)

  Failed to take two consecutive stable screenshots.
Previous: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-a8932--page-should-match-snapshot-chromium\about-previous.png
Received: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-a8932--page-should-match-snapshot-chromium\about-actual.png
    Diff: C:\Users\shmes\Desktop\torch-group\test-results\visual-regression-Visual-R-a8932--page-should-match-snapshot-chromium\about-diff.png

Call log:
  - expect.toHaveScreenshot(about.png) with timeout 5000ms
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
  - Expected an image 1280px by 3331px, received 1280px by 720px. 3343397 pixels (ratio 0.79 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 4610 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 720px, received 1280px by 3331px. 3468170 pixels (ratio 0.82 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - Timeout 5000ms exceeded.

    at C:\Users\shmes\Desktop\torch-group\e2e\visual-regression.test.ts:19:24
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
    - heading "About Torch Group" [level=1]
    - paragraph: Igniting digital transformation through innovative solutions and strategic partnerships.
    - heading "Our Story" [level=2]
    - paragraph: "Founded in 2015, Torch Group began with a simple vision: to help businesses navigate the increasingly complex digital landscape. What started as a small team of passionate professionals has grown into a full-service digital agency with a global client base."
    - paragraph: "Throughout our journey, we've remained committed to our core values of innovation, excellence, and client success. We've evolved with the changing technological landscape, but our mission has remained constant: to illuminate the path to digital success for our clients."
    - paragraph: Today, we're proud to work with businesses of all sizes, from startups to established enterprises, helping them harness the power of digital to achieve their goals.
    - img "Torch Group Team"
    - heading "Our Core Values" [level=2]
    - heading "Innovation" [level=3]
    - paragraph: We constantly seek new and better ways to solve problems and deliver value. Innovation is at the heart of everything we do.
    - heading "Excellence" [level=3]
    - paragraph: We are committed to excellence in our work, our relationships, and our results. We never settle for 'good enough.'
    - heading "Integrity" [level=3]
    - paragraph: We build trust through honest communication, transparency in our processes, and always doing what's right for our clients.
    - heading "Collaboration" [level=3]
    - paragraph: We believe in the power of teamwork and partnership. We work closely with our clients and each other to achieve shared goals.
    - heading "Adaptability" [level=3]
    - paragraph: We embrace change and are quick to adapt to new technologies, methodologies, and market dynamics.
    - heading "Impact" [level=3]
    - paragraph: We measure our success by the positive impact we create for our clients, their customers, and the broader community.
    - heading "Meet Our Leadership" [level=2]
    - paragraph: Our team of experienced professionals is passionate about driving results and delivering exceptional service to our clients.
    - img "Robert Chen"
    - heading "Robert Chen" [level=3]
    - paragraph: Founder & CEO
    - paragraph: With over 15 years of experience in digital innovation, Robert leads our company with a focus on strategic growth and technological excellence.
    - img "Sarah Johnson"
    - heading "Sarah Johnson" [level=3]
    - paragraph: Chief Operations Officer
    - paragraph: Sarah ensures our operations run smoothly and efficiently, bringing her extensive background in business management to drive operational excellence.
    - img "Michael Lee"
    - heading "Michael Lee" [level=3]
    - paragraph: Chief Technology Officer
    - paragraph: Michael leads our technology strategy, keeping us at the cutting edge of digital innovation and ensuring our solutions are robust and future-proof.
    - img "Emily Martinez"
    - heading "Emily Martinez" [level=3]
    - paragraph: Creative Director
    - paragraph: Emily brings her artistic vision and creative expertise to every project, ensuring our solutions are not only functional but beautifully designed.
    - heading "Ready to transform your digital presence?" [level=2]
    - paragraph: Partner with us to ignite your business growth with innovative digital solutions.
    - link "Get in touch with us":
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
> 19 |     await expect(page).toHaveScreenshot('about.png', {
     |                        ^ Error: Timed out 5000ms waiting for expect(page).toHaveScreenshot(expected)
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
  66 |     await expect(page).toHaveScreenshot('dashboard.png', {
  67 |       fullPage: true,
  68 |       threshold: 0.2,
  69 |     });
  70 |   });
  71 | }); 
```