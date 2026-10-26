import { defineConfig } from '@playwright/test';

const webkitLaunch = process.env.WEBKIT_EXECUTABLE ? { executablePath: process.env.WEBKIT_EXECUTABLE } : {};

export default defineConfig({
    testDir: './tests/browser',
    fullyParallel: true,
    workers: process.env.CI ? 2 : undefined,
    timeout: 30000,
    use: { baseURL: 'http://127.0.0.1:18795', viewport: { width: 1280, height: 900 } },
    webServer: {
        command: 'python3 -m http.server 18795 --bind 127.0.0.1 --directory public',
        url: 'http://127.0.0.1:18795',
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit', launchOptions: webkitLaunch } },
        { name: 'legacy-ios-apis', use: { browserName: 'webkit', launchOptions: webkitLaunch, hasTouch: true } },
    ],
});
