import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Flow', () => {
  test('redirects unauthenticated user from protected routes to landing or login', async ({ page }) => {
    await page.goto('/dashboard');
    // Unauthenticated user should be redirected to login page or landing
    await expect(page).toHaveURL(/\/(login)?$/);
  });

  test('renders login page with input fields and sign up link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('Username or Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Log In to NIVO/i })).toBeVisible();

    // Click Sign Up link
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/register');
  });
});
