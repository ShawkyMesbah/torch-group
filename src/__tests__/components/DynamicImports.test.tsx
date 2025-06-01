import { render, screen } from '@testing-library/react';
import { withDynamicImport } from '@/components/DynamicImports';
import { Suspense } from 'react';

const TestComponent = () => <div>Test Component</div>;

describe('withDynamicImport', () => {
  beforeEach(() => {
    // Clear module cache between tests
    jest.resetModules();
  });

  it('should render loading state initially', () => {
    const DynamicComponent = withDynamicImport(
      () => Promise.resolve({ default: TestComponent })
    );

    render(<DynamicComponent />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render the component after loading', async () => {
    const DynamicComponent = withDynamicImport(
      () => Promise.resolve({ default: TestComponent })
    );

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicComponent />
      </Suspense>
    );

    const content = await screen.findByText('Test Component');
    expect(content).toBeInTheDocument();
  });

  it('should handle loading errors gracefully', async () => {
    const mockError = new Error('Failed to load');
    const DynamicComponent = withDynamicImport(
      () => Promise.reject(mockError)
    );

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicComponent />
      </Suspense>
    );

    const errorMessage = await screen.findByText(/Error loading component/);
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  it('should accept custom loading component', () => {
    const CustomLoader = () => <div>Custom Loading...</div>;
    const DynamicComponent = withDynamicImport(
      () => Promise.resolve({ default: TestComponent }),
      CustomLoader
    );

    render(<DynamicComponent />);
    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });
}); 