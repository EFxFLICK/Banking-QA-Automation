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

public async getMatchingTransferPair(
  sourceAccountId: number,
  destinationAccountId: number
): Promise<{
  sent: TransactionDbRecord;
  received: TransactionDbRecord;
}> {
  const rows = await this.databaseClient.query(
    `SELECT
       sent.ID AS SENT_ID,
       sent.ACCOUNT_ID AS SENT_ACCOUNT_ID,
       sent.TYPE AS SENT_TYPE,
       sent.DATE AS SENT_DATE,
       sent.AMOUNT AS SENT_AMOUNT,
       sent.DESCRIPTION AS SENT_DESCRIPTION,
       received.ID AS RECEIVED_ID,
       received.ACCOUNT_ID AS RECEIVED_ACCOUNT_ID,
       received.TYPE AS RECEIVED_TYPE,
       received.DATE AS RECEIVED_DATE,
       received.AMOUNT AS RECEIVED_AMOUNT,
       received.DESCRIPTION AS RECEIVED_DESCRIPTION
     FROM TRANSACTION sent
     INNER JOIN TRANSACTION received
       ON sent.AMOUNT = received.AMOUNT
     WHERE sent.ACCOUNT_ID = ${sourceAccountId}
       AND sent.DESCRIPTION = 'Funds Transfer Sent'
       AND received.ACCOUNT_ID = ${destinationAccountId}
       AND received.DESCRIPTION = 'Funds Transfer Received'
     ORDER BY sent.ID DESC, received.ID DESC`
  );

  if (rows.length === 0) {
    throw new Error(
      `No matching transfer found from account ${sourceAccountId} to account ${destinationAccountId}`
    );
  }

  const row = rows[0];

  return {
    sent: {
      id: this.parseInteger(row.SENT_ID, 'SENT_ID'),
      accountId: this.parseInteger(
        row.SENT_ACCOUNT_ID,
        'SENT_ACCOUNT_ID'
      ),
      type: this.parseInteger(row.SENT_TYPE, 'SENT_TYPE'),
      date: row.SENT_DATE,
      amount: this.parseNumber(
        row.SENT_AMOUNT,
        'SENT_AMOUNT'
      ),
      description: row.SENT_DESCRIPTION
    },
    received: {
      id: this.parseInteger(
        row.RECEIVED_ID,
        'RECEIVED_ID'
      ),
      accountId: this.parseInteger(
        row.RECEIVED_ACCOUNT_ID,
        'RECEIVED_ACCOUNT_ID'
      ),
      type: this.parseInteger(
        row.RECEIVED_TYPE,
        'RECEIVED_TYPE'
      ),
      date: row.RECEIVED_DATE,
      amount: this.parseNumber(
        row.RECEIVED_AMOUNT,
        'RECEIVED_AMOUNT'
      ),
      description: row.RECEIVED_DESCRIPTION
    }
  };
}

}