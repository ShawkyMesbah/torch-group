'use client';

import * as React from 'react';
import { toast as sonnerToast, type ToastT } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant = 'default' }: ToastProps) {
  sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
    description,
  });
}

// For compatibility with existing code
export function useToast() {
  return {
    toast,
    toasts: [] as ToastT[],
    dismiss: sonnerToast.dismiss,
  };
} 