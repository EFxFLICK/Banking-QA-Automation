import { expect, Locator, Page } from '@playwright/test';

export class AccountDetailsPage {
  private readonly accountDetailsHeading: Locator;
  private readonly accountSummaryTable: Locator;
  private readonly activityTable: Locator;
  private readonly accountNumberText: Locator;
  private readonly accountTypeText: Locator;
  private readonly balanceText: Locator;
  private readonly availableText: Locator;
  private readonly balanceValue: Locator;
  private readonly availableBalanceValue: Locator;

  public constructor(
    private readonly page: Page
  ) {
    this.accountDetailsHeading = page.getByRole('heading', {
        name: 'Account Details'
    });

    this.accountSummaryTable = page.locator('table').nth(0);
    this.activityTable = page.locator('table').nth(2);

     this.balanceValue = page.locator('#balance');
     this.availableBalanceValue = page.locator('#availableBalance');

    this.accountNumberText = this.accountSummaryTable.getByText('54321', {
      exact: true
    });

    this.accountTypeText = this.accountSummaryTable.getByText('CHECKING', {
      exact: true
    });

    this.balanceText = this.accountSummaryTable.getByText('$1340.12', {
      exact: true
    });

    this.availableText = this.accountSummaryTable.getByText('$1340.12', {
      exact: true
    });
  }

  public async expectPageVisible(): Promise<void> {
    await expect(this.accountDetailsHeading).toBeVisible();
    await expect(this.accountSummaryTable).toBeVisible();
    await expect(this.activityTable).toBeVisible();
  }

  public async expectAccountNumberVisible(
    accountId: number
  ): Promise<void> {
    await expect(
      this.accountSummaryTable.getByText(String(accountId), {
        exact: true
      })
    ).toBeVisible();
  }

  public async expectAccountTypeVisible(
    accountType: string
  ): Promise<void> {
    await expect(
      this.accountSummaryTable.getByText(accountType, {
        exact: true
      })
    ).toBeVisible();
  }

  public async expectBalanceVisible(
     balance: number
  ): Promise<void> {
     await expect(this.balanceValue).toHaveText(
     `$${balance.toFixed(2)}`
    );
  }

  public async expectAvailableAmountVisible(
     amount: number
  ): Promise<void> {
     await expect(this.availableBalanceValue).toHaveText(
     `$${amount.toFixed(2)}`
    );
  }

  public async expectTransactionTableVisible(): Promise<void> {
    await expect(
      this.activityTable.getByRole('columnheader', {
        name: 'Date'
      })
    ).toBeVisible();

    await expect(
      this.activityTable.getByRole('columnheader', {
        name: 'Transaction'
      })
    ).toBeVisible();

    await expect(
      this.activityTable.getByRole('columnheader', {
        name: 'Debit (-)'
      })
    ).toBeVisible();

    await expect(
      this.activityTable.getByRole('columnheader', {
        name: 'Credit (+)'
      })
    ).toBeVisible();
  }
}