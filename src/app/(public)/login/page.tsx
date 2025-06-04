"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Detect admin mode from query param
  const adminMode = searchParams?.get("admin") === "1";

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        
        if (session?.user) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <div className="container flex h-screen w-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {adminMode ? "Admin Login" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {adminMode
              ? "Enter your admin credentials to sign in."
              : "Enter your credentials to sign in to your account"}
          </p>
        </div>
        <LoginForm adminMode={adminMode} />
        <div className="flex flex-row justify-between px-8 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-brand underline underline-offset-4">
            Forgot password?
          </Link>
          <Link href={adminMode ? "/login" : "/login?admin=1"} className="hover:text-brand underline underline-offset-4">
            {adminMode ? "Regular Login" : "Admin Login"}
          </Link>
        </div>
      </div>
    </div>
  );
} 