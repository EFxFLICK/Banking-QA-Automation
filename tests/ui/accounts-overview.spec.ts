import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { bankingTestData } from '../../test-data/banking-test-data';


test.describe('Accounts Overview', () => {
  test('should display the customer accounts after login', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login(
      bankingTestData.user.username,
      bankingTestData.user.password
    );

    await accountsOverviewPage.expectPageVisible();

    await accountsOverviewPage.expectAccountVisible(
      bankingTestData.accounts.source
    );

    await accountsOverviewPage.expectAccountVisible(
     bankingTestData.accounts.destination
    );
  });
});
