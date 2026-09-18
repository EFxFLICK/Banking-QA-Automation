import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class AuthenticationService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async login(
    username: string,
    password: string
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
    );
  }
}
