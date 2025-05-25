# Testing Framework Documentation

This document outlines the testing approach for the Torch Group project.

## Overview

The testing framework is designed to ensure the reliability and functionality of the Torch Group application. We use Jest as the testing runner and combine it with React Testing Library for component testing.

## Testing Structure

Tests are organized into the following categories:

1. **Unit Tests**: For utility functions and small, isolated pieces of code
2. **Component Tests**: For UI components with focus on behavior rather than implementation
3. **API Tests**: For API routes and endpoints
4. **Integration Tests**: For testing interactions between multiple components or services

## Test Location

- Tests are located in `src/__tests__/` directory
- The directory structure mirrors the structure of the source code:
  - `src/__tests__/utils/` - For utility function tests
  - `src/__tests__/components/` - For UI component tests
  - `src/__tests__/api/` - For API route tests
  - `src/__tests__/integration/` - For integration tests

## Running Tests

We have several npm scripts for running tests:

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Run tests with coverage report

## Writing Tests

### Unit Tests

Unit tests should be small, focused, and test one thing at a time. Example:

```typescript
import { formatDate } from '@/utils/helpers';

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const result = formatDate('2025-05-15');
    expect(result).toContain('May 15, 2025');
  });
});
```

### Component Tests

Component tests should focus on behavior and user interactions. We use React Testing Library to encourage testing from a user's perspective. Example:

```typescript
import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click Me</Button>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Tests

API tests should verify the correct functioning of API routes. Example:

```typescript
import { GET } from '@/app/api/hello/route';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      status: 200,
      json: async () => data,
    })),
  },
}));

describe('Hello API', () => {
  it('returns a greeting', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
});
```

## Best Practices

1. **Mock Dependencies**: Use Jest's mocking capabilities to isolate the code under test
2. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
3. **Use Descriptive Test Names**: Make test names clear and descriptive
4. **Keep Tests Fast**: Tests should run quickly to encourage frequent testing
5. **Maintain Test Independence**: Tests should not depend on each other

## Mocking Strategies

### Mocking API Calls

```typescript
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      status: 200,
      json: async () => data,
    })),
  },
}));
```

### Mocking Global Objects

```typescript
const fixedDate = new Date('2025-05-15T10:00:00.000Z');
jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
// Don't forget to restore after test
jest.restoreAllMocks();
```

### Mocking Modules

```typescript
jest.mock('@/utils/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' })),
}));
```

## Coverage Goals

For this project, we aim to achieve:

- 80% coverage for utility functions
- 70% coverage for UI components
- 70% coverage for API routes
- Focus on critical user flows

## Future Enhancements

1. Add end-to-end tests with Playwright or Cypress
2. Implement visual regression testing
3. Add performance tests for critical pages
4. Set up continuous integration with GitHub Actions 