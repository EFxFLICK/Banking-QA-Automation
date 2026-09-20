export interface TransactionDbRecord {
  id: number;
  accountId: number;
  type: number;
  date: string | null;
  amount: number;
  description: string | null;
}