export interface Transaction {
  id: number;
  accountId: number;
  type: string;
  date: string;
  amount: number;
  description: string;
}
