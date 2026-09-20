import { test } from '../../fixtures/api.fixture';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { AccountDetailsPage } from '../../pages/account-details-page';
import { bankingTestData } from '../../test-data/banking-test-data';


test.describe('Account Details', () => {
  test('should display account details and transaction table', async ({
    page,
    accountService
  }) => {
    const accountId = bankingTestData.accounts.source;

    const account = await accountService.getAccountData(accountId);

    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);
    const accountDetailsPage = new AccountDetailsPage(page);

    await loginPage.goto();
    await loginPage.login(
      bankingTestData.user.username,
      bankingTestData.user.password
    );

    await accountsOverviewPage.clickAccount(accountId);

    await accountDetailsPage.expectPageVisible();
    await accountDetailsPage.expectAccountNumberVisible(accountId);
    await accountDetailsPage.expectAccountTypeVisible(account.type);
    await accountDetailsPage.expectBalanceVisible(account.balance);
    await accountDetailsPage.expectAvailableAmountVisible(account.balance);
    await accountDetailsPage.expectTransactionTableVisible();
  });
});