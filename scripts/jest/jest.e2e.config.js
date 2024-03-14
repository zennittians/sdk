const baseConfig = require('./jest.src.config');
module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '^@stkon-js/(.*)$': '<rootDir>/packages/stkon-$1/src/index.ts',
    'cross-fetch': 'jest-fetch-mock',
  },
  setupTestFrameworkScriptFile: '<rootDir>/scripts/jest/jest.framework-setup.js',
  testMatch: ['<rootDir>/e2e/src/?(*.)+(spec|test|e2e).ts'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  collectCoverageFrom: [
    // 'packages/!(stkon-core)/src/**/*.ts',
    'packages/stkon-core/src/**/*.ts',
    'packages/stkon-utils/src/**/*.ts',
    'packages/stkon-crypto/src/**/*.ts',
    'packages/stkon-transaction/src/**/*.ts',
  ],
  automock: false,
};
