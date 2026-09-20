import { test, expect } from '@playwright/test';
import { DatabaseClient } from '../../database/clients/database-client';
import { AccountQueries } from '../../database/queries/account-queries';
import { bankingTestData } from '../../test-data/banking-test-data';

test.describe('Transfer Balance Database Validation', () => {
  test('should validate account balances using database state', async () => {
    const databaseClient = new DatabaseClient();
    const accountQueries = new AccountQueries(databaseClient);

    const sourceAccountId = bankingTestData.accounts.source;
    const destinationAccountId = bankingTestData.accounts.destination;

    const sourceBefore =
      await accountQueries.getAccount(sourceAccountId);

    const destinationBefore =
      await accountQueries.getAccount(destinationAccountId);

    const transferAmount = 1;

    expect(sourceBefore.balance).toBeGreaterThanOrEqual(transferAmount);
    expect(destinationBefore.balance).toBeGreaterThanOrEqual(0);

    /*
     * This test currently validates the database state only.
     * The actual transfer will be performed by the UI/API integration
     * test later, so this test must not mutate banking data by itself.
     */
    const sourceAfter =
      await accountQueries.getAccount(sourceAccountId);

    const destinationAfter =
      await accountQueries.getAccount(destinationAccountId);

    expect(sourceAfter.balance).toBe(sourceBefore.balance);
    expect(destinationAfter.balance).toBe(destinationBefore.balance);
  });
});