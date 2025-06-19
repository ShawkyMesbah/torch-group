"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm({ adminMode = false }: { adminMode?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          required
          disabled={isLoading}
          leftIcon={<Mail className="w-5 h-5" aria-hidden="true" />}
          variant="modern"
          className={error ? 'border-red-500 focus-visible:ring-red-500 pl-12' : 'pl-12'}
          containerClassName="!mb-0"
        />
        {error && (
                          <p className="text-xs torch-text-error mt-1">{error}</p>
        )}
      </div>
      <div className="space-y-2 relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          required
          disabled={isLoading}
          leftIcon={<Lock className="w-5 h-5" aria-hidden="true" />}
          rightIcon={
            <button
              type="button"
              tabIndex={-1}
              className="focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
            </button>
          }
          variant="modern"
          className={error ? 'border-red-500 focus-visible:ring-red-500 pl-12' : 'pl-12'}
          containerClassName="!mb-0"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 shadow-lg text-white font-semibold text-base py-2 transition-all duration-200 flex items-center justify-center"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" aria-hidden="true" /> : null}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
} 