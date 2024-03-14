const config = {
  transform: {
    // '^.+\\.(t|j)s$': require.resolve('./transformer.js')
    '^.+\\.(t)s$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: './tsconfig.test.json',
    },
  },
  testMatch: [
    // '<rootDir>/packages/**/test/?(*.)+(spec|test).js',
    '<rootDir>/packages/stkon-core/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-account/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-network/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-crypto/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-contract/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-transaction/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-staking/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/stkon-utils/test/?(*.)+(spec|test).ts',
  ],
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    'cross-fetch': 'jest-fetch-mock',
  },
  testURL: 'http://localhost',
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages', '<rootDir>/scripts', '<rootDir>/e2e'],
  collectCoverageFrom: [
    // 'packages/!(stkon-core)/src/**/*.ts',
    'packages/stkon-core/src/**/*.ts',
    'packages/stkon-utils/src/**/*.ts',
    'packages/stkon-crypto/src/**/*.ts',
    'packages/stkon-transaction/src/**/*.ts',
    'packages/stkon-staking/src/**/*.ts',
    'packages/stkon-contract/src/**/*.ts',
  ],
  // timers: 'fake',
  setupFiles: ['<rootDir>/scripts/jest/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/scripts/jest/jest.framework-setup.js',
  testEnvironment: process.env.NODE_ENV === 'development' ? 'node' : 'jsdom',
  collectCoverage: true,
  automock: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

module.exports = config;
