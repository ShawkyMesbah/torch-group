import { test, expect } from '@playwright/test';

// Device-specific test configurations
const deviceTests = [
  {
    name: 'Extra Small Phone',
    viewport: { width: 320, height: 568 },
    expectations: {
      logoSize: { width: 80, height: 80 },
      heroFontSize: '1.5rem',
      buttonWidth: '95%',
      containerPadding: '0.5rem',
    }
  },
  {
    name: 'Small Phone',
    viewport: { width: 375, height: 667 },
    expectations: {
      logoSize: { width: 120, height: 120 },
      heroFontSize: '2rem',
      buttonWidth: '85%',
      containerPadding: '1rem',
    }
  },
  {
    name: 'Large Phone',
    viewport: { width: 414, height: 896 },
    expectations: {
      logoSize: { width: 120, height: 120 },
      heroFontSize: '2rem',
      buttonWidth: '85%',
      containerPadding: '1rem',
    }
  },
  {
    name: 'Small Tablet',
    viewport: { width: 768, height: 1024 },
    expectations: {
      logoSize: { width: 160, height: 160 },
      heroFontSize: '2.5rem',
      containerPadding: '1.5rem',
    }
  },
  {
    name: 'Large Tablet',
    viewport: { width: 1024, height: 1366 },
    expectations: {
      logoSize: { width: 200, height: 200 },
      heroFontSize: '3.5rem',
      containerPadding: '2rem',
    }
  },
  {
    name: 'Small Desktop',
    viewport: { width: 1280, height: 720 },
    expectations: {
      logoSize: { width: 300, height: 300 },
      containerPadding: '2rem',
    }
  },
  {
    name: 'Large Desktop',
    viewport: { width: 1920, height: 1080 },
    expectations: {
      logoSize: { width: 300, height: 300 },
      containerPadding: '3rem',
    }
  },
  {
    name: '4K Desktop',
    viewport: { width: 3840, height: 2160 },
    expectations: {
      logoSize: { width: 350, height: 350 },
      heroFontSize: '6rem',
      containerPadding: '4rem',
    }
  }
];

