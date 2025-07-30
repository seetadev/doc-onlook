// Test setup configuration for doc-onlook project

// Configure Jest environment
const { TextEncoder, TextDecoder } = require('util');

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Only show errors that are not React warnings
    if (
      typeof args[0] === 'string' &&
      !args[0].includes('Warning:') &&
      !args[0].includes('React')
    ) {
      originalConsoleError(...args);
    }
  };

  console.warn = (...args) => {
    // Only show warnings that are not React warnings
    if (
      typeof args[0] === 'string' &&
      !args[0].includes('Warning:') &&
      !args[0].includes('React')
    ) {
      originalConsoleWarn(...args);
    }
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 10);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    
    check();
  });
};

// Mock fetch for tests that might need it
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});