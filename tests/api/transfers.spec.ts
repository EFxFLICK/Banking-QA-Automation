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
});
