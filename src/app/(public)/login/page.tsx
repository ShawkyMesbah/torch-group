import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login | Torch Group",
  description: "Login to your Torch Group account",
};

export default async function LoginPage() {
  const session = await auth();
  
  // Redirect to dashboard if already authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/forgot-password" 
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
} 