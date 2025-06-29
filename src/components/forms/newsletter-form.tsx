"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

export function NewsletterForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast({
        title: "Success",
        description: "Thank you for subscribing to our newsletter!",
      });

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="flex-1">
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
                        className="bg-transparent border-gray-600 text-white focus:border-red-400 focus:ring-red-400/20 focus:shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:border-gray-500 transition-all duration-300"
        />
        {errors.email && (
                          <p className="text-sm torch-text-error mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" variant="default" disabled={isLoading} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white hover:shadow-[0_0_20px_rgba(255,87,34,0.4)] transition-all duration-300 border-none">
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
} 