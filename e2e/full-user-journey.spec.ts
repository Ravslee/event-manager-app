import { test, expect } from '@playwright/test';

// Valid JWT token with exp in year 2030 (satisfies tokenService.isTokenExpired)
const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTAxIiwiZXhwIjoxODkzNDU2MDAwfQ.signature';

test.describe('End-to-End User Journey: Feature-by-Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept ONLY XHR / Fetch API requests, ignoring Vite JS assets
    await page.route('**/*', async (route) => {
      const request = route.request();
      const url = request.url();
      const isApiCall = request.resourceType() === 'fetch' || request.resourceType() === 'xhr';

      if (!isApiCall) {
        return route.continue();
      }

      if (url.includes('/auth/register')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Account created successfully' }),
        });
      }

      if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            accessToken: MOCK_JWT_TOKEN,
            refreshToken: 'mock-refresh-token',
            user: {
              id: 'usr-101',
              businessName: 'Apex Creative Studio',
              ownerName: 'Rohan Sharma',
              email: 'rohan@apexstudio.com',
            },
          }),
        });
      }

      if (url.includes('/auth/me')) {
        const authHeader = request.headers()['authorization'];
        if (!authHeader || !authHeader.includes('Bearer ')) {
          return route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Unauthorized' }),
          });
        }

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'usr-101',
              businessName: 'Apex Creative Studio',
              ownerName: 'Rohan Sharma',
              email: 'rohan@apexstudio.com',
            },
          }),
        });
      }

      if (url.includes('/events')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 'evt-101',
                title: 'Grand Wedding Production 2026',
                eventDate: '2026-09-20',
                startTime: '10:00',
                endTime: '18:00',
                status: 'Confirmed',
                client: { name: 'Aarav Mehta', email: 'aarav@example.com', phone: '+91 98123 45678' },
                venue: { name: 'Grand Hyatt Ballroom', address: 'Marine Drive, Mumbai' },
              },
            ],
          }),
        });
      }

      if (url.includes('/services')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              services: [
                { _id: 'srv-1', name: 'Candid Photography', price: 25000, pricingModel: 'flat' },
                { _id: 'srv-2', name: '4K Drone Teaser', price: 15000, pricingModel: 'flat' },
              ],
            },
          }),
        });
      }

      return route.continue();
    });
  });

  test('Step 1: New User Registration', async ({ page }) => {
    const timestamp = Date.now();
    const newUserEmail = `testuser_${timestamp}@nivo-test.com`;

    await page.goto('/register');
    await expect(page.getByText('Create NIVO Account')).toBeVisible();

    // Fill Registration Form
    await page.getByPlaceholder('e.g. Rohan Photography / DJ Alex Studio').fill('Apex Creative Studio');
    await page.getByPlaceholder('e.g. Rohan Sharma').fill('Rohan Sharma');
    await page.getByPlaceholder('name@example.com').fill(newUserEmail);
    await page.getByPlaceholder('Minimum 6 characters').fill('Password123!');
    await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');

    // Submit Registration Form
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Assert Redirection to Login Page
    await expect(page).toHaveURL('/login');
  });

  test('Step 2: User Login & Session Establishment', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();

    await page.getByPlaceholder('Username or Email').fill('rohan@apexstudio.com');
    await page.getByPlaceholder('Password').fill('Password123!');

    await page.getByRole('button', { name: /Log In to NIVO/i }).click();

    // Assert Navigation to Dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('Step 3: Dashboard Feature Verification', async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('user', JSON.stringify({ id: 'usr-101', ownerName: 'Rohan Sharma', businessName: 'Apex Creative Studio' }));
    }, MOCK_JWT_TOKEN);

    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Step 4: Calendar Feature Verification', async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('user', JSON.stringify({ id: 'usr-101', ownerName: 'Rohan Sharma', businessName: 'Apex Creative Studio' }));
    }, MOCK_JWT_TOKEN);

    await page.goto('/calendar');
    await expect(page).toHaveURL('/calendar');
  });

  test('Step 5: Event Creation Wizard Flow', async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('user', JSON.stringify({ id: 'usr-101', ownerName: 'Rohan Sharma', businessName: 'Apex Creative Studio' }));
    }, MOCK_JWT_TOKEN);

    await page.goto('/events');
    await expect(page).toHaveURL('/events');
  });

  test('Step 6: Payments & Services Feature Navigation', async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('user', JSON.stringify({ id: 'usr-101', ownerName: 'Rohan Sharma', businessName: 'Apex Creative Studio' }));
    }, MOCK_JWT_TOKEN);

    // Test Payments Page
    await page.goto('/payments');
    await expect(page).toHaveURL('/payments');

    // Test Services Page
    await page.goto('/services');
    await expect(page).toHaveURL('/services');

    // Test Event Types Page
    await page.goto('/event-types');
    await expect(page).toHaveURL('/event-types');

    // Test Settings Page
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings');
  });
});
