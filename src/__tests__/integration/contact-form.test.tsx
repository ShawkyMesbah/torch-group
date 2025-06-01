import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/forms/contact-form';
import { useToast } from '@/components/ui/use-toast';

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock the file upload component
jest.mock('@/components/ui/file-upload', () => ({
  FileUpload: ({ onUploadComplete }: { onUploadComplete: (urls: string[]) => void }) => (
    <button 
      onClick={() => onUploadComplete(['https://example.com/test-file.pdf'])}
      data-testid="mock-file-upload"
    >
      Upload File
    </button>
  ),
}));

// Mock react-phone-input-2 to a simple input
jest.mock('react-phone-input-2', () => ({
  __esModule: true,
  default: ({ value, onChange, inputProps }: any) => (
    <input
      data-testid="mock-phone-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      {...(inputProps || {})}
    />
  ),
}));

describe('ContactForm Integration', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    // Mock fetch for API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful form submission with file upload', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test message for integration test.');

    // Trigger file upload
    await user.click(screen.getByTestId('mock-file-upload'));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com'),
        })
      );
    });

    // Verify success toast
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: expect.stringContaining('Your message has been sent'),
    });
  });

  it.skip('should handle phone verification flow', async () => {
    // Skipped: not implemented in UI
  });

  it('should handle form validation errors', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check for validation errors
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<ContactForm />);

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify error toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: expect.stringContaining('error'),
        variant: 'destructive',
      });
    });
  });

  it('should validate phone number format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Test invalid formats
    await user.type(screen.getByLabelText(/phone/i), '123'); // Too short
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();

    // Clear and try invalid format
    await user.clear(screen.getByLabelText(/phone/i));
    await user.type(screen.getByLabelText(/phone/i), 'abc123');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();

    // Test valid international format
    await user.clear(screen.getByLabelText(/phone/i));
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.queryByText(/invalid phone number/i)).not.toBeInTheDocument();
  });

  it('should handle file size limits', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Mock large file upload
    const largeFile = new File(['x'.repeat(5 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('mock-file-upload');
    
    // Trigger file upload
    await user.click(fileInput); // Simulate file upload for mock

    // Verify error message
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: expect.stringContaining('file size limit'),
      variant: 'destructive',
    });
  });

  it('should handle rate limiting', async () => {
    const user = userEvent.setup();
    
    // Mock rate limit response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many requests' }),
    });

    render(<ContactForm />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify rate limit message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: expect.stringContaining('too many requests'),
        variant: 'destructive',
      });
    });
  });

  it('should handle concurrent form submissions', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit form multiple times quickly
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);

    // Verify only one API call was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('DEBUG: minimal submit test', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    console.log('DEBUG: Rendering ContactForm');
    render(<ContactForm />);

    // Only fill required fields
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    console.log('DEBUG: Typed name');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    console.log('DEBUG: Typed email');
    await user.type(screen.getByLabelText(/message/i), 'Test message for debug.');
    console.log('DEBUG: Typed message');

    console.log('DEBUG: Submitting form');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    console.log('DEBUG: Clicked submit');

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    console.log('DEBUG: Fetch called');

    // Wait for toast
    expect(mockToast).toHaveBeenCalled();
    console.log('DEBUG: Toast called');
  });

  it('ENVIRONMENT: minimal input interaction', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((e) => {
      e.preventDefault();
    });
    render(
      <form onSubmit={handleSubmit}>
        <label htmlFor="test-input">Test</label>
        <input id="test-input" name="test" />
        <button type="submit">Submit</button>
      </form>
    );
    await user.type(screen.getByLabelText(/test/i), 'Hello');
    expect(screen.getByLabelText(/test/i)).toHaveValue('Hello');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });
}); 