import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { AccountDetailsPage } from '../../pages/account-details-page';

test.describe('Account Details', () => {
  test('should display account details and transaction table', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);
    const accountDetailsPage = new AccountDetailsPage(page);

    await loginPage.goto();
    await loginPage.login('john', 'demo');

    await accountsOverviewPage.clickAccount(54321);

    await accountDetailsPage.expectPageVisible();
    await accountDetailsPage.expectAccountNumberVisible(54321);
    await accountDetailsPage.expectAccountTypeVisible('CHECKING');
    await accountDetailsPage.expectBalanceVisible(1340.12);
    await accountDetailsPage.expectAvailableAmountVisible(1340.12);
    await accountDetailsPage.expectTransactionTableVisible();
  });
});