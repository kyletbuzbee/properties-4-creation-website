# CI/CD Configuration

This directory contains the GitHub Actions workflows for the Properties 4 Creations website.

## Workflows

### `ci.yml` - Main CI/CD Pipeline

The main continuous integration and deployment pipeline that runs on every push and pull request.

**Jobs:**
1. **Quality Checks** - Code quality and linting
2. **Unit Tests** - Jest unit tests with coverage reporting
3. **Build Verification** - Build process validation
4. **E2E Tests** - Playwright end-to-end tests
5. **Accessibility Tests** - axe-core accessibility validation
6. **Performance Tests** - Lighthouse and custom performance metrics
7. **Security Scanning** - npm audit and Snyk security analysis
8. **Deployment** - Automatic deployment to production (main branch only)
9. **Quality Gate** - Final validation of all checks

**Quality Gates:**
- All tests must pass
- Code coverage must meet thresholds (70%)
- Accessibility tests must pass
- Performance benchmarks must be met
- Security vulnerabilities must be below threshold

### `deploy.yml` - Manual Deployment

Allows manual deployment to different environments with optional quality gate bypass.

## Test Structure

### Unit Tests (`tests/unit/`)
- Jest-based unit tests for JavaScript functionality
- Code coverage reporting
- Mock setup for DOM and external dependencies

### E2E Tests (`tests/e2e/`)
- Playwright-based end-to-end tests
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Accessibility validation with axe-core
- Performance monitoring

### Test Scripts

```bash
# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:accessibility

# Run performance tests
npm run test:performance

# Run quality checks
npm run quality:check
```

## Environment Variables

Required secrets for GitHub Actions:

- `CODECOV_TOKEN` - For code coverage reporting
- `SNYK_TOKEN` - For security scanning
- `NETLIFY_AUTH_TOKEN` - For Netlify deployment (optional)
- `NETLIFY_SITE_ID` - For Netlify deployment (optional)

## Quality Standards

### Code Coverage
- Minimum 70% coverage for all metrics (branches, functions, lines, statements)

### Accessibility
- WCAG 2.1 AA compliance
- No color contrast violations
- Proper heading structure
- Keyboard navigation support

### Performance
- Page load time under 3 seconds
- First Contentful Paint under 1.5 seconds
- Optimized image loading
- No console errors

### Security
- No high-severity vulnerabilities
- Regular dependency updates
- Secure deployment practices

## Usage

### Local Development
```bash
# Run quality checks locally
npm run quality:check

# Run all tests
npm run test:all

# Build and verify
npm run build:verify
```

### CI/CD Pipeline
The pipeline automatically runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### Manual Deployment
Use the `deploy.yml` workflow to manually deploy to staging or production environments.

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check for environment differences
   - Verify dependencies are properly installed
   - Check for timing issues in E2E tests

2. **Build artifacts not found**
   - Ensure build step completes successfully
   - Check artifact upload configuration

3. **Coverage reporting issues**
   - Verify Codecov token is set
   - Check coverage configuration in jest.config.js

4. **Accessibility test failures**
   - Review axe-core violation reports
   - Check for missing alt text, labels, or ARIA attributes

### Debugging

Enable verbose logging in CI by setting:
```yaml
env:
  DEBUG: 'pw:api'
```

View test results and artifacts in the GitHub Actions UI after workflow completion.