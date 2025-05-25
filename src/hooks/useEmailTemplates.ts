import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Template types
export type TemplateType = 
  | "contact_notification" 
  | "contact_confirmation" 
  | "newsletter_confirmation" 
  | "newsletter_notification";

// Template interface
export interface EmailTemplate {
  id: TemplateType;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
  description: string;
  lastUpdated?: string;
}

// Hook return type
interface UseEmailTemplatesReturn {
  templates: EmailTemplate[];
  isLoading: boolean;
  error: string | null;
  saveTemplate: (template: EmailTemplate) => Promise<EmailTemplate | null>;
  sendTestEmail: (templateId: string, testEmail: string, testData: Record<string, string>) => Promise<boolean>;
  refreshTemplates: () => Promise<void>;
}

/**
 * Custom hook for managing email templates
 */
export function useEmailTemplates(): UseEmailTemplatesReturn {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch templates on hook mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch all templates
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings/email-templates');
      
      if (!response.ok) {
        throw new Error(`Error fetching templates: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch email templates';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a template
  const saveTemplate = async (template: EmailTemplate): Promise<EmailTemplate | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      });
      
      if (!response.ok) {
        throw new Error(`Error saving template: ${response.status}`);
      }
      
      const savedTemplate = await response.json();
      
      // Update the template in the local state
      setTemplates(prevTemplates => {
        const index = prevTemplates.findIndex(t => t.id === savedTemplate.id);
        if (index !== -1) {
          const updated = [...prevTemplates];
          updated[index] = savedTemplate;
          return updated;
        }
        return [...prevTemplates, savedTemplate];
      });
      
      toast({
        title: 'Template Saved',
        description: `The ${template.name} template has been saved successfully.`,
      });
      
      return savedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save email template';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a test email
  const sendTestEmail = async (
    templateId: string,
    testEmail: string,
    testData: Record<string, string>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/settings/email-templates/${templateId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testEmail,
          testData
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error sending test email: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({
        title: 'Test Email Sent',
        description: result.message || 'A test email has been sent successfully.',
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test email';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh templates
  const refreshTemplates = async (): Promise<void> => {
    await fetchTemplates();
  };

  return {
    templates,
    isLoading,
    error,
    saveTemplate,
    sendTestEmail,
    refreshTemplates
  };
} 