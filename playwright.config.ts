import { defineConfig, devices } from '@playwright/test'

// Phone-sized run of the app (390px wide, like the plan asks). Set
// PW_CHROMIUM_PATH to use an already installed Chromium instead of
// `npx playwright install chromium`.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: 'mobile-chromium' }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
