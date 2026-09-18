import { test, expect } from '../../fixtures/api.fixture';
import { SchemaValidator } from '../../utils/schema-validator';
import { transactionSchema } from '../../schemas/transaction.schema';
import { transactionListSchema } from '../../schemas/transaction-list.schema';

test.describe('Transaction API', () => {
  test('should retrieve transactions for an existing account', async ({
    transactionService
  }) => {

    const response = await transactionService.getTransactions(54321);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const transactions = await response.json();

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);

    const schemaValidator: SchemaValidator = new SchemaValidator();

      schemaValidator.assertValid(
      transactionListSchema,
      transactions
    );

    for (const transaction of transactions) {
      expect(transaction.accountId).toBe(54321);
    }
  });

  test('should return typed transaction models', async ({ transactionService }) => {

  const transactions =
    await transactionService.getTransactionData(54321);

  expect(transactions.length).toBeGreaterThan(0);

  for (const transaction of transactions) {
    expect(transaction.accountId).toBe(54321);
    expect(typeof transaction.id).toBe('number');
    expect(typeof transaction.type).toBe('string');
    expect(typeof transaction.date).toBe('number');
    expect(typeof transaction.amount).toBe('number');
    expect(typeof transaction.description).toBe('string');
  }
});

test('should reject transactions for a non-existent account', async ({ transactionService }) => {

  const response =
    await transactionService.getTransactions(999999999);

  const responseBody = await response.text();

  expect(response.status()).toBe(400);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(responseBody).toBe(
   'Could not find transactions for account #999999999'
   );
});
});
