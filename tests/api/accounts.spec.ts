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

  test('should reject a request for a non-existent account', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const accountService = new AccountService(apiClient);

  const response = await accountService.getAccount(999999999);
  const responseBody = await response.text();

  expect(response.status()).toBe(400);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(responseBody).toBe('Could not find account #999999999');
});

test('should return a typed account model', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const accountService = new AccountService(apiClient);

  const account = await accountService.getAccountData(54321);

  expect(account.id).toBe(54321);
  expect(account.customerId).toBe(12212);
  expect(account.type).toBe('CHECKING');
  expect(typeof account.balance).toBe('number');
});

});
