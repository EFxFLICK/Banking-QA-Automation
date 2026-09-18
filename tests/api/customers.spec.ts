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
});
