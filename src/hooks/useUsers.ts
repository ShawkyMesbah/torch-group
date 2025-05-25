"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export type UserRole = "USER" | "STAFF" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified?: string;
};

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setCurrentUser(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load user",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: UserFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const newUser = await response.json();
      setUsers([newUser, ...users]);
      
      toast({
        title: "Success",
        description: `User "${newUser.name}" created successfully`,
      });
      
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create user",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<UserFormData>) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      
      // Update currentUser if it's the one being edited
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser);
      }
      
      toast({
        title: "Success",
        description: `User "${updatedUser.name}" updated successfully`,
      });
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter(user => user.id !== id));
      
      // Clear currentUser if it's the one being deleted
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const changeUserRole = async (id: string, role: UserRole) => {
    return await updateUser(id, { role });
  };

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
  };
} 