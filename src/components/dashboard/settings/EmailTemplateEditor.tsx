"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Save,
  Eye, 
  Code, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Mail, 
  Copy, 
  CheckCircle2,
  Undo2 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { EmailTemplate } from "@/hooks/useEmailTemplates";

interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => Promise<void>;
  onReset: () => void;
  onSendTest?: (email: string, variables: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
  isSendingTest?: boolean;
}

export function EmailTemplateEditor({
  template,
  onSave,
  onReset,
  onSendTest,
  isLoading = false,
  isSaving = false,
  isSendingTest = false
}: EmailTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(template);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "code">("edit");
  const [showPlainText, setShowPlainText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [showTestUI, setShowTestUI] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { toast } = useToast();
  
  // Reset edited template when input template changes
  useEffect(() => {
    setEditedTemplate(template);
    setHasUnsavedChanges(false);
  }, [template]);
  
  // Initialize preview values with defaults for each variable
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    template.variables.forEach(variable => {
      // Set default preview values
      switch (variable) {
        case "name":
          initialValues[variable] = "John Doe";
          break;
        case "email":
          initialValues[variable] = "john.doe@example.com";
          break;
        case "phone":
          initialValues[variable] = "+1 (555) 123-4567";
          break;
        case "subject":
          initialValues[variable] = "Website Inquiry";
          break;
        case "message":
          initialValues[variable] = "Hello,\n\nI'm interested in learning more about your services. Could you please provide additional information?\n\nThank you.";
          break;
        case "attachment":
          initialValues[variable] = "https://example.com/attachment.pdf";
          break;
        default:
          initialValues[variable] = `[${variable}]`;
      }
    });
    setPreviewValues(initialValues);
  }, [template.variables]);
  
  // Generate preview HTML when template or values change
  useEffect(() => {
    let preview = editedTemplate.html;
    let textPreview = editedTemplate.text;
    
    // Replace variables in the template
    Object.entries(previewValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key}(\\s\\|\\|\\s[^}]+)?\\}`, "g");
      preview = preview.replace(regex, value);
      textPreview = textPreview.replace(regex, value);
    });
    
    setPreviewHtml(preview);
    setPreviewText(textPreview);
  }, [editedTemplate, previewValues]);
  
  const handleInputChange = (field: keyof EmailTemplate, value: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };
  
  const handlePreviewValueChange = (variable: string, value: string) => {
    setPreviewValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };
  
  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The template content has been copied to your clipboard.",
    });
  };
  
  const handleSave = async () => {
    try {
      await onSave(editedTemplate);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };
  
  const handleSendTest = async () => {
    if (!onSendTest || !testEmail) return;
    
    try {
      await onSendTest(testEmail, previewValues);
      // Clear test email after sending
      setTestEmail("");
      setShowTestUI(false);
    } catch (error) {
      console.error("Error sending test email:", error);
    }
  };
  
  const insertVariable = (variable: string) => {
    // Get the currently focused element
    const activeElement = document.activeElement as HTMLTextAreaElement;
    
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const currentValue = activeElement.value;
      const newValue = `${currentValue.substring(0, start)}\${${variable}}${currentValue.substring(end)}`;
      
      // Determine which field is being edited
      if (activeElement.id === 'template-html') {
        handleInputChange('html', newValue);
      } else if (activeElement.id === 'template-text') {
        handleInputChange('text', newValue);
      } else if (activeElement.id === 'template-subject') {
        handleInputChange('subject', newValue);
      }
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        activeElement.focus();
        const newPosition = start + variable.length + 3; // +3 for the ${} chars
        activeElement.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };
  
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Never';
    return dateStr;
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            {editedTemplate.name}
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2">Unsaved Changes</Badge>
            )}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {editedTemplate.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onReset} 
            disabled={isLoading || isSaving || isSendingTest || !hasUnsavedChanges}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowTestUI(!showTestUI)}
            disabled={isLoading || isSaving || isSendingTest}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Test
          </Button>
          
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isSaving || isSendingTest || !hasUnsavedChanges}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Template
          </Button>
        </div>
      </div>
      
      {/* Send test email UI */}
      {showTestUI && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="test-email">Send Test Email To</Label>
                <Input
                  id="test-email"
                  placeholder="recipient@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleSendTest} 
                disabled={isLoading || isSaving || isSendingTest || !testEmail}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send Test
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowTestUI(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="edit" value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">HTML/Text</TabsTrigger>
              </TabsList>
              
              {viewMode === "preview" && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                    className={previewMode === "desktop" ? "bg-muted" : ""}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                    className={previewMode === "mobile" ? "bg-muted" : ""}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {viewMode === "code" && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-plain-text"
                      checked={showPlainText}
                      onCheckedChange={setShowPlainText}
                    />
                    <Label htmlFor="show-plain-text">Plain Text</Label>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(showPlainText ? previewText : previewHtml)}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="edit" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input
                    id="template-subject"
                    value={editedTemplate.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-html">Email HTML Content</Label>
                  <Textarea
                    id="template-html"
                    value={editedTemplate.html}
                    onChange={(e) => handleInputChange('html', e.target.value)}
                    className="mt-1 font-mono text-sm h-[400px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-text">Email Plain Text Content</Label>
                  <Textarea
                    id="template-text"
                    value={editedTemplate.text}
                    onChange={(e) => handleInputChange('text', e.target.value)}
                    className="mt-1 font-mono text-sm h-[150px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className={`border rounded-md overflow-hidden ${
                previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"
              }`}>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b flex justify-between items-center">
                  <div className="text-sm font-medium">
                    <span className="text-gray-500">Subject:</span> {editedTemplate.subject}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 min-h-[400px]">
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewHtml }} 
                    className="prose dark:prose-invert max-w-none" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b">
                  <div className="text-sm font-medium">
                    {showPlainText ? "Plain Text Version" : "HTML Version"}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 overflow-auto h-[400px]">
                  <pre className="text-sm font-mono">
                    {showPlainText ? previewText : previewHtml}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatDate(editedTemplate.lastUpdated)}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave} 
              disabled={isLoading || isSaving || isSendingTest || !hasUnsavedChanges}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
              <CardDescription>
                Click a variable to insert it at the cursor position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Available Variables</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <Badge 
                        key={variable}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => insertVariable(variable)}
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Preview Values</h3>
                  <div className="space-y-3">
                    {template.variables.map((variable) => (
                      <div key={variable} className="grid grid-cols-3 gap-2 items-center">
                        <Label htmlFor={`preview-${variable}`} className="text-xs">
                          {variable}:
                        </Label>
                        <Input
                          id={`preview-${variable}`}
                          className="col-span-2 h-8 text-xs"
                          value={previewValues[variable] || ''}
                          onChange={(e) => handlePreviewValueChange(variable, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Preview
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowTestUI(!showTestUI)}
                disabled={isLoading || isSaving || isSendingTest}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 