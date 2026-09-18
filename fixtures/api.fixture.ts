import { test as base } from '@playwright/test';
import { ApiClient } from '../api/clients/api-client';
import { AccountService } from '../api/services/account-service';
import { AuthenticationService } from '../api/services/authentication-service';
import { CustomerService } from '../api/services/customer-service';
import { TransactionService } from '../api/services/transaction-service';
import { TransferService } from '../api/services/transfer-service';

type ApiFixtures = {
  apiClient: ApiClient;
  customerService: CustomerService;
  accountService: AccountService;
  transactionService: TransactionService;
  transferService: TransferService;
  authenticationService: AuthenticationService;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  customerService: async ({ apiClient }, use) => {
    await use(new CustomerService(apiClient));
  },

  accountService: async ({ apiClient }, use) => {
    await use(new AccountService(apiClient));
  },

  transactionService: async ({ apiClient }, use) => {
    await use(new TransactionService(apiClient));
  },

  transferService: async ({ apiClient }, use) => {
    await use(new TransferService(apiClient));
  },

  authenticationService: async ({ apiClient }, use) => {
    await use(new AuthenticationService(apiClient));
  }
});

export { expect } from '@playwright/test';