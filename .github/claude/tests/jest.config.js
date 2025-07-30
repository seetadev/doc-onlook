module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/.github/claude/tests/setup/test-setup.js'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/.github/claude/tests/**/*.test.js',
    '<rootDir>/.github/claude/tests/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/.github/claude/tests/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'doc-onlook/Sender Sample/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/doc-onlook/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Mock directories
  moduleDirectories: ['node_modules', '<rootDir>/.github/claude/tests/__mocks__'],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Timeout for tests
  testTimeout: 10000
};