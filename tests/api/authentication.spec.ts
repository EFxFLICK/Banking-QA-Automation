import { test, expect } from '../../fixtures/api.fixture';
import { SchemaValidator } from '../../utils/schema-validator';
import { customerSchema } from '../../schemas/customer.schema';

test.describe('Authentication API', () => {
  test('should authenticate with valid credentials', async ({
    authenticationService
  }) => {

    const response = await authenticationService.login('john', 'demo');
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const schemaValidator: SchemaValidator = new SchemaValidator();

      schemaValidator.assertValid(
      customerSchema,
      responseBody
    );

    expect(responseBody).toMatchObject({
      id: 12212,
      firstName: 'John',
      lastName: 'Smith'
    });
  });

  test('should reject invalid password', async ({ authenticationService }) => {

    const response = await authenticationService.login(
      'john',
      'wrongpassword'
    );

    const responseBody = await response.text();

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(responseBody).toBe('Invalid username and/or password');
  });

  test('should reject an unknown username', async ({ authenticationService }) => {

    const response = await authenticationService.login(
      'unknownuser',
      'demo'
    );

    const responseBody = await response.text();

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(responseBody).toBe('Invalid username and/or password');
  });
});
