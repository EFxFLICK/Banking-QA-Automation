import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { AuthenticationService } from '../../api/services/authentication-service';

test.describe('Authentication API', () => {
  test('should authenticate with valid credentials', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const authenticationService = new AuthenticationService(apiClient);

    const response = await authenticationService.login('john', 'demo');
    const responseBody = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    expect(responseBody).toContain('<customer>');
    expect(responseBody).toContain('<id>12212</id>');
    expect(responseBody).toContain('<firstName>John</firstName>');
    expect(responseBody).toContain('<lastName>Smith</lastName>');
  });

  test('should reject invalid password', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const authenticationService = new AuthenticationService(apiClient);

    const response = await authenticationService.login(
      'john',
      'wrongpassword'
    );

    const responseBody = await response.text();

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(responseBody).toBe('Invalid username and/or password');
  });

  test('should reject an unknown username', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const authenticationService = new AuthenticationService(apiClient);

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