test.describe('Device Customization Tests', () => {
  deviceTests.forEach(({ name, viewport, expectations }) => {
    test.describe(`${name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should display hero section correctly', async ({ page }) => {
        // Check logo sizing
        const logo = page.locator('[alt="Torch Logo"]');
        await expect(logo).toBeVisible();
        
        if (expectations.logoSize) {
          const logoBox = await logo.boundingBox();
          expect(logoBox?.width).toBeCloseTo(expectations.logoSize.width, 20);
          expect(logoBox?.height).toBeCloseTo(expectations.logoSize.height, 20);
        }

        // Check hero heading
        const heroHeading = page.locator('.hero-heading');
        await expect(heroHeading).toBeVisible();
        
        if (expectations.heroFontSize) {
          const fontSize = await heroHeading.evaluate(el => 
            window.getComputedStyle(el).fontSize
          );
          expect(fontSize).toBe(expectations.heroFontSize);
        }

        // Check button sizing on mobile
        if (expectations.buttonWidth) {
          const heroButton = page.locator('.hero-button').first();
          await expect(heroButton).toBeVisible();
          
          const buttonBox = await heroButton.boundingBox();
          const viewportWidth = viewport.width;
          const expectedWidth = viewportWidth * (parseFloat(expectations.buttonWidth) / 100);
          
          expect(buttonBox?.width).toBeCloseTo(expectedWidth, 30);
        }
      });

      test('should have proper spacing and layout', async ({ page }) => {
        // Check container padding
        const container = page.locator('.container').first();
        if (container && expectations.containerPadding) {
          const paddingLeft = await container.evaluate(el => 
            window.getComputedStyle(el).paddingLeft
          );
          expect(paddingLeft).toBe(expectations.containerPadding);
        }

        // Check section spacing
        const sections = page.locator('section');
        const sectionCount = await sections.count();
        expect(sectionCount).toBeGreaterThan(3);
      });

      test('should display navigation correctly', async ({ page }) => {
        if (viewport.width <= 768) {
          // Mobile navigation
          const mobileMenuButton = page.locator('[aria-label*="menu"]');
          if (await mobileMenuButton.count() > 0) {
            await expect(mobileMenuButton).toBeVisible();
          }
        } else {
          // Desktop navigation
          const desktopNav = page.locator('nav');
          await expect(desktopNav).toBeVisible();
        }
      });

      test('should display grids responsively', async ({ page }) => {
        // Services grid
        await page.locator('#services').scrollIntoViewIfNeeded();
        const servicesGrid = page.locator('#services .grid');
        await expect(servicesGrid).toBeVisible();

        // Torch Group brands grid
        await page.locator('#torch-group').scrollIntoViewIfNeeded();
        const brandsGrid = page.locator('#torch-group .grid');
        await expect(brandsGrid).toBeVisible();

        // Blog grid
        await page.locator('#blog').scrollIntoViewIfNeeded();
        const blogGrid = page.locator('#blog .grid');
        await expect(blogGrid).toBeVisible();
      });

      test('should display contact form correctly', async ({ page }) => {
        await page.locator('#contact').scrollIntoViewIfNeeded();
        
        const contactForm = page.locator('[data-testid="contact-form"]');
        await expect(contactForm).toBeVisible();

        // Check form inputs are appropriately sized
        const inputs = contactForm.locator('input[type="text"], input[type="email"], textarea');
        const inputCount = await inputs.count();
        
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          await expect(input).toBeVisible();
          
          if (viewport.width <= 640) {
            // Mobile: check touch-friendly sizing
            const inputBox = await input.boundingBox();
            expect(inputBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
          }
        }

        // Check submit button
        const submitButton = contactForm.locator('button[type="submit"]');
        await expect(submitButton).toBeVisible();
        
        if (viewport.width <= 640) {
          const buttonBox = await submitButton.boundingBox();
          expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Touch-friendly
        }
      });

      test('should handle typography scaling', async ({ page }) => {
        // Check various text elements scale appropriately
        const headings = page.locator('h1, h2, h3');
        const headingCount = await headings.count();
        
        for (let i = 0; i < Math.min(headingCount, 5); i++) {
          const heading = headings.nth(i);
          await expect(heading).toBeVisible();
          
          const fontSize = await heading.evaluate(el => 
            parseFloat(window.getComputedStyle(el).fontSize)
          );
          
          // Ensure font sizes are reasonable for the viewport
          if (viewport.width <= 375) {
            expect(fontSize).toBeLessThanOrEqual(48); // Max size for small screens
          } else if (viewport.width >= 1920) {
            expect(fontSize).toBeGreaterThanOrEqual(16); // Min size for large screens
          }
        }
      });

      test('should maintain accessibility standards', async ({ page }) => {
        // Check color contrast (basic check)
        const body = page.locator('body');
        const bgColor = await body.evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).toBeTruthy();

        // Check focus indicators on interactive elements
        const buttons = page.locator('button, a[href]');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          const firstButton = buttons.first();
          await firstButton.focus();
          
          const outline = await firstButton.evaluate(el => 
            window.getComputedStyle(el).outline
          );
                     // Should have some form of focus indicator
           expect(outline !== 'none' && outline !== '').toBeTruthy();
        }
      });
    });
  });

  test.describe('Touch Device Optimizations', () => {
    test('should have touch-friendly elements on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check all interactive elements meet minimum touch target size (44px)
      const interactiveElements = page.locator('button, a[href], input, select, textarea');
      const count = await interactiveElements.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(box.width).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    test('should prevent zoom on form inputs (iOS)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/contact');

      const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const fontSize = await input.evaluate(el => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        
        // Font size should be at least 16px to prevent zoom on iOS
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
    });
  });

  test.describe('High DPI Display Optimizations', () => {
    test('should render crisp images on retina displays', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const logo = page.locator('[alt="Torch Logo"]');
      await expect(logo).toBeVisible();

      // Check image rendering properties
      const imageRendering = await logo.evaluate(el => 
        window.getComputedStyle(el).imageRendering
      );
      
      // Should have optimized rendering for high DPI
      expect(['crisp-edges', '-webkit-optimize-contrast', 'auto'].includes(imageRendering)).toBeTruthy();
    });
  });

  test.describe('Landscape Orientation', () => {
    test('should adapt to landscape orientation on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 844, height: 390 }); // iPhone 13 landscape
      await page.goto('/');

      // Hero section should adapt to landscape
      const heroSection = page.locator('#hero');
      await expect(heroSection).toBeVisible();

             const heroHeight = await heroSection.evaluate(el => (el as HTMLElement).offsetHeight);
      expect(heroHeight).toBeLessThan(500); // Should be compact in landscape
    });
  });

  test.describe('Performance on Different Devices', () => {
    test('should load quickly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load within reasonable time on mobile
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
        await route.continue();
      });

      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Should still be functional even with delays
      const logo = page.locator('[alt="Torch Logo"]');
      await expect(logo).toBeVisible({ timeout: 10000 });
    });
  });
}); 