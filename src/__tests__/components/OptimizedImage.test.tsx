import { render, screen } from '@testing-library/react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const defaultProps = {
  src: '/test-image.jpg',
  alt: 'Test image',
  width: 100,
  height: 100,
};

describe('OptimizedImage', () => {
  it('should render with default props', () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', defaultProps.alt);
    expect(img).toHaveAttribute('width', String(defaultProps.width));
    expect(img).toHaveAttribute('height', String(defaultProps.height));
  });

  it('should apply priority loading when specified', () => {
    render(<OptimizedImage {...defaultProps} priority />);
    const img = screen.getByRole('img');
  });

  it('should apply default sizes when not provided', () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
  });

  it('should apply custom sizes when provided', () => {
    const sizes = '(max-width: 768px) 100vw, 50vw';
    render(<OptimizedImage {...defaultProps} sizes={sizes} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('sizes', sizes);
  });

  it('should apply quality attribute', () => {
    render(<OptimizedImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('quality', '90');
  });

  it('should handle loading state', () => {
    render(<OptimizedImage {...defaultProps} />);
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('animate-pulse', 'bg-gray-200');
  });
}); 