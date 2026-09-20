import { test, expect } from '@playwright/test';
import { DatabaseClient } from '../../database/clients/database-client';
import { AccountQueries } from '../../database/queries/account-queries';
import { TransactionQueries } from '../../database/queries/transaction-queries';

test.describe('ParaBank Database Queries', () => {
  test('should retrieve an account from the real database', async () => {
    const databaseClient = new DatabaseClient();
    const accountQueries = new AccountQueries(databaseClient);

    const account = await accountQueries.getAccount(54321);

    expect(account.id).toBe(54321);
    expect(account.customerId).toBe(12212);
    expect(account.balance).toBeGreaterThanOrEqual(0);
  });

  test('should retrieve transactions for an account', async () => {
    const databaseClient = new DatabaseClient();
    const transactionQueries = new TransactionQueries(
      databaseClient
    );

    const transactions =
      await transactionQueries.getTransactionsForAccount(54321);

    expect(transactions.length).toBeGreaterThan(0);

    for (const transaction of transactions) {
      expect(transaction.accountId).toBe(54321);
      expect(Number.isInteger(transaction.id)).toBe(true);
      expect(Number.isInteger(transaction.type)).toBe(true);
      expect(Number.isFinite(transaction.amount)).toBe(true);
    }
  });

  test('should retrieve a specific transaction from the database', async () => {
  const databaseClient = new DatabaseClient();
  const transactionQueries = new TransactionQueries(
    databaseClient
  );

  const transactions =
    await transactionQueries.getTransactionsForAccount(54321);

  expect(transactions.length).toBeGreaterThan(0);

  const transactionId = transactions[0].id;

  const transaction =
    await transactionQueries.getTransaction(transactionId);

  expect(transaction.id).toBe(transactionId);
  expect(transaction.accountId).toBe(54321);
  expect(Number.isInteger(transaction.type)).toBe(true);
  expect(Number.isFinite(transaction.amount)).toBe(true);
});

test('should validate transfer transactions for source and destination accounts', async () => {
  const databaseClient = new DatabaseClient();
  const transactionQueries = new TransactionQueries(databaseClient);

  const sourceAccountId = 54321;
  const destinationAccountId = 13122;

  const sentTransaction =
    await transactionQueries.getLatestTransferSent(sourceAccountId);

  const receivedTransaction =
    await transactionQueries.getLatestTransferReceived(
      destinationAccountId
    );

  expect(sentTransaction.accountId).toBe(sourceAccountId);
  expect(sentTransaction.type).toBe(1);
  expect(sentTransaction.description).toBe('Funds Transfer Sent');

  expect(receivedTransaction.accountId).toBe(destinationAccountId);
  expect(receivedTransaction.type).toBe(0);
  expect(receivedTransaction.description).toBe(
    'Funds Transfer Received'
  );

  expect(Number.isFinite(sentTransaction.amount)).toBe(true);
  expect(Number.isFinite(receivedTransaction.amount)).toBe(true);
  expect(sentTransaction.amount).toBe(
    receivedTransaction.amount
  );
});

});