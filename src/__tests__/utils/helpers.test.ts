import { formatDate, slugify, truncateText, isValidEmail } from '@/utils/helpers';

describe('Helper Utilities', () => {
  describe('formatDate', () => {
    it('should format a date string correctly', () => {
      const dateString = '2025-05-15T10:30:00.000Z';
      const formatted = formatDate(dateString);
      
      // This will vary by timezone, so we'll check for common elements
      expect(formatted).toContain('2025');
      expect(formatted).toContain('May 15');
    });

    it('should handle Date objects', () => {
      const dateObj = new Date('2025-05-15T10:30:00.000Z');
      const formatted = formatDate(dateObj);
      
      expect(formatted).toContain('2025');
      expect(formatted).toContain('May 15');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This Is A Test')).toBe('this-is-a-test');
      expect(slugify('Special@Characters!')).toBe('specialcharacters');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text to the specified length and add ellipsis', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('should not truncate if text is shorter than max length', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle empty strings', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate a correct email address', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });
}); 