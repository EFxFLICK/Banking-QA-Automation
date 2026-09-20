export const bankingTestData = {
  user: {
    username: 'john',
    password: 'demo'
  },

  accounts: {
    source: 54321,
    destination: 13122
  },

  transfer: {
    standardAmount: 1,
    zeroAmount: 0,
    negativeAmount: -1,
    invalidFormat: 'abc',
    emptyAmount: ''
  }
} as const;