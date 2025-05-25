import {
  sendContactFormNotification,
  sendContactFormConfirmation,
  sendNewsletterConfirmation,
  sendNewsletterSubscriptionNotification
} from '@/lib/email';

// Mock the resend module
jest.mock('@/lib/resend', () => ({
  __esModule: true,
  default: {
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })
    }
  }
}));

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('sendContactFormNotification', () => {
    it('should send a notification email to admin', async () => {
      const mockContactData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        subject: 'Test Subject',
        message: 'This is a test message',
        attachment: 'https://example.com/file.pdf'
      };
      
      const result = await sendContactFormNotification(mockContactData);
      
      expect(result.success).toBe(true);
    });
  });
  
  describe('sendContactFormConfirmation', () => {
    it('should send a confirmation email to the user', async () => {
      const mockContactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };
      
      const result = await sendContactFormConfirmation(mockContactData);
      
      expect(result.success).toBe(true);
    });
  });
  
  // More tests would go here for newsletter functions
});
