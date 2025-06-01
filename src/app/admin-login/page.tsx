// src/app/admin-login/page.tsx
// This page provides a custom login form for administrators.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@torchgroup.co");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false, // Prevent default redirect
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      // Handle login error
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    } else if (result?.ok) {
      // Handle successful login
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      // Force a full page reload to dashboard after successful login
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Admin Direct Login</h1>
          <p className="mt-2 text-gray-400">Special login for administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              placeholder="admin@torchgroup.co"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            <Link
              href="/login"
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              Return to regular login
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>This is a direct admin login. Use with caution.</p>
      </div>
    </div>
  );
} 