import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { CustomerService } from '../../api/services/customer-service';

test.describe('Customer API', () => {
  test('should retrieve an existing customer', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const customerService = new CustomerService(apiClient);

    const response = await customerService.getCustomer(12212);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const customer = await response.json();

    expect(customer).toMatchObject({
      id: 12212,
      firstName: 'John',
      lastName: 'Smith'
    });
  });

  test('should retrieve all accounts for an existing customer', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const customerService = new CustomerService(apiClient);

    const response = await customerService.getCustomerAccounts(12212);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const accounts = await response.json();

    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThan(0);

    for (const account of accounts) {
      expect(account).toMatchObject({
        customerId: 12212
      });

      expect(typeof account.id).toBe('number');
      expect(typeof account.customerId).toBe('number');
      expect(typeof account.type).toBe('string');
      expect(typeof account.balance).toBe('number');
    }
  });

  test('should reject account lookup for a non-existent customer', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const customerService = new CustomerService(apiClient);

    const response =
      await customerService.getCustomerAccounts(999999999);

    const responseBody = await response.text();

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(responseBody).toBe(
      'Could not find customer #999999999'
    );
  });

  test('should return typed account models for a customer', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const customerService = new CustomerService(apiClient);

  const accounts =
    await customerService.getCustomerAccountsData(12212);

  expect(accounts.length).toBeGreaterThan(0);

  for (const account of accounts) {
    expect(account.customerId).toBe(12212);
    expect(typeof account.id).toBe('number');
    expect(typeof account.customerId).toBe('number');
    expect(typeof account.type).toBe('string');
    expect(typeof account.balance).toBe('number');
  }
});
});