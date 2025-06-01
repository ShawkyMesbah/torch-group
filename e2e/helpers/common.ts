import { Page, expect } from '@playwright/test';

export async function waitForToast(page: Page, text: string) {
  await expect(page.locator('[role="status"]')).toContainText(text);
}

export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [name, value] of Object.entries(fields)) {
    await page.fill(`[name="${name}"]`, value);
  }
}

export async function uploadFile(page: Page, selector: string, filePath: string) {
  const fileInput = page.locator(selector);
  await fileInput.setInputFiles(filePath);
}

export async function interceptAPI(page: Page, url: string, response: any) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(response)
    });
  });
}

export async function simulateError(page: Page, url: string, status = 500) {
  await page.route(url, (route) => {
    route.fulfill({
      status,
      body: JSON.stringify({ error: 'Internal server error' })
    });
  });
}

export async function checkAccessibility(page: Page) {
  // Add axe-core for accessibility testing
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  });

  // Run accessibility tests
  const violations = await page.evaluate(() => {
    return new Promise((resolve) => {
      // @ts-ignore
      window.axe.run((err: any, results: any) => {
        if (err) throw err;
        resolve(results.violations);
      });
    });
  });

  return violations;
}

export async function mockNetworkConditions(page: Page, options: { offline?: boolean; latency?: number }) {
  if (options.offline) {
    await page.route('**/*', route => route.abort());
  }
  if (options.latency) {
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, options.latency));
      route.continue();
    });
  }
}

export async function clearData(page: Page) {
  await page.evaluate(() => {
    indexedDB.deleteDatabase('analytics-store');
    localStorage.clear();
    sessionStorage.clear();
  });
}

export async function checkPerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const navigation = performance.getEntriesByType('navigation')[0];
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    
    return {
      fcp: fcp?.startTime,
      // @ts-ignore
      lcp: navigation?.largestContentfulPaint,
      // @ts-ignore
      fid: navigation?.firstInputDelay,
      // @ts-ignore
      cls: navigation?.cumulativeLayoutShift
    };
  });

  return metrics;
}

export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}

export const TEST_DATA = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
  },
  blog: {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is a test blog post content.',
  },
  files: {
    image: {
      name: 'test-image.jpg',
      type: 'image/jpeg',
      content: Buffer.from('fake image data'),
    },
    pdf: {
      name: 'test-doc.pdf',
      type: 'application/pdf',
      content: Buffer.from('fake pdf data'),
    },
  },
}; 