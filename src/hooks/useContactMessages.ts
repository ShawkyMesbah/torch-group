import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ContactMessage } from '@/types';

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all contact messages
  const fetchMessages = useCallback(async (filters?: { isRead?: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters?.isRead !== undefined) {
        queryParams.append('isRead', filters.isRead.toString());
      }

      const url = `/api/contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch contact messages');
      }

      const data = await response.json();
      setMessages(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contact messages';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a message as read/unread
  const markMessageAsRead = useCallback(async (id: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update message status');
      }

      // Update local state
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, isRead } : message
        )
      );

      toast({
        title: 'Success',
        description: `Message marked as ${isRead ? 'read' : 'unread'}`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  // Delete a message
  const deleteMessage = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete message');
      }

      // Update local state
      setMessages(prev => prev.filter(message => message.id !== id));

      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    markMessageAsRead,
    deleteMessage,
  };
} 