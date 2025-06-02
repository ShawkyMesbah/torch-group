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
import { isValidPhoneNumber } from 'react-phone-number-input';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").refine(
    (value) => {
      if (typeof value !== 'string') return false;
      return isValidPhoneNumber(value);
    },
    {
      message: "Invalid phone number",
    }
  ),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.string().optional(),
  privacy: z.boolean().refine((value) => value, {
    message: "You must agree to the Privacy Policy",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<string | undefined>();

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

  useEffect(() => {
    setValue('phone', phoneValue || '', { shouldValidate: true });
  }, [phoneValue, setValue, trigger]);

  // Generate a random 6-digit code (replace with actual API call in production)
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification code
  const sendVerificationCode = async () => {
    const currentPhoneValue = getValues('phone');
    // Basic validation - check if currentPhoneValue is a string and then pass to isValidPhoneNumber
    if (typeof currentPhoneValue !== 'string' || !isValidPhoneNumber(currentPhoneValue)) {
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
      sentCode: true,
      code: generateVerificationCode(), // Demo code generation
    }));

    try {
      // Simulate API call to send code
      await new Promise<void>(resolve => setTimeout(resolve, 1000)); 

      toast({
        title: "Code Sent",
        description: `Verification code sent to ${currentPhoneValue}. (Demo code: ${phoneVerificationState.code})`,
      });

    } catch (err) {
       toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
       setPhoneVerificationState(prev => ({
        ...prev,
        sentCode: false,
        error: "Failed to send code."
      }));

    } finally {
      setIsLoading(false);
       setPhoneVerificationState(prev => ({
        ...prev,
        isVerifying: false,
      }));
    }
  };

  // Verify code
  const verifyCode = async () => {
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
       // Simulate API call to verify code
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // For demo, compare entered code to generated code. Replace with backend verification.
      if (phoneVerificationState.verificationCode === phoneVerificationState.code) {
           setPhoneVerificationState(prev => ({
              ...prev,
              isVerified: true,
              sentCode: false,
              error: "",
           }));
            toast({
              title: "Phone Verified",
              description: "Your phone number has been successfully verified.",
            });
      } else {
           setPhoneVerificationState(prev => ({
              ...prev,
              error: "Invalid verification code."
           }));
            toast({
              title: "Verification Failed",
              description: "The verification code entered is incorrect.",
              variant: "destructive",
            });
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
    if (data.phone && !phoneVerificationState.isVerified) {
        toast({
            title: "Verification Required",
            description: "Please verify your phone number before submitting the form.",
            variant: "destructive",
        });
        return; // Prevent form submission
    }

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="contact-name"
            type="text"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Your Name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="contact-email"
            type="email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your.email@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
           <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="flex items-center space-x-2">
            
              <PhoneInputWithCountry
                name="phone"
                control={control}
                placeholder="Enter phone number"
                defaultCountry="US"
                className={`w-full border rounded-md bg-black text-white border-gray-800 focus-within:ring-red-500 focus-within:border-red-500 phone-input-custom ${errors.phone ? 'border-red-500' : ''}`}
              />
            
            {!phoneVerificationState.sentCode && errors.phone?.type !== 'manual' && (
               <Button
                 type="button"
                 onClick={sendVerificationCode}
                 disabled={isLoading || !(typeof phoneValue === 'string' && isValidPhoneNumber(phoneValue as string)) || errors.phone?.message !== undefined}
                 className="bg-red-600 hover:bg-red-700">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            )}
            {phoneVerificationState.sentCode && !phoneVerificationState.isVerified && (
               <Button type="button" onClick={cancelVerification} disabled={isLoading} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                 <X className="h-4 w-4" />
               </Button>
             )}
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}

          {phoneVerificationState.sentCode && !phoneVerificationState.isVerified && (
            <div className="mt-4">
              <label htmlFor="contact-phone-code" className="block text-sm font-medium mb-1">Verification Code</label>
              <div className="flex items-center space-x-2">
                <input
                  id="contact-phone-code"
                  type="text"
                  value={phoneVerificationState.verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="Enter code"
                  className={`w-full px-4 py-2 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 ${phoneVerificationState.error ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                <Button type="button" onClick={verifyCode} disabled={isLoading || phoneVerificationState.verificationCode.length !== 6} className="bg-red-600 hover:bg-red-700">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
               {phoneVerificationState.error && <p className="mt-1 text-sm text-red-500">{phoneVerificationState.error}</p>}
            </div>
          )}
        </div>

        {typeof getValues('phone') === 'string' && getValues('phone') !== '' && phoneVerificationState.isVerified && (
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Phone number verified!
          </div>
        )}

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium mb-1">Subject</label>
          <input
            id="contact-subject"
            type="text"
            {...register("subject")}
            className={`w-full px-4 py-2 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Subject of your message"
            autoComplete="on"
          />
          {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="contact-message"
            {...register("message")}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md bg-black text-white border-gray-800 focus:ring-red-500 focus:border-red-500 ${errors.message ? 'border-red-500' : ''}`}
            placeholder="Your Message"
            autoComplete="off"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-attachment" className="block text-sm font-medium mb-1">Attachment (Optional)</label>
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

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy-policy"
            {...register("privacy")}
            className={`h-4 w-4 rounded border-gray-600 text-red-600 focus:ring-red-500 ${errors.privacy ? 'border-red-500' : ''}`}
          />
          <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-300">
            I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.privacy && <p className="mt-1 text-sm text-red-500">{errors.privacy.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading || (typeof getValues('phone') === 'string' && getValues('phone') !== '' && !phoneVerificationState.isVerified)}
        className="w-full bg-red-600 hover:bg-red-700 py-2 text-lg font-semibold"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Send className="mr-2 h-5 w-5" />
        )}
        Send Message
      </Button>
    </form>
  );
}