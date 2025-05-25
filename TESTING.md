# Testing Documentation for Torch Group

This document provides an overview of testing practices, configurations, and examples for the Torch Group project.

## Testing Stack

- **Jest**: Main testing framework
- **React Testing Library**: For testing React components
- **jest-environment-jsdom**: Browser-like environment for tests
- **Mocks**: Implementations for Next.js, Prisma, and other dependencies

## Setup

The project is configured with Jest for testing. The main configuration files are:

- **jest.config.js**: Main Jest configuration file
- **jest.setup.js**: Pre-test setup with mocked implementations

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Structure

Tests are organized in the `src/__tests__` directory, mirroring the main src directory structure:

- **api/**: Tests for API routes
- **components/**: Tests for React components
- **utils/**: Tests for utility functions

## Writing Tests

### API Route Tests

API route tests should test the request handling, response generation, and error cases. Example:

```typescript
// src/__tests__/api/example.test.ts
import { GET, POST } from '@/app/api/example/route';
import { NextRequest } from 'next/server';

describe('Example API Route', () => {
  it('should return data on GET request', async () => {
    const req = new NextRequest('http://localhost:3000/api/example');
    const res = await GET(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('message');
  });
});
```

### Component Tests

Component tests should verify rendering, user interactions, and state changes:

```tsx
// src/__tests__/components/Example.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from '@/components/ExampleComponent';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const mockFn = jest.fn();
    render(<ExampleComponent onClick={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Utility Tests

Tests for utility functions should cover all edge cases:

```typescript
// src/__tests__/utils/example.test.ts
import { formatDate, validateEmail } from '@/utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-01-01');
      expect(formatDate(date)).toBe('Jan 1, 2025');
    });
  });
  
  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

## Mocking

### Mock Prisma Client

Tests use a mock Prisma client to avoid database connections:

```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
      // Add other methods as needed
    },
    // Add other models as needed
  },
}));
```

### Mock Next.js

Next.js features like routing are mocked in `jest.setup.js`:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other methods as needed
  }),
  // Add other hooks as needed
}));
```

## Test Environment Variables

For development mode testing, set these variables:

```typescript
Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
delete process.env.DATABASE_URL;
```

For production mode testing, set these variables:

```typescript
Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
process.env.DATABASE_URL = 'mock:connection-string';
process.env.NEXTAUTH_SECRET = 'mock-secret';
```

## Coverage Goals

The project aims for:
- 80% coverage for utility functions
- 70% coverage for API routes  
- 60% coverage for React components

## Continuous Integration

Tests are automatically run in the CI pipeline for:
- Pull requests to main branch
- Direct pushes to main branch

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Mock External Dependencies**: Always mock external APIs, databases, and services
3. **Test Edge Cases**: Include tests for error handling and boundary conditions
4. **Snapshot Testing**: Use sparingly for UI components that change infrequently
5. **Test Descriptions**: Write clear descriptions of what each test is verifying

## Debugging Tests

To debug tests:
1. Add `console.log` statements
2. Use `test.only()` to run a single test
3. Run Jest with `--verbose` flag for more details

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js](https://nextjs.org/docs/testing) 