import { expect, Locator, Page } from '@playwright/test';

export class AccountsOverviewPage {
  private readonly accountsTable: Locator;
  private readonly accountsOverviewHeading: Locator;
  private readonly transferFundsLink: Locator;
  private readonly logoutLink: Locator;

  public constructor(
    private readonly page: Page
  ) {
    this.accountsTable = page.locator('table');
    this.accountsOverviewHeading = page.getByRole('heading', {
      name: 'Accounts Overview'
    });
    this.transferFundsLink = page.getByRole('link', {
      name: 'Transfer Funds'
    });
    this.logoutLink = page.getByRole('link', {
      name: 'Log Out'
    });
  }

  public async expectPageVisible(): Promise<void> {
    await expect(this.accountsOverviewHeading).toBeVisible();
    await expect(this.accountsTable).toBeVisible();
  }

  public async getAccountLink(
    accountId: number
  ): Promise<Locator> {
    return this.page.getByRole('link', {
      name: String(accountId),
      exact: true
    });
  }

  public async expectAccountVisible(
    accountId: number
  ): Promise<void> {
    await expect(
      await this.getAccountLink(accountId)
    ).toBeVisible();
  }

  public async clickAccount(
    accountId: number
  ): Promise<void> {
    await (
      await this.getAccountLink(accountId)
    ).click();
  }

  public async clickTransferFunds(): Promise<void> {
    await this.transferFundsLink.click();
  }

  public async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }
}