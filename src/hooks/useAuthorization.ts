import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Role } from "@/lib/authorization";

export function useAuthorization(requiredRole: Role) {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Add a local state to track authorization state
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Only check after we know the authentication state
    if (status === "loading") return;
    
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    // Get user role, default to lowest permission if undefined
    const userRole = session?.user?.role as Role | undefined;
    
    // If user doesn't have a role or the role doesn't match requirements
    if (!userRole) {
      router.push("/unauthorized");
      return;
    }
    
    // Simple role check
    if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
      router.push("/unauthorized");
      return;
    }

    // Set authorization state based on role check
    setIsAuthorized(
      (requiredRole === "STAFF") || 
      (requiredRole === "ADMIN" && userRole === "ADMIN")
    );
  }, [status, session, router, requiredRole]);
  
  return {
    isAuthorized,
    isLoading: status === "loading",
    session
  };
} 