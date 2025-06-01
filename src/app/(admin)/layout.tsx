import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './admin-layout-client';
import { auth } from '@/auth'; // Assuming auth helper is at @/auth

// Server Component to handle authentication
export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    // Get the session using the auth helper
    const session = await auth();
    
    // If no session found, redirect to unauthorized
    if (!session?.user) {
      console.log("No auth cookie found, redirecting to unauthorized");
      return redirect("/unauthorized");
    }
    
    // If session exists, pass user info to the client component
    const userInfo = {
      name: session.user.name,
      email: session.user.email,
      role: (session.user as any).role, // Assuming role is added to session.user
      isAdmin: (session.user as any).role === 'ADMIN', // Assuming ADMIN role indicates admin
    };
    
    return <AdminLayoutClient userInfo={userInfo}>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error("Error in AdminLayout:", error);
    return redirect("/unauthorized");
  }
} 