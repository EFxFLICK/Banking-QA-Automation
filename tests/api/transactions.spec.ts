import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { TransactionService } from '../../api/services/transaction-service';

test.describe('Transaction API', () => {
  test('should retrieve transactions for an existing account', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const transactionService = new TransactionService(apiClient);

    const response = await transactionService.getTransactions(54321);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const transactions = await response.json();

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);

    for (const transaction of transactions) {
      expect(transaction).toMatchObject({
        accountId: 54321
      });

      expect(typeof transaction.id).toBe('number');
      expect(typeof transaction.amount).toBe('number');
    }
  });
});
