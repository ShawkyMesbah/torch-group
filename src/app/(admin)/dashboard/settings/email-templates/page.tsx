"use client";

import React, { useState, useEffect } from "react";
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, RefreshCw, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useEmailTemplates, EmailTemplate } from "@/hooks/useEmailTemplates";
import { EmailTemplateEditor } from "@/components/dashboard/settings/EmailTemplateEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function EmailTemplatesPage() {
  const { templates, isLoading, error, saveTemplate, sendTestEmail, refreshTemplates, isSaving, isSendingTest } = useEmailTemplates();
  
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  
  // Set active template when templates load
  useEffect(() => {
    if (templates.length > 0 && !activeTemplate) {
      setActiveTemplate(templates[0]);
    }
  }, [templates, activeTemplate]);
  
  const handleSaveTemplate = async (template: EmailTemplate) => {
    try {
      await saveTemplate(template);
      
      // Update active template
      setActiveTemplate(template);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };
  
  const handleResetTemplate = () => {
    if (!activeTemplate) return;
    
    const original = templates.find(t => t.id === activeTemplate.id);
    if (original) {
      setActiveTemplate(original);
    }
  };
  
  const handleSendTest = async (email: string, variables: Record<string, string>) => {
    if (!activeTemplate) return;
    
    try {
      await sendTestEmail(activeTemplate.id, email, variables);
    } catch (error) {
      console.error("Error sending test email:", error);
    }
  };
  
  // Helper function to get template type badge color
  const getTemplateBadgeColor = (templateId: string) => {
    switch (templateId) {
      case 'contact_notification':
      case 'newsletter_notification':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'contact_confirmation':
      case 'newsletter_confirmation':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };
  
  // Helper function to get template type label
  const getTemplateTypeLabel = (templateId: string) => {
    switch (templateId) {
      case 'contact_notification':
      case 'newsletter_notification':
        return "Admin Notification";
      case 'contact_confirmation':
      case 'newsletter_confirmation':
        return "User Confirmation";
      default:
        return "System Email";
    }
  };
  
  // Loading state
  if (isLoading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-lg font-medium">Loading email templates...</p>
        </div>
      </div>
    );
  }

  // No templates state
  if (!isLoading && templates.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Email Templates</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and customize email templates sent by the system
            </p>
          </div>
          
          <Button onClick={refreshTemplates}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Templates
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-xl font-medium">No Email Templates Found</h3>
              <p className="text-gray-500">
                No email templates were found. Please refresh or check your configuration.
              </p>
              <Button onClick={refreshTemplates}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and customize email templates sent by the system
          </p>
        </div>
        
        <Button variant="outline" onClick={refreshTemplates}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Templates
        </Button>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Template selector */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Select a template to edit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors duration-200 border ${
                      activeTemplate?.id === template.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setActiveTemplate(template)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-sm">
                        {template.name}
                      </h3>
                      <Badge className={`${getTemplateBadgeColor(template.id)} text-xs font-normal`}>
                        {getTemplateTypeLabel(template.id)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                    {template.lastUpdated && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Updated: {template.lastUpdated}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertTitle>Email Variables</AlertTitle>
              <AlertDescription>
                Use <code className="text-xs bg-muted p-1 rounded">${"{variable}"}</code> syntax to insert dynamic content in your templates.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        
        {/* Template editor */}
        <div className="md:col-span-3">
          {activeTemplate ? (
            <EmailTemplateEditor 
              template={activeTemplate}
              onSave={handleSaveTemplate}
              onReset={handleResetTemplate}
              onSendTest={handleSendTest}
              isLoading={isLoading}
              isSaving={isSaving}
              isSendingTest={isSendingTest}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <Mail className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="text-xl font-medium">Select a Template</h3>
                  <p className="text-gray-500">
                    Please select an email template from the list to edit its content.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 