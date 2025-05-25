"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@torchgroup.co");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setDebugInfo("");

    try {
      // Call the direct admin login API
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important: include cookies in the request
      });

      // Get the response as text first to debug
      const responseText = await response.text();
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        setDebugInfo(`Failed to parse response as JSON: ${responseText.substring(0, 200)}...`);
        setError("Server returned invalid JSON response. Check console for details.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || "Login failed");
        setDebugInfo(JSON.stringify(data, null, 2));
        setLoading(false);
      } else {
        setSuccess("Login successful! Redirecting...");
        
        // Check auth status after login
        try {
          const authCheckResponse = await fetch("/api/auth/check-config", {
            credentials: "include",
          });
          const authCheckData = await authCheckResponse.json();
          setDebugInfo(JSON.stringify(authCheckData, null, 2));
          
          // Delay slightly to show success message and debug info
          setTimeout(() => {
            // Force a full page navigation to dashboard, don't use the router
            window.location.href = "/dashboard";
          }, 1000);
        } catch (authCheckError) {
          // Still redirect even if the check fails
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        }
      }
    } catch (err: any) {
      setError("An error occurred during login");
      setDebugInfo(err?.toString() || "Unknown error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Admin Direct Login</h1>
          <p className="mt-2 text-gray-400">Special login for administrators</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-md p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-md p-4">
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {debugInfo && (
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-md p-4 max-h-32 overflow-auto">
            <p className="text-blue-500 text-xs font-mono whitespace-pre-wrap">{debugInfo}</p>
          </div>
        )}

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
              className="mt-1 bg-zinc-800 border-zinc-700"
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
              className="mt-1 bg-zinc-800 border-zinc-700"
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