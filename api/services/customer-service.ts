import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { Account } from '../models/account';
import { Customer } from '../models/customer';

export class CustomerService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getCustomer(
    customerId: number
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/customers/${customerId}`,
      {
        Accept: 'application/json'
      }
    );
  }

  public async getCustomerData(
    customerId: number
  ): Promise<Customer> {
    const response = await this.getCustomer(customerId);

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve customer ${customerId}: HTTP ${response.status()}`
      );
    }

    return response.json() as Promise<Customer>;
  }

  public async getCustomerAccounts(
    customerId: number
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/customers/${customerId}/accounts`,
      {
        Accept: 'application/json'
      }
    );
  }

  public async getCustomerAccountsData(
    customerId: number
  ): Promise<Account[]> {
    const response = await this.getCustomerAccounts(customerId);

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve accounts for customer ${customerId}: HTTP ${response.status()}`
      );
    }

    return response.json() as Promise<Account[]>;
  }
}