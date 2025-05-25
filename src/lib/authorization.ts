import { Session } from "next-auth";
import { redirect } from "next/navigation";

// Define role hierarchy
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF"
} as const;

export type Role = keyof typeof ROLES;

// Check if a user has a specific role
export function hasRole(session: Session | null, role: Role): boolean {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  // Check if the user's role matches the required role
  return session.user.role === role;
}

// Check if a user has at least a specific role level
export function hasRoleOrHigher(session: Session | null, minimumRole: Role): boolean {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  const userRole = session.user.role as Role;
  
  // Simple hierarchy check
  if (minimumRole === "STAFF") {
    // Everyone with any role can access STAFF level
    return true;
  } else if (minimumRole === "ADMIN") {
    // Only admins can access ADMIN level
    return userRole === "ADMIN";
  }
  
  return false;
}

// Server component function to check authorization and redirect if needed
export async function checkAuthorization(
  session: Session | null, 
  minimumRole: Role, 
  redirectTo: string = "/unauthorized"
): Promise<void> {
  if (!session || !hasRoleOrHigher(session, minimumRole)) {
    redirect(redirectTo);
  }
}

// Function for API routes to check authorization
export function isAuthorized(
  session: Session | null,
  minimumRole: Role
): boolean {
  return hasRoleOrHigher(session, minimumRole);
} 