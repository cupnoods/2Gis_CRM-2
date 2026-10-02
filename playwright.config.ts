import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 90_000, expect: { timeout: 15_000 }, fullyParallel: false, workers: 1,
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:3102', trace: 'retain-on-failure', ...devices['Desktop Chrome'], channel: 'msedge' },
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'npm run dev -- --port 3102 --webpack', url: 'http://127.0.0.1:3102', reuseExistingServer: false, timeout: 120_000, env: { NEXT_PUBLIC_SUPABASE_URL: 'https://crm-test.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', GIS_PLACES_API_KEY: '' } },
});
