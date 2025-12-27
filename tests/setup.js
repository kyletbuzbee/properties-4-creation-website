// Jest setup file for Properties 4 Creations tests
require('@testing-library/jest-dom');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Keep log and error for debugging
  // Uncomment to silence all console output
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Helper to create mock DOM elements
global.createMockElement = (tagName = 'div', attributes = {}) => {
  const element = document.createElement(tagName);
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key]);
  });
  return element;
};

// Helper to setup document body for tests
global.setupDocumentBody = () => {
  document.body.innerHTML = '';
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});
