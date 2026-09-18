import { JSONSchemaType } from 'ajv';
import { Transaction } from '../api/models/transaction';

export const transactionListSchema: JSONSchemaType<Transaction[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'integer'
      },
      accountId: {
        type: 'integer'
      },
      type: {
        type: 'string'
      },
      date: {
        type: 'integer'
      },
      amount: {
        type: 'number'
      },
      description: {
        type: 'string'
      }
    },
    required: [
      'id',
      'accountId',
      'type',
      'date',
      'amount',
      'description'
    ],
    additionalProperties: false
  }
};