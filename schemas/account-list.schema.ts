import { JSONSchemaType } from 'ajv';
import { Account } from '../api/models/account';

export const accountListSchema: JSONSchemaType<Account[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'integer'
      },
      customerId: {
        type: 'integer'
      },
      type: {
        type: 'string'
      },
      balance: {
        type: 'number'
      }
    },
    required: [
      'id',
      'customerId',
      'type',
      'balance'
    ],
    additionalProperties: false
  }
};