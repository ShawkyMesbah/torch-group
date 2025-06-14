# Test info

- Name: Services Form >> should handle API error on submission
- Location: C:\Users\shmes\Desktop\torch-group\e2e\services.spec.ts:23:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/name/i)

    at C:\Users\shmes\Desktop\torch-group\e2e\services.spec.ts:25:36
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
   3 | test.describe('Services Form', () => {
   4 |   test('should submit services form successfully', async ({ page }) => {
   5 |     await page.goto('/services');
   6 |     await page.getByLabel(/name/i).fill('Test User');
   7 |     await page.getByLabel(/email/i).fill('test@example.com');
   8 |     await page.getByLabel(/service/i).selectOption('consulting');
   9 |     await page.getByLabel(/message/i).fill('I need help with my project.');
  10 |     await page.getByRole('button', { name: /submit/i }).click();
  11 |     await expect(page.getByText(/request received/i)).toBeVisible();
  12 |   });
  13 |
  14 |   test('should show validation errors', async ({ page }) => {
  15 |     await page.goto('/services');
  16 |     await page.getByRole('button', { name: /submit/i }).click();
  17 |     await expect(page.getByText(/name is required/i)).toBeVisible();
  18 |     await expect(page.getByText(/email is required/i)).toBeVisible();
  19 |     await expect(page.getByText(/service is required/i)).toBeVisible();
  20 |     await expect(page.getByText(/message is required/i)).toBeVisible();
  21 |   });
  22 |
  23 |   test('should handle API error on submission', async ({ page }) => {
  24 |     await page.goto('/services');
> 25 |     await page.getByLabel(/name/i).fill('Test User');
     |                                    ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  26 |     await page.getByLabel(/email/i).fill('test@example.com');
  27 |     await page.getByLabel(/service/i).selectOption('consulting');
  28 |     await page.getByLabel(/message/i).fill('I need help with my project.');
  29 |     await page.route('/api/services', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
  30 |     await page.getByRole('button', { name: /submit/i }).click();
  31 |     await expect(page.getByText(/error/i)).toBeVisible();
  32 |   });
  33 | }); 
```