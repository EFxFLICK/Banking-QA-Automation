import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  public constructor(
    private readonly request: APIRequestContext
  ) {}

  public async get(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.get(endpoint, { headers });
  }

  public async post(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      data?: unknown;
      params?: Record<string, string | number>;
    }
  ): Promise<APIResponse> {
    return this.request.post(endpoint, options);
  }
}
