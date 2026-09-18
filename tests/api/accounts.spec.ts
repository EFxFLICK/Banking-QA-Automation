import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { AccountService } from '../../api/services/account-service';

test.describe('Account API', () => {
  test('should retrieve an existing account', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const accountService = new AccountService(apiClient);

    const response = await accountService.getAccount(54321);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const account = await response.json();

    expect(account).toMatchObject({
      id: 54321,
      customerId: 12212,
      type: 'CHECKING'
    });

    expect(typeof account.balance).toBe('number');
  });
});
