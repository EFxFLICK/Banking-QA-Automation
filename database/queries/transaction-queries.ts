import { DatabaseClient } from '../clients/database-client';
import { TransactionDbRecord } from '../models/transaction-db-model';

export class TransactionQueries {
  public constructor(
    private readonly databaseClient: DatabaseClient
  ) {}

  public async getTransactionsForAccount(
    accountId: number
  ): Promise<TransactionDbRecord[]> {
    const rows = await this.databaseClient.query(
      `SELECT ID, ACCOUNT_ID, TYPE, DATE, AMOUNT, DESCRIPTION
       FROM TRANSACTION
       WHERE ACCOUNT_ID = ${accountId}
       ORDER BY ID`
    );

    return rows.map((row) => ({
      id: this.parseInteger(row.ID, 'ID'),
      accountId: this.parseInteger(
        row.ACCOUNT_ID,
        'ACCOUNT_ID'
      ),
      type: this.parseInteger(row.TYPE, 'TYPE'),
      date: row.DATE,
      amount: this.parseNumber(
        row.AMOUNT,
        'AMOUNT'
      ),
      description: row.DESCRIPTION
    }));
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

  public async getTransaction(
  transactionId: number
): Promise<TransactionDbRecord> {
  const rows = await this.databaseClient.query(
    `SELECT ID, ACCOUNT_ID, TYPE, DATE, AMOUNT, DESCRIPTION
     FROM TRANSACTION
     WHERE ID = ${transactionId}`
  );

  if (rows.length !== 1) {
    throw new Error(
      `Expected exactly one transaction for ID ${transactionId}, found ${rows.length}`
    );
  }

  const row = rows[0];

  return {
    id: this.parseInteger(row.ID, 'ID'),
    accountId: this.parseInteger(
      row.ACCOUNT_ID,
      'ACCOUNT_ID'
    ),
    type: this.parseInteger(row.TYPE, 'TYPE'),
    date: row.DATE,
    amount: this.parseNumber(
      row.AMOUNT,
      'AMOUNT'
    ),
    description: row.DESCRIPTION
  };
}

public async getLatestTransferSent(
  accountId: number
): Promise<TransactionDbRecord> {
  const rows = await this.databaseClient.query(
    `SELECT ID, ACCOUNT_ID, TYPE, DATE, AMOUNT, DESCRIPTION
     FROM TRANSACTION
     WHERE ACCOUNT_ID = ${accountId}
       AND DESCRIPTION = 'Funds Transfer Sent'
     ORDER BY ID DESC`
  );

  if (rows.length === 0) {
    throw new Error(
      `No transfer-sent transaction found for account ${accountId}`
    );
  }

  const row = rows[0];

  return {
    id: this.parseInteger(row.ID, 'ID'),
    accountId: this.parseInteger(row.ACCOUNT_ID, 'ACCOUNT_ID'),
    type: this.parseInteger(row.TYPE, 'TYPE'),
    date: row.DATE,
    amount: this.parseNumber(row.AMOUNT, 'AMOUNT'),
    description: row.DESCRIPTION
  };
}

public async getLatestTransferReceived(
  accountId: number
): Promise<TransactionDbRecord> {
  const rows = await this.databaseClient.query(
    `SELECT ID, ACCOUNT_ID, TYPE, DATE, AMOUNT, DESCRIPTION
     FROM TRANSACTION
     WHERE ACCOUNT_ID = ${accountId}
       AND DESCRIPTION = 'Funds Transfer Received'
     ORDER BY ID DESC`
  );

  if (rows.length === 0) {
    throw new Error(
      `No transfer-received transaction found for account ${accountId}`
    );
  }

  const row = rows[0];

  return {
    id: this.parseInteger(row.ID, 'ID'),
    accountId: this.parseInteger(row.ACCOUNT_ID, 'ACCOUNT_ID'),
    type: this.parseInteger(row.TYPE, 'TYPE'),
    date: row.DATE,
    amount: this.parseNumber(row.AMOUNT, 'AMOUNT'),
    description: row.DESCRIPTION
  };
}

}