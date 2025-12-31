# Properties 4 Creations - Test Suite Documentation

This document describes the comprehensive test suite for the Properties 4 Creations website, covering unit tests, integration tests, and end-to-end tests.

## Test Structure

### Unit Tests (`tests/unit/`)

Unit tests focus on individual JavaScript modules and functions, testing them in isolation with mocked dependencies.

#### Test Files:

- **`validation.test.js`** - Tests for form validation and submission logic
  - Email and phone validation functions
  - Field and form validation utilities
  - Input sanitization and security
  - Form submission handlers
  - Error handling and edge cases

- **`mobile-menu.test.js`** - Tests for mobile navigation functionality
  - Menu toggle and state management
  - Keyboard navigation and accessibility
  - Touch interactions for mobile devices
  - Window resize handling
  - Focus management and ARIA attributes

- **`theme-toggle.test.js`** - Tests for dark mode functionality
  - Theme switching and persistence
  - localStorage integration
  - System preference detection
  - Meta theme-color updates
  - Screen reader announcements

- **`performance.test.js`** - Tests for performance optimizations
  - Core Web Vitals monitoring
  - Lazy loading implementation
  - Resource preloading
  - Scroll performance optimization
  - PerformanceObserver integration

- **`forms.test.js`** - Tests for form initialization and integration
  - Form setup and validation wiring
  - Event listener management
  - Submit button state management
  - Integration with validation module

- **`accordion-faq.test.js`** - Tests for FAQ accordion functionality
  - Accordion toggle behavior
  - Search functionality with debouncing
  - Keyboard navigation
  - Screen reader accessibility
  - Error handling for malformed content

- **`comparison-slider.test.js`** - Tests for before/after image comparison
  - Mouse and touch interactions
  - Keyboard navigation
  - Slider positioning and ARIA attributes
  - Static fallback for non-JS browsers
  - Multiple slider support

- **`properties-filters.test.js`** - Tests for property filtering system
  - Search functionality across multiple fields
  - Dropdown filter combinations
  - Combined filtering logic
  - No results handling
  - Error recovery for malformed data

### Integration Tests (`tests/integration/`)

Integration tests verify that multiple modules work together correctly and test complete user workflows.

#### Test Files:

- **`form-workflows.test.js`** - Complete form submission workflows
  - End-to-end form validation and submission
  - Error handling and recovery scenarios
  - Cross-form interaction management
  - Accessibility integration
  - Security and input sanitization

- **`user-interactions.test.js`** - Complete user interaction flows
  - New visitor experience from landing to interaction
  - Accessibility-first keyboard navigation
  - Mobile-first touch interactions
  - Performance under intensive usage
  - Cross-feature integration scenarios

- **`error-handling.test.js`** - Error scenarios and fallbacks
  - Network failure handling
  - Form validation error recovery
  - Module error isolation
  - User experience during errors
  - Graceful degradation

## Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/js/**/*.test.js'
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js',
    '!js/**/*.spec.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### Test Setup (`tests/setup.js`)

- Mocks console methods to reduce test noise
- Sets up window.matchMedia for theme testing
- Configures IntersectionObserver and ResizeObserver mocks
- Provides consistent test environment

## Testing Patterns

### Mocking Strategy

1. **External Dependencies**: Formspree API, localStorage, PerformanceObserver
2. **Browser APIs**: fetch, IntersectionObserver, matchMedia
3. **DOM Elements**: Created dynamically in test setup
4. **Console Methods**: Mocked to reduce noise and capture warnings

### Test Data

- **Realistic Test Data**: Uses realistic property names, email addresses, phone numbers
- **Edge Cases**: Empty strings, null values, malformed data
- **Accessibility**: Tests ARIA attributes and screen reader announcements
- **Performance**: Tests with large datasets and rapid interactions

### Error Testing

- **Network Errors**: Complete failures, timeouts, malformed responses
- **Validation Errors**: Invalid inputs, missing required fields
- **Module Errors**: Missing elements, malformed data structures
- **Recovery**: User retry scenarios, graceful degradation

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/unit/validation.test.js
```

### CI/CD Integration

Tests are automatically run in the CI/CD pipeline:

```bash
# Quality gates include test coverage
npm run test:ci

# All quality checks
npm run quality:check
```

## Coverage Requirements

The test suite aims for 70%+ coverage across all metrics:

- **Branches**: 70% minimum
- **Functions**: 70% minimum  
- **Lines**: 70% minimum
- **Statements**: 70% minimum

## Test Best Practices

### Unit Test Guidelines

1. **Isolation**: Test one function/module at a time
2. **Mocking**: Mock all external dependencies
3. **Setup/Teardown**: Clean DOM state between tests
4. **Edge Cases**: Test boundary conditions and error scenarios
5. **Accessibility**: Verify ARIA attributes and screen reader support

### Integration Test Guidelines

1. **Real Scenarios**: Test complete user workflows
2. **Cross-Module**: Verify module interactions
3. **Error Recovery**: Test graceful error handling
4. **Performance**: Verify responsiveness under load
5. **Accessibility**: End-to-end accessibility testing

### Mocking Guidelines

1. **Consistency**: Use consistent mock implementations
2. **Realism**: Mocks should behave like real implementations
3. **Cleanup**: Restore original functions after tests
4. **Documentation**: Document mock behavior in test comments

## Continuous Improvement

### Test Maintenance

- **Regular Updates**: Keep tests current with code changes
- **Performance Monitoring**: Track test execution time
- **Coverage Analysis**: Review coverage reports for gaps
- **Error Analysis**: Investigate and fix test failures promptly

### Test Expansion

- **New Features**: Add tests for all new functionality
- **Bug Fixes**: Add regression tests for bug fixes
- **Edge Cases**: Continuously identify and test edge cases
- **Performance**: Add performance regression tests

## Troubleshooting

### Common Issues

1. **DOM State**: Ensure proper cleanup between tests
2. **Async Operations**: Use proper async/await patterns
3. **Mock Conflicts**: Check for conflicting mock implementations
4. **Timing Issues**: Use setTimeout for async operations

### Debug Tips

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="specific test name"

# Generate coverage report
npm run test:coverage
```

## Integration with Development Workflow

### Pre-commit Hooks

Tests are automatically run before commits via Husky:

```bash
# Quality checks run automatically
npm run quality:check
```

### Development Workflow

1. **Write Tests First**: Follow TDD principles when possible
2. **Run Tests Locally**: Verify tests pass before pushing
3. **Coverage Monitoring**: Ensure new code maintains coverage
4. **CI/CD Validation**: Verify tests pass in CI environment

This comprehensive test suite ensures the Properties 4 Creations website maintains high quality, accessibility, and reliability across all user interactions and edge cases.