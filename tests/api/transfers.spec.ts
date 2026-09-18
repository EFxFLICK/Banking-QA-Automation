import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { AccountService } from '../../api/services/account-service';
import { TransferService } from '../../api/services/transfer-service';

test.describe('Transfer API', () => {
  test('should transfer money between existing accounts', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const accountService = new AccountService(apiClient);
    const transferService = new TransferService(apiClient);

    const fromAccountId = 54321;
    const toAccountId = 13122;
    const transferAmount = 1;

    const sourceBeforeResponse =
      await accountService.getAccount(fromAccountId);

    const targetBeforeResponse =
      await accountService.getAccount(toAccountId);

    expect(sourceBeforeResponse.status()).toBe(200);
    expect(targetBeforeResponse.status()).toBe(200);

    const sourceBefore = await sourceBeforeResponse.json();
    const targetBefore = await targetBeforeResponse.json();

    const transferResponse = await transferService.transfer(
      fromAccountId,
      toAccountId,
      transferAmount
    );

    expect(transferResponse.status()).toBe(200);

    const transferBody = await transferResponse.text();

    expect(transferBody.length).toBeGreaterThan(0);

    const sourceAfterResponse =
      await accountService.getAccount(fromAccountId);

    const targetAfterResponse =
      await accountService.getAccount(toAccountId);

    expect(sourceAfterResponse.status()).toBe(200);
    expect(targetAfterResponse.status()).toBe(200);

    const sourceAfter = await sourceAfterResponse.json();
    const targetAfter = await targetAfterResponse.json();

    expect(sourceAfter.balance).toBeCloseTo(
      sourceBefore.balance - transferAmount,
      2
    );

    expect(targetAfter.balance).toBeCloseTo(
      targetBefore.balance + transferAmount,
      2
    );
  });

  test('should reject a transfer from a non-existent source account', async ({
  request
}) => {
  const apiClient = new ApiClient(request);
  const transferService = new TransferService(apiClient);

  const response = await transferService.transfer(
    999999999,
    13122,
    1
  );

  const responseBody = await response.text();

  expect(response.status()).toBe(400);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(responseBody).toBe(
    'Could not find account number 999999999 and/or 13122'
  );
});
});
