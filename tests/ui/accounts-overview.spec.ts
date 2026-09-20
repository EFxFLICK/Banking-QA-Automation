import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';

test.describe('Accounts Overview', () => {
  test('should display the customer accounts after login', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login('john', 'demo');

    await accountsOverviewPage.expectPageVisible();

    await accountsOverviewPage.expectAccountVisible(54321);
    await accountsOverviewPage.expectAccountVisible(13122);
  });
});
