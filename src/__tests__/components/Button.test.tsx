import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    // Check that default variant classes are applied
    expect(button).toHaveClass('bg-primary');
  });

  it('renders different variants correctly', () => {
    const { rerender, getByRole } = render(<Button variant="destructive">Destructive</Button>);
    expect(getByRole('button')).toHaveClass('bg-destructive');
    
    rerender(<Button variant="outline">Outline</Button>);
    expect(getByRole('button')).toHaveClass('border');
    expect(getByRole('button')).toHaveClass('bg-background');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(getByRole('button')).toHaveClass('bg-secondary');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    expect(getByRole('button')).toHaveClass('hover:bg-accent');
    
    rerender(<Button variant="link">Link</Button>);
    expect(getByRole('button')).toHaveClass('text-primary');
    expect(getByRole('button')).toHaveClass('hover:underline');
  });

  it('renders different sizes correctly', () => {
    const { rerender, getByRole } = render(<Button size="default">Default</Button>);
    expect(getByRole('button')).toHaveClass('h-9');
    
    rerender(<Button size="sm">Small</Button>);
    expect(getByRole('button')).toHaveClass('h-8');
    
    rerender(<Button size="lg">Large</Button>);
    expect(getByRole('button')).toHaveClass('h-10');
    
    rerender(<Button size="icon">Icon</Button>);
    expect(getByRole('button')).toHaveClass('size-9');
  });

  it('forwards props to the button element', () => {
    const { getByTestId } = render(<Button type="submit" disabled data-testid="test-button">Submit</Button>);
    const button = getByTestId('test-button');
    
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });

  it('adds custom className', () => {
    const { getByRole } = render(<Button className="custom-class">Custom</Button>);
    expect(getByRole('button')).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    
    getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 