import { test, expect } from '../../fixtures/api.fixture';
import { SchemaValidator } from '../../utils/schema-validator';
import { accountSchema } from '../../schemas/account.schema';
import { bankingTestData } from '../../test-data/banking-test-data';

test.describe('Account API', () => {
  test('should retrieve an existing account', async ({
    accountService
  }) => {
    const response = await accountService.getAccount(
      bankingTestData.accounts.source
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const account = await response.json();

    const schemaValidator: SchemaValidator = new SchemaValidator();

    schemaValidator.assertValid(
      accountSchema,
      account
    );

    expect(account).toMatchObject({
      id: bankingTestData.accounts.source,
      customerId: 12212,
      type: 'CHECKING'
    });

    expect(typeof account.balance).toBe('number');
  });

  test('should reject a request for a non-existent account', async ({
    accountService
  }) => {
    const response = await accountService.getAccount(999999999);
    const responseBody = await response.text();

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(responseBody).toBe('Could not find account #999999999');
  });

  test('should return a typed account model', async ({ accountService }) => {
    const account = await accountService.getAccountData(
      bankingTestData.accounts.source
    );

    expect(account.id).toBe(bankingTestData.accounts.source);
    expect(account.customerId).toBe(12212);
    expect(account.type).toBe('CHECKING');
    expect(typeof account.balance).toBe('number');
  });
});