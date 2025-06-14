"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
// Assuming a hook exists or will be created for site config
import { useSiteConfig } from '@/hooks/useSiteConfig';

// Define a basic type for site configuration (should match hook type)
interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  siteLogoUrl?: string;
}


export default function HomepageSettingsPage() {
  const { toast } = useToast();
  const { config, isLoading, isSaving, error, saveConfig } = useSiteConfig();
  const [editedConfig, setEditedConfig] = useState<SiteConfig>({ siteTitle: '', siteDescription: '', siteLogoUrl: '' });

  // Update edited config when config is loaded or changes
  useEffect(() => {
    if (config) {
      setEditedConfig(config);
    }
  }, [config]);

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setEditedConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUploadComplete = (res: { url: string }[]) => {
    if (res && res.length > 0 && res[0].url) {
      setEditedConfig(prev => ({ ...prev, siteLogoUrl: res[0].url }));
      toast({
        title: "Logo Uploaded",
        description: "Site logo uploaded successfully.",
      });
    }
  };

  const handleLogoUploadError = (error: Error) => {
     toast({
      title: "Upload Failed",
      description: error.message,
      variant: "destructive",
    });
  };

  const handleSave = async () => {
    const success = await saveConfig(editedConfig);
    if (success) {
      toast({
        title: "Settings Saved",
        description: "Homepage settings updated successfully.",
      });
    } else {
       toast({
        title: "Save Failed",
        description: error || "An error occurred while saving settings.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
        <p className="ml-4 text-lg font-medium">Loading settings...</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
         <h1 className="text-2xl font-bold">Homepage Settings</h1>
         <Card>
           <CardContent className="text-center py-12">
             <p className="text-red-500">Error loading settings: {error.message || error}</p>
           </CardContent>
         </Card>
      </div>
    );
  }

  // If config is null after loading (e.g., empty state), initialize with defaults
   const currentConfig = editedConfig || { siteTitle: '', siteDescription: '', siteLogoUrl: '' };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Homepage Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage the content and layout of the public homepage.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
           {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic homepage settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">Site Title</Label>
              <Input 
                id="site-title" 
                placeholder="Your Site Title" 
                value={currentConfig.siteTitle}
                onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea 
                id="site-description" 
                placeholder="A brief description of your site" 
                value={currentConfig.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-logo">Site Logo</Label>
               <div className="flex items-center gap-4">
                 <Input
                   id="site-logo"
                   placeholder="URL or upload logo"
                   value={currentConfig.siteLogoUrl || ''}
                   onChange={(e) => handleInputChange('siteLogoUrl', e.target.value)}
                   disabled={isLoading || isSaving}
                 />
                 <FileUpload
                   endpoint="profileImage" // Use an appropriate endpoint, maybe create a new one like "siteLogo"
                   onUploadComplete={handleLogoUploadComplete}
                   onUploadError={handleLogoUploadError}
                   className={isLoading || isSaving ? "pointer-events-none opacity-50" : ""}
                 />
               </div>
               {currentConfig.siteLogoUrl && (
                 <div className="mt-2 flex items-center gap-2">
                   <span className="text-sm text-gray-500 dark:text-gray-400">Current Logo:</span>
                   <a href={currentConfig.siteLogoUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm truncate max-w-xs">{currentConfig.siteLogoUrl}</a>
                 </div>
               )}
            </div>
          </div>
        </CardContent>
         <CardFooter>
           <Button onClick={handleSave} disabled={isLoading || isSaving}>
              {isSaving ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
               <Save className="mr-2 h-4 w-4" />
             )}
             Save Settings
           </Button>
         </CardFooter>
      </Card>

      {/* Add more cards/sections for other homepage configurations (e.g., Hero Section, About Section, etc.) */}

    </div>
  );
} 