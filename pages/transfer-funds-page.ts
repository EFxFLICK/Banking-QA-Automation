import { expect, Locator, Page } from '@playwright/test';

export class TransferFundsPage {
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly toAccountSelect: Locator;
  private readonly transferButton: Locator;
  private readonly transferCompleteHeading: Locator;
  private readonly transferResultMessage: Locator;

  public constructor(
    private readonly page: Page
  ) {
    this.amountInput = page.locator('#amount');

    this.fromAccountSelect = page.locator('#fromAccountId');

    this.toAccountSelect = page.locator('#toAccountId');

    this.transferButton = page.locator(
      'input[type="submit"][value="Transfer"]'
    );

    this.transferCompleteHeading = page.getByRole('heading', {
     name: 'Transfer Complete!'
    });

    this.transferResultMessage = page.getByText(
        /\$[\d.-]+ has been transferred from account #\d+ to account #\d+\./
    );

  }

  public async expectPageVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Transfer Funds'
      })
    ).toBeVisible();

    await expect(this.amountInput).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.toAccountSelect).toBeVisible();
    await expect(this.transferButton).toBeVisible();
  }

  public async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number | string
  ): Promise<void> {
    await this.fromAccountSelect.selectOption(
      String(fromAccountId)
    );

    await this.toAccountSelect.selectOption(
      String(toAccountId)
    );

    await this.amountInput.fill(String(amount));

    await this.transferButton.click();
  }

  public async expectTransferComplete(
  amount: number,
  fromAccountId: number,
  toAccountId: number
): Promise<void> {
  await expect(this.transferCompleteHeading).toBeVisible();

  const formattedAmount =
    amount < 0
      ? `-$${Math.abs(amount).toFixed(2)}`
      : `$${amount.toFixed(2)}`;

  await expect(this.transferResultMessage).toHaveText(
    `${formattedAmount} has been transferred from account #${fromAccountId} to account #${toAccountId}.`
  );
}
}