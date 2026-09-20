import { DatabaseClient } from '../clients/database-client';
import { AccountDbRecord } from '../models/account-db-model';

export class AccountQueries {
  public constructor(
    private readonly databaseClient: DatabaseClient
  ) {}

  public async getAccount(
    accountId: number
  ): Promise<AccountDbRecord> {
    const rows = await this.databaseClient.query(
      `SELECT ID, CUSTOMER_ID, BALANCE
       FROM ACCOUNT
       WHERE ID = ${accountId}`
    );

    if (rows.length !== 1) {
      throw new Error(
        `Expected exactly one account for ID ${accountId}, found ${rows.length}`
      );
    }

    const row = rows[0];

    return {
      id: this.parseInteger(row.ID, 'ID'),
      customerId: this.parseInteger(
        row.CUSTOMER_ID,
        'CUSTOMER_ID'
      ),
      balance: this.parseNumber(
        row.BALANCE,
        'BALANCE'
      )
    };
  }

  private parseInteger(
    value: string | null,
    column: string
  ): number {
    if (value === null) {
      throw new Error(
        `Database column ${column} returned null`
      );
    }

    const parsed = Number.parseInt(value, 10);

    if (!Number.isInteger(parsed)) {
      throw new Error(
        `Database column ${column} contains invalid integer: ${value}`
      );
    }

    return parsed;
  }

  private parseNumber(
    value: string | null,
    column: string
  ): number {
    if (value === null) {
      throw new Error(
        `Database column ${column} returned null`
      );
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(
        `Database column ${column} contains invalid number: ${value}`
      );
    }

    return parsed;
  }
}