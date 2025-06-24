"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

function LoginPageInner() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
    <div className="relative flex h-screen w-screen items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 animate-fade-in-slow">
      <div className="absolute inset-0 z-0 pointer-events-none" />
      <div className="z-10 mx-auto flex w-full flex-col justify-center sm:w-[370px] px-4 sm:px-0">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/images/logo.png" alt="Torch Logo" width={64} height={64} className="mb-2 animate-fade-in object-contain mx-auto" style={{aspectRatio: '1/1'}} />
        </div>
        <div className="rounded-2xl bg-black/70 shadow-xl shadow-black/40 px-4 sm:px-8 py-8 sm:py-10 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm sm:text-base text-zinc-400">Enter your credentials to sign in to your account</p>
          </div>
          <LoginForm />
          <div className="mt-6 flex flex-row justify-center text-center text-sm sm:text-base text-zinc-400">
            <Link href="/forgot-password" className="hover:text-red-400 underline underline-offset-4 min-h-10 px-4 py-2">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container flex h-screen w-screen items-center justify-center">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
} 