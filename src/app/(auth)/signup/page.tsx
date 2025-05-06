"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await signUpWithEmail(data.email, data.password);
      toast.success('Account created! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Toaster position="top-center" richColors />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 border border-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
        />
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-lg font-semibold transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
} 