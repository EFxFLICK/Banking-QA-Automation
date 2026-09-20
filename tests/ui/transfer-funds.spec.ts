import { test, expect } from '../../fixtures/api.fixture';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { TransferFundsPage } from '../../pages/transfer-funds-page';

test.describe.configure({ mode: 'serial' });

test.describe('Transfer Funds', () => {
  test('should transfer money between existing accounts', async ({
    page,
    accountService
  }) => {
    const fromAccountId = 54321;
    const toAccountId = 13122;
    const transferAmount = 1;

    const sourceBefore = await accountService.getAccountData(
      fromAccountId
    );

    const destinationBefore = await accountService.getAccountData(
      toAccountId
    );

    const loginPage = new LoginPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);
    const transferFundsPage = new TransferFundsPage(page);

    await loginPage.goto();
    await loginPage.login('john', 'demo');

    await accountsOverviewPage.clickTransferFunds();

    await transferFundsPage.expectPageVisible();

    await transferFundsPage.transfer(
      fromAccountId,
      toAccountId,
      transferAmount
    );

    await transferFundsPage.expectTransferComplete(
      transferAmount,
      fromAccountId,
      toAccountId
    );

    const sourceAfter = await accountService.getAccountData(
      fromAccountId
    );

    const destinationAfter = await accountService.getAccountData(
      toAccountId
    );

    expect(sourceAfter.balance).toBeCloseTo(
      sourceBefore.balance - transferAmount,
      2
    );

    expect(destinationAfter.balance).toBeCloseTo(
      destinationBefore.balance + transferAmount,
      2
    );
  });

  test('should not complete a transfer with an empty amount', async ({
  page
}) => {
  const loginPage = new LoginPage(page);
  const accountsOverviewPage = new AccountsOverviewPage(page);
  const transferFundsPage = new TransferFundsPage(page);

  await loginPage.goto();
  await loginPage.login('john', 'demo');

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(54321, 13122, '');

  await expect(page).not.toHaveURL(/.*overview\.htm/);

  await expect(
    page.getByRole('heading', { name: 'Transfer Complete!' })
  ).not.toBeVisible();
});

test('should not complete a transfer with an invalid amount format', async ({
  page
}) => {
  const loginPage = new LoginPage(page);
  const accountsOverviewPage = new AccountsOverviewPage(page);
  const transferFundsPage = new TransferFundsPage(page);

  await loginPage.goto();
  await loginPage.login('john', 'demo');

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(54321, 13122, 'abc');

  await expect(page).not.toHaveURL(/.*overview\.htm/);

  await expect(
    page.getByRole('heading', { name: 'Transfer Complete!' })
  ).not.toBeVisible();
});

test('should complete a zero-amount transfer according to application behavior', async ({
  page
}) => {
  const loginPage = new LoginPage(page);
  const accountsOverviewPage = new AccountsOverviewPage(page);
  const transferFundsPage = new TransferFundsPage(page);

  const fromAccountId = 54321;
  const toAccountId = 13122;
  const transferAmount = 0;

  await loginPage.goto();
  await loginPage.login('john', 'demo');

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(
    fromAccountId,
    toAccountId,
    transferAmount
  );

  await transferFundsPage.expectTransferComplete(
    transferAmount,
    fromAccountId,
    toAccountId
  );
});

test('should complete a negative-amount transfer according to application behavior', async ({
  page
}) => {
  const loginPage = new LoginPage(page);
  const accountsOverviewPage = new AccountsOverviewPage(page);
  const transferFundsPage = new TransferFundsPage(page);

  const fromAccountId = 54321;
  const toAccountId = 13122;
  const transferAmount = -1;

  await loginPage.goto();
  await loginPage.login('john', 'demo');

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(
    fromAccountId,
    toAccountId,
    transferAmount
  );

  await transferFundsPage.expectTransferComplete(
    transferAmount,
    fromAccountId,
    toAccountId
  );
});

});