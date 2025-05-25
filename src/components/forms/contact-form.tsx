"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, Paperclip } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FileUpload } from "@/components/ui/file-upload";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  verificationCode: z.string().optional(),
  attachment: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [attachment, setAttachment] = useState<string | undefined>();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      verificationCode: "",
      attachment: "",
    }
  });
  
  // Request verification code
  const requestVerificationCode = async () => {
    if (!phoneNumber) return;
    
    setIsVerifying(true);
    
    try {
      const response = await fetch("/api/contact/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }
      
      // Show success message
      toast({
        title: "Verification code sent!",
        description: `We've sent a verification code to ${phoneNumber}.`,
      });
      
      // If we're in development and have a mock code, show it in the console
      if (data.mockCode) {
        console.info(`Development code: ${data.mockCode}`);
      }
      
      setShowVerification(true);
    } catch (error) {
      console.error("Failed to send verification code:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Verify code
  const verifyCode = async () => {
    const code = form.getValues("verificationCode");
    if (!code) return;
    
    setIsVerifying(true);
    
    try {
      const response = await fetch("/api/contact/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
          code: code 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify code");
      }
      
      if (data.verified) {
        // Show success message
        toast({
          title: "Phone verified!",
          description: "Your phone number has been verified successfully.",
        });
        
        setVerified(true);
      } else {
        throw new Error(data.message || "Invalid verification code");
      }
      
    } catch (error) {
      console.error("Failed to verify code:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const onSubmit = async (data: ContactFormValues) => {
    // If phone number is provided but not verified, prompt user to verify
    if (phoneNumber && !verified) {
      toast({
        title: "Phone verification required",
        description: "Please verify your phone number before submitting the form.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Include the verified phone number and attachment in the form data
      const submissionData = {
        ...data,
        phone: phoneNumber,
        phoneVerified: verified,
        attachment: attachment,
      };
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit contact form");
      }
      
      // Reset form on success
      form.reset();
      setPhoneNumber("");
      setShowVerification(false);
      setVerified(false);
      setAttachment(undefined);
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 sm:gap-y-7">
        <div className="space-y-2 group">
          <Label htmlFor="name" className="text-sm font-medium text-white/80">Full Name</Label>
          <div className="relative">
            <Input 
              id="name" 
              {...form.register("name")} 
              placeholder="John Doe" 
              disabled={isSubmitting}
              aria-invalid={!!form.formState.errors.name}
              className="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors placeholder:text-gray-600 focus:placeholder:text-gray-500 group-hover:border-gray-500"
              variant="minimal"
            />
            {/* Animated focus line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 group-focus-within:w-full transition-all duration-300"></div>
          </div>
          {form.formState.errors.name && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
          <div className="relative">
            <Input 
              id="email" 
              type="email" 
              {...form.register("email")} 
              placeholder="john@example.com" 
              disabled={isSubmitting}
              aria-invalid={!!form.formState.errors.email}
              className="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors placeholder:text-gray-600 focus:placeholder:text-gray-500 group-hover:border-gray-500"
              variant="minimal"
            />
            {/* Animated focus line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 group-focus-within:w-full transition-all duration-300"></div>
          </div>
          {form.formState.errors.email && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className={`space-y-2 group ${verified ? 'col-span-2' : 'md:col-span-1'}`}>
          <Label htmlFor="phone" className="text-sm font-medium text-white/80 flex items-center">
            Phone 
            {verified && (
              <span className="ml-2 flex items-center text-green-500 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow relative">
              <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                disabled={isSubmitting || verified}
                inputClass="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors placeholder:text-gray-600 focus:placeholder:text-gray-500 !h-auto !pl-10"
                containerClass="!w-full"
                buttonClass="!border-0 !bg-transparent !top-1"
                dropdownClass="!bg-gray-900 !text-white !border-gray-700"
                searchClass="!bg-gray-800 !text-white"
                inputProps={{
                  name: 'phone',
                  required: false,
                  autoFocus: false,
                }}
              />
              <style jsx global>{`
                .react-phone-input-2 .country-list .country:hover,
                .react-phone-input-2 .country-list .country.highlight,
                .react-phone-input-2 .country-list .country:focus,
                .react-phone-input-2 .country-list .country:active {
                  background: #dc2626 !important;
                  background-color: #dc2626 !important;
                  color: #fff !important;
                }
                .react-phone-input-2 .country-list .country.selected {
                  background: #7f1d1d !important;
                  background-color: #7f1d1d !important;
                  color: #fff !important;
                }
              `}</style>
            </div>
            
            {!verified && !showVerification && (
              <Button 
                type="button" 
                onClick={requestVerificationCode}
                disabled={!phoneNumber || isVerifying || isSubmitting}
                className="bg-gray-800 hover:bg-gray-700 text-white whitespace-nowrap flex items-center h-auto py-2 mt-2 sm:mt-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Sending...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {showVerification && !verified && (
          <div className="space-y-2 group md:col-span-1">
            <Label htmlFor="verificationCode" className="text-sm font-medium text-white/80">Verification Code</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Input 
                  id="verificationCode" 
                  {...form.register("verificationCode")} 
                  placeholder="Enter code" 
                  disabled={isSubmitting || isVerifying}
                  className="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors placeholder:text-gray-600 focus:placeholder:text-gray-500 group-hover:border-gray-500"
                  variant="minimal"
                />
                {/* Animated focus line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 group-focus-within:w-full transition-all duration-300"></div>
              </div>
              
              <Button 
                type="button" 
                onClick={verifyCode}
                disabled={!form.getValues("verificationCode") || isVerifying || isSubmitting}
                className="bg-gray-800 hover:bg-gray-700 text-white whitespace-nowrap flex items-center h-auto py-2 mt-2 sm:mt-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Verifying...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2 group md:col-span-2">
          <Label htmlFor="subject" className="text-sm font-medium text-white/80">Subject</Label>
          <div className="relative">
            <Input 
              id="subject" 
              {...form.register("subject")} 
              placeholder="How can we help you?" 
              disabled={isSubmitting}
              aria-invalid={!!form.formState.errors.subject}
              className="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors placeholder:text-gray-600 focus:placeholder:text-gray-500 group-hover:border-gray-500"
              variant="minimal"
            />
            {/* Animated focus line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 group-focus-within:w-full transition-all duration-300"></div>
          </div>
          {form.formState.errors.subject && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.subject.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2 group">
        <Label htmlFor="message" className="text-sm font-medium text-white/80">Message</Label>
        <div className="relative">
          <textarea 
            id="message" 
            {...form.register("message")} 
            rows={4} 
            placeholder="Please provide details about your inquiry" 
            disabled={isSubmitting}
            aria-invalid={!!form.formState.errors.message}
            className="w-full py-2.5 sm:py-3 px-0 text-sm sm:text-base bg-transparent border-0 border-b-2 rounded-none border-gray-700 focus:border-red-500 focus:ring-0 transition-colors resize-none placeholder:text-gray-600 focus:placeholder:text-gray-500 group-hover:border-gray-500"
          />
          {/* Animated focus line */}
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 group-focus-within:w-full transition-all duration-300"></div>
        </div>
        {form.formState.errors.message && (
          <p className="text-xs text-red-500 mt-1">{form.formState.errors.message.message}</p>
        )}
      </div>
      
      <div className="space-y-2 group">
        <Label className="text-sm font-medium text-white/80 flex items-center">
          <Paperclip className="h-4 w-4 mr-2" /> Attachment (Optional)
        </Label>
        <FileUpload
          endpoint="document"
          value={attachment}
          onChange={setAttachment}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Upload documents or images related to your inquiry (max 8MB)</p>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 text-sm sm:text-base rounded-lg font-medium relative overflow-hidden group mt-6 sm:mt-8 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-500"
      >
        <span className="relative z-10 flex items-center justify-center">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Sending Message...
            </>
          ) : (
            <>
              Send Message
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="ml-2 transform group-hover:translate-x-2 transition-transform opacity-70 group-hover:opacity-100"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </span>
        {/* Enhanced shine effect on hover */}
        <span className="absolute inset-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"></span>
        <span className="absolute inset-0 opacity-0 bg-red-500/10 group-hover:opacity-100 transition-opacity duration-500"></span>
      </Button>
    </form>
  );
} 