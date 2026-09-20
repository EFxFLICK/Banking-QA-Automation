import { test, expect } from '@playwright/test';

test.describe('Security - Unauthorized Access', () => {
  test('should not expose account overview to an unauthenticated user', async ({
    page
  }) => {
    const response = await page.goto('/parabank/overview.htm');

    expect(response?.status()).toBe(500);

    await expect(page).toHaveTitle('ParaBank | Error');

    await expect(
      page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).not.toBeVisible();
  });
});