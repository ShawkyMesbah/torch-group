import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Unauthorized</h1>
      <p className="mb-6 text-gray-300">You must be signed in to access this page.</p>
      <Link href="/login" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold">Go to Login</Link>
    </div>
  );
} 