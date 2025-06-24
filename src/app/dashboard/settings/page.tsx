"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GripVertical, Save, Mail, ArrowRight, Settings, Edit } from "lucide-react";
import { useAboutTorch } from "@/hooks/useAboutTorch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Define types for homepage sections
interface HomepageSection {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
}

export default function SettingsPage() {
  // Initial state with mock data
  const [sections, setSections] = useState<HomepageSection[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // About Torch content state
  const { aboutContent, loading, error, updateAboutContent } = useAboutTorch();
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [isAboutSaving, setIsAboutSaving] = useState(false);
  
  // Add a loading state to the sections
  const [sectionsLoading, setSectionsLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Fetch sections when component mounts
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true);
        const response = await fetch('/api/settings/homepage-sections');
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          console.error('Failed to fetch homepage sections');
        }
      } catch (error) {
        console.error('Error fetching homepage sections:', error);
      } finally {
        setSectionsLoading(false);
      }
    };

    fetchSections();
  }, []);
  
  // Update local state when aboutContent changes
  useEffect(() => {
    if (aboutContent) {
      setAboutTitle(aboutContent.title);
      setAboutText(aboutContent.content);
    }
  }, [aboutContent]);

  // Toggle section visibility
  const toggleSectionVisibility = (id: string) => {
    setSections(
      sections.map(section =>
        section.id === id
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      
      const response = await fetch('/api/settings/homepage-sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sections),
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Clear success message after 3 seconds
      } else {
        const errorData = await response.json();
        setSaveError(errorData.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error("Error saving section order:", error);
      setSaveError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save About Torch content
  const saveAboutContent = async () => {
    if (!aboutTitle || !aboutText) return;
    setIsAboutSaving(true);
    try {
      await updateAboutContent({
        title: aboutTitle,
        content: aboutText
      });
      toast({ title: "About Torch updated successfully", variant: "default" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "Failed to update About Torch.", variant: "destructive" });
    } finally {
      setIsAboutSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Settings</h1>
      
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="mb-6 bg-gray-800 border border-gray-700 flex flex-wrap gap-x-2 gap-y-2">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About Torch</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="homepage" className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>Homepage Section Management</CardTitle>
              <CardDescription>
                Drag and drop to reorder sections or toggle visibility. Changes will be reflected on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sectionsLoading ? (
                <div className="flex flex-col space-y-3">
                  <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                  <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                  <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                  <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                  <div className="h-14 bg-gray-800 animate-pulse rounded-md"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div
                          key={section.id}
                          className={`flex items-center justify-between p-4 rounded-md bg-gray-900/50 border border-gray-800 ${!section.enabled ? 'opacity-60' : ''} gap-x-4 gap-y-2 flex-wrap`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-gray-400 cursor-move">
                              <GripVertical size={20} />
                            </div>
                            <span className="font-medium text-base sm:text-lg md:text-xl">{section.title}</span>
                            {section.id === "hero" && (
                              <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded shadow-sm">Required</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`toggle-${section.id}`}
                              checked={section.enabled}
                              onCheckedChange={() => section.id !== "hero" && toggleSectionVisibility(section.id)}
                              disabled={section.id === "hero"}
                              aria-label={`Toggle visibility for ${section.title}`}
                              className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary min-h-10 px-4 py-2"
                            />
                            <Label htmlFor={`toggle-${section.id}`} className="text-sm">
                              {section.enabled ? "Visible" : "Hidden"}
                            </Label>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="mt-6 flex flex-col space-y-3">
                    {saveError && (
                      <div className="p-3 rounded-md bg-red-900/30 border border-red-700 text-red-200">
                        {saveError}
                      </div>
                    )}
                    
                    {saveSuccess && (
                      <div className="p-3 rounded-md bg-green-900/30 border border-green-700 text-green-200">
                        Homepage sections updated successfully!
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={saveChanges} 
                        disabled={isSaving}
                        className="w-40 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                        aria-label="Save homepage section changes"
                      >
                        {isSaving ? (
                          <>
                            <span className="mr-2">Saving...</span>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure SEO settings for your homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>About Torch Content</CardTitle>
              <CardDescription>
                Edit the content that appears in the About Torch section on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-40 bg-gray-700 rounded w-full"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="about-title">Section Title</Label>
                      <Input
                        id="about-title"
                        value={aboutTitle}
                        onChange={(e) => setAboutTitle(e.target.value)}
                        placeholder="Enter a title for the About section"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="about-content">About Content</Label>
                      <Textarea
                        id="about-content"
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        placeholder="Enter the content for the About section"
                        className="min-h-[200px] bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={saveAboutContent} 
                      disabled={isAboutSaving || !aboutTitle || !aboutText}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isAboutSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Content
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>Email Template Management</CardTitle>
              <CardDescription>
                Customize email templates sent by the system to users and administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Contact Form Emails</CardTitle>
                        <CardDescription>Notifications and confirmations for contact form submissions</CardDescription>
                      </div>
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Edit templates for contact form notifications sent to administrators and confirmation emails sent to users.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/settings/email-templates" className="w-full">
                      <Button className="w-full">
                        Manage Templates
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card className="border border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Newsletter Emails</CardTitle>
                        <CardDescription>Subscription confirmations and admin notifications</CardDescription>
                      </div>
                      <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Edit templates for newsletter subscription confirmations and admin notifications.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/settings/email-templates" className="w-full">
                      <Button className="w-full">
                        Manage Templates
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="flex justify-center">
                <Link href="/dashboard/settings/email-templates">
                  <Button variant="outline" size="lg">
                    <Edit className="mr-2 h-4 w-4" />
                    Open Email Template Editor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Appearance settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general settings for your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">General settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 