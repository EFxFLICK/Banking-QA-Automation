import { test, expect } from '../../fixtures/api.fixture';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { TransferFundsPage } from '../../pages/transfer-funds-page';
import { bankingTestData } from '../../test-data/banking-test-data';

test.describe.configure({ mode: 'serial' });

test.describe('Transfer Funds', () => {
  test('should transfer money between existing accounts', async ({
    page,
    accountService
  }) => {
    const fromAccountId = bankingTestData.accounts.source;
    const toAccountId = bankingTestData.accounts.destination;
    const transferAmount = bankingTestData.transfer.standardAmount;

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
    await loginPage.login(
  bankingTestData.user.username,
  bankingTestData.user.password
);

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
  await loginPage.login(
  bankingTestData.user.username,
  bankingTestData.user.password
);

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(
    bankingTestData.accounts.source,
    bankingTestData.accounts.destination,
    bankingTestData.transfer.emptyAmount
  );

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
  await loginPage.login(
  bankingTestData.user.username,
  bankingTestData.user.password
);

  await accountsOverviewPage.clickTransferFunds();
  await transferFundsPage.expectPageVisible();

  await transferFundsPage.transfer(
    bankingTestData.accounts.source,
    bankingTestData.accounts.destination,
    bankingTestData.transfer.invalidFormat
  );

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

  const fromAccountId = bankingTestData.accounts.source;
  const toAccountId = bankingTestData.accounts.destination;
  const transferAmount = bankingTestData.transfer.zeroAmount;

  await loginPage.goto();
  await loginPage.login(
  bankingTestData.user.username,
  bankingTestData.user.password
);

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

  const fromAccountId = bankingTestData.accounts.source;
  const toAccountId = bankingTestData.accounts.destination;
  const transferAmount = bankingTestData.transfer.negativeAmount;
  await loginPage.goto();
  await loginPage.login(
  bankingTestData.user.username,
  bankingTestData.user.password
);

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