import { test, expect } from '../../fixtures/api.fixture';
import { LoginPage } from '../../pages/login-page';
import { AccountsOverviewPage } from '../../pages/accounts-overview-page';
import { TransferFundsPage } from '../../pages/transfer-funds-page';
import { DatabaseClient } from '../../database/clients/database-client';
import { AccountQueries } from '../../database/queries/account-queries';
import { TransactionQueries } from '../../database/queries/transaction-queries';
import { bankingTestData } from '../../test-data/banking-test-data';

test.describe.configure({ mode: 'serial' });

test.describe('Banking Transfer UI API DB Integration', () => {
  test('should validate a transfer across UI, API and database', async ({
    page,
    accountService
  }) => {
    const sourceAccountId = bankingTestData.accounts.source;
    const destinationAccountId = bankingTestData.accounts.destination;
    const transferAmount = bankingTestData.transfer.standardAmount;

    const databaseClient = new DatabaseClient();
    const accountQueries = new AccountQueries(databaseClient);
    const transactionQueries = new TransactionQueries(databaseClient);

    // Arrange: capture initial database state
    const sourceBefore =
      await accountQueries.getAccount(sourceAccountId);

    const sourceTransactionBefore =
      await transactionQueries.getLatestTransferSent(sourceAccountId);

    const destinationTransactionBefore =
      await transactionQueries.getLatestTransferReceived(
        destinationAccountId
      );

    const destinationBefore =
      await accountQueries.getAccount(destinationAccountId);

    expect(sourceBefore.balance).toBeGreaterThanOrEqual(
      transferAmount
    );

    // Act: perform the transfer through the UI
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
      sourceAccountId,
      destinationAccountId,
      transferAmount
    );

    await transferFundsPage.expectTransferComplete(
      transferAmount,
      sourceAccountId,
      destinationAccountId
    );

    // Assert: database balance state
    const sourceAfter =
      await accountQueries.getAccount(sourceAccountId);

    const destinationAfter =
      await accountQueries.getAccount(destinationAccountId);

    expect(sourceAfter.balance).toBeCloseTo(
      sourceBefore.balance - transferAmount,
      2
    );

    expect(destinationAfter.balance).toBeCloseTo(
      destinationBefore.balance + transferAmount,
      2
    );

    // Assert: database transaction state
    const sentTransaction =
      await transactionQueries.getLatestTransferSent(
        sourceAccountId
      );

    const receivedTransaction =
      await transactionQueries.getLatestTransferReceived(
        destinationAccountId
      );

    expect(sentTransaction.id).toBeGreaterThan(
      sourceTransactionBefore.id
    );

    expect(receivedTransaction.id).toBeGreaterThan(
      destinationTransactionBefore.id
    );

    expect(sentTransaction.accountId).toBe(sourceAccountId);
    expect(sentTransaction.type).toBe(1);
    expect(sentTransaction.amount).toBe(transferAmount);
    expect(sentTransaction.description).toBe(
      'Funds Transfer Sent'
    );

    expect(receivedTransaction.accountId).toBe(
      destinationAccountId
    );
    expect(receivedTransaction.type).toBe(0);
    expect(receivedTransaction.amount).toBe(transferAmount);
    expect(receivedTransaction.description).toBe(
      'Funds Transfer Received'
    );

    // Assert: API independently reflects the final account state
    const sourceApiAccount =
      await accountService.getAccountData(sourceAccountId);

    const destinationApiAccount =
      await accountService.getAccountData(destinationAccountId);

    expect(sourceApiAccount.balance).toBeCloseTo(
      sourceAfter.balance,
      2
    );

    expect(destinationApiAccount.balance).toBeCloseTo(
      destinationAfter.balance,
      2
    );
  });
});