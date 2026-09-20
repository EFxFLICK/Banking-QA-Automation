import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Security - Empty Credentials', () => {
  test('should not authenticate with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('', '');

    await expect(page).not.toHaveURL(/.*overview\.htm/);

    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).not.toBeVisible();

    await expect(
      page.locator('input[name="username"]')
    ).toBeVisible();
  });
});