import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E Flow', () => {
  test('renders hero title and get started actions', async ({ page }) => {
    await page.goto('/');

    // Verify NIVO logo or heading
    await expect(page.getByText('NIVO', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Started/i }).first()).toBeVisible();
  });

  test('navigates from landing to register page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Get Started/i }).first().click();
    await expect(page).toHaveURL('/register');
  });
});
