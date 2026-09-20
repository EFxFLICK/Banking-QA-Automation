import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { bankingTestData } from '../../test-data/banking-test-data';


test.describe('Security - Session Handling', () => {
  test('should terminate the authenticated session after logout', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login(
      bankingTestData.user.username,
      bankingTestData.user.password
    );

    await expect(page).toHaveURL(/.*overview\.htm/);
    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).toBeVisible();

    await accountsOverviewPage.clickLogout();

    await expect(page).not.toHaveURL(/.*overview\.htm/);

    await expect(
      page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Accounts Overview' })
    ).not.toBeVisible();
  });
});