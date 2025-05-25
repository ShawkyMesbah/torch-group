"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

// Form validation schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  variant?: "inline" | "stacked";
}

export function NewsletterForm({ variant = "inline" }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      name: "",
    }
  });
  
  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw new Error(responseData.message || "Failed to subscribe to newsletter");
        }
      } else {
        // Reset form on success
        form.reset();
        
        // Show success message
        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (variant === "inline") {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <Input 
            type="email" 
            placeholder="Your email address" 
            {...form.register("email")}
            disabled={isSubmitting}
            aria-invalid={!!form.formState.errors.email}
            className="bg-black/50 border-gray-800 focus:border-red-500 h-12 text-white placeholder:text-gray-400"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-400 absolute -bottom-5 left-0">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <Button 
          type="submit"
          disabled={isSubmitting} 
          className="bg-red-600 hover:bg-red-700 text-white h-12 px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Subscribing...
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    );
  }
  
  // Stacked variant
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input 
          id="email"
          type="email" 
          placeholder="Enter your email" 
          {...form.register("email")}
          disabled={isSubmitting}
          aria-invalid={!!form.formState.errors.email}
          className="w-full"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name (Optional)
        </Label>
        <Input 
          id="name"
          type="text" 
          placeholder="Your name" 
          {...form.register("name")}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
      
      <Button 
        type="submit"
        disabled={isSubmitting} 
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Subscribing...
          </>
        ) : (
          "Subscribe to Newsletter"
        )}
      </Button>
    </form>
  );
} 