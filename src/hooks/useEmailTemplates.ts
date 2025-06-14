import { useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
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
  isSaving: boolean;
  isSendingTest: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error(`Error fetching templates: ${res.status}`);
  return res.json();
});

/**
 * Custom hook for managing email templates
 */
export function useEmailTemplates(): UseEmailTemplatesReturn {
  const { toast } = useToast();
  const {
    data: templates = [],
    error,
    isLoading,
    mutate
  } = useSWR<EmailTemplate[]>('/api/settings/email-templates', fetcher, {
    revalidateOnFocus: false,
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // Save a template
  const saveTemplate = async (template: EmailTemplate): Promise<EmailTemplate | null> => {
    try {
      setIsSaving(true);
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
      // Optimistically update the cache
      await mutate(async (current = []) => {
        const index = current.findIndex(t => t.id === savedTemplate.id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = savedTemplate;
          return updated;
        }
        return [...current, savedTemplate];
      }, false);
      toast({
        title: 'Template Saved',
        description: `The ${template.name} template has been saved successfully.`,
      });
      return savedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save email template';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Send a test email
  const sendTestEmail = async (
    templateId: string,
    testEmail: string,
    testData: Record<string, string>
  ): Promise<boolean> => {
    try {
      setIsSendingTest(true);
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
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSendingTest(false);
    }
  };

  // Refresh templates
  const refreshTemplates = async (): Promise<void> => {
    await mutate();
  };

  return {
    templates,
    isLoading,
    error: error ? (error.message || 'Failed to fetch email templates') : null,
    saveTemplate,
    sendTestEmail,
    refreshTemplates,
    isSaving,
    isSendingTest,
  };
} 