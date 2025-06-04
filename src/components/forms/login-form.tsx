"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export function LoginForm({ adminMode = false }: { adminMode?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const adminCodeValue = adminMode ? adminCode : undefined;

    if (adminMode && !adminCodeValue) {
      toast({
        title: "Admin Code Required",
        description: "Please enter the admin code.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        adminCode: adminCodeValue,
        redirect: false,
      });

      if (result?.error) {
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@torchgroup.co"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={isLoading}
        />
      </div>
      {adminMode && (
        <div className="space-y-2">
          <Label htmlFor="adminCode">Admin Code</Label>
          <Input
            id="adminCode"
            name="adminCode"
            type="text"
            value={adminCode}
            onChange={e => setAdminCode(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter admin code"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
} 