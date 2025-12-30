# 🧪 Testing Suite - Properties 4 Creations

This document outlines the comprehensive testing suite implemented for the Properties 4 Creations website, including unit tests, integration tests, E2E tests, accessibility tests, and performance monitoring.

## 📋 Test Types Overview

| Test Type | Tool | Purpose | Coverage |
|-----------|------|---------|----------|
| **Unit Tests** | Jest | Test individual functions and components | JavaScript utilities, validation functions |
| **Accessibility Tests** | Axe Core + Jest | WCAG compliance and accessibility standards | All pages and components |
| **E2E Tests** | Playwright | User journey testing across browsers | Navigation, forms, interactions |
| **Performance Tests** | Lighthouse CI | Core Web Vitals and performance metrics | Production builds |

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure Node.js 16+ is installed
node --version

# Install dependencies
npm install
```

### Run All Tests
```bash
npm run test:all
```

This runs unit tests, E2E tests, and accessibility tests in sequence.

## 🧩 Unit Testing (Jest)

### Configuration
- **Environment**: jsdom (simulates browser environment)
- **Coverage**: 70% threshold for branches, functions, lines, statements
- **Setup**: `tests/setup.js` with global mocks and utilities

### Running Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files Structure
```
tests/
├── setup.js              # Global test setup
├── __mocks__/           # Mock files for imports
│   └── fileMock.js
├── validation.test.js   # Form validation tests
├── accessibility.test.js # A11y compliance tests
└── e2e/                # End-to-end tests
    ├── navigation.spec.js
    └── forms.spec.js
```

### Writing Unit Tests

#### Example: Testing Form Validation
```javascript
import { isValidEmail, isValidPhone } from '../js/main.js';

describe('Email Validation', () => {
  test('valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('invalid email addresses', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});
```

#### Mocking Browser APIs
```javascript
// IntersectionObserver is automatically mocked in setup.js
// localStorage is mocked for testing theme persistence
// matchMedia is mocked for responsive design tests
```

## ♿ Accessibility Testing (Axe Core)

### Purpose
- Automated WCAG 2.1 AA compliance checking
- Form accessibility validation
- ARIA attribute verification
- Color contrast testing

### Running Accessibility Tests
```bash
npm run test:accessibility
```

### Accessibility Test Coverage
- ✅ Form labels and associations
- ✅ ARIA attributes and roles
- ✅ Image alt text requirements
- ✅ Heading hierarchy validation
- ✅ Button accessibility names
- ✅ Color contrast ratios

## 🌐 End-to-End Testing (Playwright)

### Configuration
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Tests run in parallel for speed
- **Screenshots**: Automatic on test failures
- **Videos**: Recorded on test failures for debugging

### Running E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with interactive UI mode
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

### Test Scenarios Covered

#### Navigation Tests
- Homepage loading and content verification
- Cross-page navigation
- Breadcrumb navigation
- 404 error handling

#### Mobile Responsiveness
- Hamburger menu functionality
- Touch interactions
- Mobile-specific layouts

#### Theme System
- Dark/light mode toggling
- Theme persistence
- System preference detection

#### Form Testing
- Application form validation
- Contact form submission
- Error message display
- Success state handling
- Date picker constraints

### Debugging E2E Tests
```bash
# Run with debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## ⚡ Performance Testing (Lighthouse)

### Configuration
- **Metrics**: Core Web Vitals (FCP, LCP, CLS, FID, TBT)
- **Thresholds**: Performance, Accessibility, Best Practices, SEO
- **Output**: JSON reports for CI/CD integration

### Running Performance Tests
```bash
# Requires dev server running
npm run dev

# Run performance audit (in another terminal)
npm run test:performance
```

### Performance Metrics Tracked
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Total Blocking Time (TBT)**: < 200ms

## 🛠️ Development Workflow

### Pre-commit Testing
```bash
# Run all tests before committing
npm run test:all

# Or run specific test suites
npm test                    # Unit tests
npm run test:e2e           # E2E tests
npm run test:accessibility # Accessibility tests
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    npm ci
    npm run test:all
    npm run test:performance
```

### Test-Driven Development
1. **Write failing test first**
2. **Implement feature to make test pass**
3. **Refactor while keeping tests green**
4. **Run full test suite before committing**

## 📊 Test Reports and Coverage

### Coverage Reports
- **Location**: `coverage/lcov-report/index.html`
- **Format**: HTML and LCOV for CI tools
- **Threshold**: 70% minimum coverage required

### E2E Reports
- **Location**: `test-results/` and `playwright-report/`
- **Includes**: Screenshots, videos, traces of failed tests
- **Command**: `npx playwright show-report`

### Performance Reports
- **Location**: `reports/lighthouse.json`
- **Tools**: Chrome DevTools, WebPageTest, Google PageSpeed Insights

## 🐛 Debugging and Troubleshooting

### Common Issues

#### Jest Tests Failing
```bash
# Clear Jest cache
npx jest --clearCache

# Run specific test file
npx jest tests/validation.test.js
```

#### Playwright Browser Issues
```bash
# Install browsers
npx playwright install

# Run in headed mode for debugging
npx playwright test --headed
```

#### Accessibility Test Timeouts
```javascript
// Increase timeout in jest.config.js
testTimeout: 30000
```

### Test Data Management
- **Mock API responses** for consistent testing
- **Use test-specific data** that doesn't affect production
- **Clean up test data** after each test run

## 📈 Test Metrics and KPIs

### Quality Gates
- ✅ **Unit Test Coverage**: ≥ 70%
- ✅ **E2E Test Pass Rate**: ≥ 95%
- ✅ **Accessibility Score**: ≥ 90 (Lighthouse)
- ✅ **Performance Score**: ≥ 85 (Lighthouse)

### Monitoring
- **Test Execution Time**: Track and optimize
- **Flaky Test Detection**: Identify unreliable tests
- **Coverage Trends**: Monitor over time
- **CI/CD Pipeline Health**: Track build success rates

## 🎯 Best Practices

### Writing Tests
- **Descriptive test names** that explain the behavior being tested
- **Arrange-Act-Assert** pattern for clear test structure
- **Independent tests** that don't rely on each other
- **Fast execution** to enable frequent running

### Test Organization
- **One concept per test** - avoid testing multiple things
- **Descriptive assertions** with clear failure messages
- **DRY principle** - extract common setup code
- **Regular maintenance** - remove obsolete tests

### Accessibility Testing
- **Test with real screen readers** (NVDA, JAWS, VoiceOver)
- **Color contrast testing** with actual color values
- **Keyboard navigation testing** for all interactive elements
- **Mobile accessibility** testing with touch devices

---

## 🚀 Next Steps

1. **Run the test suite**: `npm run test:all`
2. **Review coverage reports**: `npm run test:coverage`
3. **Set up CI/CD pipeline** with automated testing
4. **Add visual regression testing** with tools like Chromatic
5. **Implement API testing** for backend integration

---

**This testing suite ensures the Properties 4 Creations website maintains high quality standards across functionality, accessibility, and performance.** 🎉
