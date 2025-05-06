import React from 'react';

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="border p-2 w-full" />
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
} 