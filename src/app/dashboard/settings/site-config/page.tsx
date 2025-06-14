"use client";

import { useState, useEffect } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SiteConfigPage() {
  const { config, isLoading, isSaving, error, saveConfig } = useSiteConfig();
  const [form, setForm] = useState({
    siteTitle: "",
    siteDescription: "",
    siteLogoUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setForm({
        siteTitle: config.siteTitle || "",
        siteDescription: config.siteDescription || "",
        siteLogoUrl: config.siteLogoUrl || ""
      });
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveConfig(form);
    if (success) {
      toast({
        title: "Site Configuration Saved",
        description: "Your site settings have been updated."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save site configuration.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>Update your site name, description, and logo.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="siteTitle" className="block font-medium mb-1">Site Title</label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={form.siteTitle}
                onChange={handleChange}
                placeholder="Torch Group"
                disabled={isLoading || isSaving}
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block font-medium mb-1">Site Description</label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={form.siteDescription}
                onChange={handleChange}
                placeholder="A brief description of your site."
                disabled={isLoading || isSaving}
              />
            </div>
            <div>
              <label htmlFor="siteLogoUrl" className="block font-medium mb-1">Site Logo URL</label>
              <Input
                id="siteLogoUrl"
                name="siteLogoUrl"
                value={form.siteLogoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                disabled={isLoading || isSaving}
              />
            </div>
            {form.siteLogoUrl && (
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">Preview:</span>
                <img src={form.siteLogoUrl} alt="Site Logo Preview" className="h-12 w-auto rounded bg-white border" />
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm">{error.message || "Failed to load site config."}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || isSaving}
              aria-label="Save site configuration"
              className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Settings
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 