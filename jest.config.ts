export default {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // arquivos que vão entrar no coverage
  collectCoverageFrom: [
    // root dir
    // '<rootDir>/src/**/*.ts',

    //impediments
    '<rootDir>/src/**/*.ts',

    '!**/node_modules/**',
    '!**/migrations/**',
    '!**/tests/**',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\migrations\\\\"],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/tests'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // A map from regular expressions to paths to transformers
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
