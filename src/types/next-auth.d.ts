import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "STAFF";
    }
  }
  
  interface User {
    id: string;
    role?: "ADMIN" | "STAFF";
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: "ADMIN" | "STAFF";
  }
} 