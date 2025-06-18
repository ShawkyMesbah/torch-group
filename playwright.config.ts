import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile devices - iOS
    {
      name: 'iphone-13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'iphone-13-pro',
      use: { ...devices['iPhone 13 Pro'] },
    },
    {
      name: 'iphone-13-pro-max',
      use: { ...devices['iPhone 13 Pro Max'] },
    },
    {
      name: 'iphone-se',
      use: { ...devices['iPhone SE'] },
    },

    // Mobile devices - Android
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'galaxy-s21',
      use: { ...devices['Galaxy S21'] },
    },
    {
      name: 'galaxy-s21-ultra',
      use: { ...devices['Galaxy S21 Ultra'] },
    },

    // Tablets
    {
      name: 'ipad',
      use: { ...devices['iPad'] },
    },
    {
      name: 'ipad-pro',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'ipad-mini',
      use: { ...devices['iPad Mini'] },
    },

    // Custom device sizes for comprehensive testing
    {
      name: 'extra-small-phone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 320, height: 568 }, // iPhone 5/SE size
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'large-phone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 414, height: 896 }, // iPhone 11 Pro Max size
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'small-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 }, // iPad Mini size
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'large-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 1366 }, // iPad Pro 12.9" size
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'small-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }, // HD resolution
      },
    },
    {
      name: 'large-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // Full HD
      },
    },
    {
      name: 'ultrawide-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 }, // 2K ultrawide
      },
    },
    {
      name: '4k-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 }, // 4K resolution
        deviceScaleFactor: 2,
      },
    },

    // Accessibility testing configurations
    {
      name: 'high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        extraHTTPHeaders: {
          'prefers-contrast': 'high',
        },
      },
    },
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'prefers-reduced-motion': 'reduce',
        },
      },
    },

    // Landscape orientation testing
    {
      name: 'phone-landscape',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 844, height: 390 }, // iPhone 13 landscape
      },
    },
    {
      name: 'tablet-landscape',
      use: {
        ...devices['iPad'],
        viewport: { width: 1024, height: 768 }, // iPad landscape
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
}); 