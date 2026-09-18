import { JSONSchemaType } from 'ajv';
import { Customer } from '../api/models/customer';

export const customerSchema: JSONSchemaType<Customer> = {
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        state: {
          type: 'string'
        },
        zipCode: {
          type: 'string'
        }
      },
      required: [
        'street',
        'city',
        'state',
        'zipCode'
      ],
      additionalProperties: false
    },
    phoneNumber: {
      type: 'string'
    },
    ssn: {
      type: 'string'
    }
  },
  required: [
    'id',
    'firstName',
    'lastName',
    'address',
    'phoneNumber',
    'ssn'
  ],
  additionalProperties: false
};