"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, Control, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { Check, X, Loader2, Send } from 'lucide-react';
import PhoneInputWithCountry, { type ReactHookFormComponentProps } from 'react-phone-number-input/react-hook-form';
import type { Value } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import parsePhoneNumberFromString from 'react-phone-number-input';

type CountryCode = string;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.string().optional(),
  privacy: z.boolean().refine((value) => value, {
    message: "You must agree to the Privacy Policy",
  }),
});

type FormData = z.infer<typeof formSchema>;

type ContactFormProps = {
  testMode?: boolean;
};

export function ContactForm({ testMode = false }: ContactFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<string | undefined>();
  const [showPhoneVerificationError, setShowPhoneVerificationError] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Phone verification state
  const [phoneVerificationState, setPhoneVerificationState] = useState({
    isVerifying: false,
    sentCode: false,
    verificationCode: "",
    isVerified: false,
    error: "",
    code: "" // In a real app, this would not be stored client-side
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [phoneValue, setPhoneValue] = useState<string | undefined>(getValues('phone'));
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | undefined>('EG'); // Default to Egypt

  useEffect(() => {
    setValue('phone', phoneValue || '', { shouldValidate: true });
    // In test mode, auto-verify phone
    if (testMode && phoneValue && phoneValue !== '' && !phoneVerificationState.isVerified) {
      setPhoneVerificationState(prev => ({
        ...prev,
        isVerified: true,
        sentCode: false,
        error: '',
        code: '123456',
        verificationCode: '123456',
      }));
    }
  }, [phoneValue, setValue, trigger, testMode]);

  // Generate a random 6-digit code (replace with actual API call in production)
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification code
  const sendVerificationCode = async () => {
    if (testMode) {
      setPhoneVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        sentCode: true,
        code: '123456',
        error: '',
      }));
      return;
    }
    const formattedPhone = phoneValue;
    if (!formattedPhone || !isValidPhoneNumber(formattedPhone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number to send a code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPhoneVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      error: "",
    }));

    try {
      const res = await fetch("/api/contact/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }
      // If mockCode is present (dev mode), store it for demo verification
      if (data.mockCode) {
        setPhoneVerificationState(prev => ({
          ...prev,
          sentCode: true,
          code: data.mockCode,
          isVerifying: false,
          error: '',
        }));
        toast({
          title: "Code Sent (Dev Mode)",
          description: `Verification code sent to ${formattedPhone}. (Dev code: ${data.mockCode})`,
        });
      } else {
        setPhoneVerificationState(prev => ({
          ...prev,
          sentCode: true,
          isVerifying: false,
          error: '',
        }));
        toast({
          title: "Code Sent",
          description: `Verification code sent to ${formattedPhone}.`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
      setPhoneVerificationState(prev => ({
        ...prev,
        sentCode: false,
        isVerifying: false,
        error: "Failed to send code."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code
  const verifyCode = async () => {
    if (testMode) {
      setPhoneVerificationState(prev => ({
        ...prev,
        isVerified: true,
        sentCode: false,
        error: '',
      }));
      return;
    }
    if (phoneVerificationState.verificationCode.length !== 6) {
      setPhoneVerificationState(prev => ({
        ...prev,
        error: "Please enter a valid 6-digit code"
      }));
      return;
    }

    setIsLoading(true);
    setPhoneVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      error: ""
    }));

    try {
      const formattedPhone = phoneValue;
      if (!formattedPhone || !isValidPhoneNumber(formattedPhone)) {
        setPhoneVerificationState(prev => ({
          ...prev,
          error: "Please enter a valid phone number."
        }));
        toast({
          title: "Validation Error",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        });
        setIsLoading(false);
        setPhoneVerificationState(prev => ({
          ...prev,
          isVerifying: false,
        }));
        return;
      }
      const res = await fetch("/api/contact/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          code: phoneVerificationState.verificationCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setPhoneVerificationState(prev => ({
          ...prev,
          isVerified: true,
          sentCode: false,
          error: "",
        }));
        setShowPhoneVerificationError(false); // Clear any verification error
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
        });
      } else {
        // Handle specific error cases
        let errorMessage = data.message || "Invalid verification code.";
        let shouldResetToSendCode = false;
        
        if (data.message?.includes("No verification code found") || data.message?.includes("expired")) {
          errorMessage = "Verification code expired or not found. Please request a new code.";
          shouldResetToSendCode = true;
        }
        
        if (shouldResetToSendCode) {
          // Reset to allow sending new code
          setPhoneVerificationState(prev => ({
            ...prev,
            sentCode: false,
            verificationCode: "",
            error: "",
            code: ""
          }));
          toast({
            title: "Code Expired",
            description: "Please request a new verification code.",
            variant: "destructive",
          });
        } else {
          setPhoneVerificationState(prev => ({
            ...prev,
            error: errorMessage
          }));
          toast({
            title: "Verification Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
      setPhoneVerificationState(prev => ({
        ...prev,
        error: "Verification failed."
      }));
    } finally {
      setIsLoading(false);
      setPhoneVerificationState(prev => ({
        ...prev,
        isVerifying: false,
      }));
    }
  };

  // Cancel verification flow
  const cancelVerification = () => {
    setPhoneVerificationState({
      isVerifying: false,
      sentCode: false,
      verificationCode: "",
      isVerified: false,
      error: "",
      code: "" // Clear demo code
    });
    setShowPhoneVerificationError(false); // Clear any verification error
     toast({
        title: "Verification Cancelled",
        description: "Phone verification was cancelled.",
      });
  };

  // Handle verification code input change
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPhoneVerificationState(prev => ({
      ...prev,
      verificationCode: code,
      error: "" // Clear error on input change
    }));
  };

  const onSubmit = async (data: FormData) => {
    // Check if phone is provided and not verified
    if (data.phone && data.phone.trim() !== '' && !phoneVerificationState.isVerified) {
        setShowPhoneVerificationError(true);
        toast({
            title: "Verification Required",
            description: "Please verify your phone number before submitting the form.",
            variant: "destructive",
        });
        return; // Prevent form submission
    }
    
    // Clear phone verification error if we get here
    setShowPhoneVerificationError(false);

    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          attachment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success",
        description: "Your message has been sent. We'll get back to you soon.",
      });

      // Set success state and show green button for 3 seconds
      setIsSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitSuccess(false);
        reset();
        setAttachment(undefined);
        setPhoneVerificationState({
          isVerifying: false,
          sentCode: false,
          verificationCode: "",
          isVerified: false,
          error: "",
          code: ""
        });
        setPhoneValue(undefined);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form data-testid="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1 text-gray-200">Name</label>
          <input
            id="contact-name"
            type="text"
            {...register("name")}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Your Name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-1 text-gray-200">Email</label>
          <input
            id="contact-email"
            type="email"
            {...register("email")}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your.email@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium mb-1 text-gray-200">Phone Number</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1">
              <PhoneInputWithCountry
                name="phone"
                control={control}
                placeholder="Enter phone number"
                defaultCountry="EG"
                value={phoneValue}
                onChange={(value: Value) => {
                  setPhoneValue(value);
                  setValue('phone', value || '', { shouldValidate: true });
                  trigger('phone');
                  setShowPhoneVerificationError(false); // Clear error when phone changes
                }}
                onCountryChange={(country?: CountryCode) => {
                  if (country) setSelectedCountry(country);
                }}
                className={`w-full border rounded-md bg-black text-white border-gray-800 focus-within:ring-red-500 focus-within:border-red-500 phone-input-custom text-sm sm:text-base transition-all duration-200 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            
            {!phoneVerificationState.sentCode && errors.phone?.type !== 'manual' && (
               <Button
                 type="button"
                 onClick={sendVerificationCode}
                 disabled={isLoading || !(typeof phoneValue === 'string' && isValidPhoneNumber(phoneValue as string)) || errors.phone?.message !== undefined}
                 className="bg-red-600 hover:bg-red-700 min-h-[44px] px-3 sm:px-4 text-sm sm:text-base whitespace-nowrap">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            )}
            {phoneVerificationState.sentCode && !phoneVerificationState.isVerified && (
               <Button type="button" onClick={cancelVerification} disabled={isLoading} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white min-h-[44px] px-3 sm:px-4">
                 <X className="h-4 w-4" />
               </Button>
             )}
          </div>
          
          {/* Show verification error only when user tries to submit without verification */}
          {showPhoneVerificationError && phoneValue && phoneValue.trim() !== '' && !phoneVerificationState.isVerified && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">Please verify your phone number before submitting the form.</p>
          )}

          {phoneVerificationState.sentCode && !phoneVerificationState.isVerified && (
            <div className="mt-3 sm:mt-4">
              <label htmlFor="contact-phone-code" className="block text-sm font-medium mb-1 text-gray-200">Verification Code</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  id="contact-phone-code"
                  type="text"
                  value={phoneVerificationState.verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="Enter 6-digit code"
                  className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 ${phoneVerificationState.error ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  maxLength={6}
                />
                <Button type="button" onClick={verifyCode} disabled={isLoading || phoneVerificationState.verificationCode.length !== 6} className="bg-red-600 hover:bg-red-700 min-h-[44px] px-3 sm:px-4 text-sm sm:text-base whitespace-nowrap">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
               {phoneVerificationState.error && <p className="mt-1 text-xs sm:text-sm text-red-500">{phoneVerificationState.error}</p>}
            </div>
          )}
        </div>

        {typeof getValues('phone') === 'string' && getValues('phone') !== '' && phoneVerificationState.isVerified && (
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Phone number verified!
          </div>
        )}

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium mb-1 text-gray-200">Subject</label>
          <input
            id="contact-subject"
            type="text"
            {...register("subject")}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Subject of your message"
            autoComplete="on"
          />
          {errors.subject && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.subject.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium mb-1 text-gray-200">Message</label>
          <textarea
            id="contact-message"
            {...register("message")}
            rows={4}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 resize-y min-h-[100px] sm:min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
            placeholder="Your Message"
            autoComplete="off"
          />
          {errors.message && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.message.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-attachment" className="block text-sm font-medium mb-1 text-gray-200">Attachment (Optional)</label>
           <FileUpload
            endpoint="contactAttachment"
            onUploadComplete={(res: { url: string }[]) => {
              // Do something with the response
              console.log("Files: ", res);
              if(res && res.length > 0 && res[0].url) {
                setAttachment(res[0].url);
                toast({
                  title: "Upload Complete",
                  description: "File uploaded successfully.",
                });
              }
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive",
              });
            }}
             onUploadBegin={() => {
               toast({
                 title: "Uploading",
                 description: "Your file is being uploaded.",
               });
             }}
             className="mt-2"
             fileUrl={attachment}
             id="contact-attachment"
           />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy-policy"
            {...register("privacy")}
            className={`h-5 w-5 mt-0.5 rounded border-gray-600 text-red-600 focus:ring-red-500 focus:ring-offset-0 ${errors.privacy ? 'border-red-500' : ''}`}
          />
          <label htmlFor="privacy-policy" className="block text-sm sm:text-base text-gray-300 leading-relaxed">
            I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline transition-colors duration-200">Privacy Policy</a>
          </label>
        </div>
        {errors.privacy && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.privacy.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading || isSubmitSuccess || (typeof getValues('phone') === 'string' && getValues('phone') !== '' && !phoneVerificationState.isVerified)}
        className={`w-full py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px] sm:min-h-[52px] transition-all duration-500 shadow-lg hover:shadow-xl ${
          isSubmitSuccess 
            ? 'bg-green-600 hover:bg-green-600 text-white border-green-500' 
            : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
        ) : isSubmitSuccess ? (
          <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        )}
        {isSubmitSuccess ? 'Message Sent!' : 'Send Message'}
      </Button>
    </form>
  );
}