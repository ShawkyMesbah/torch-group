"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";

export type UserRole = "USER" | "STAFF" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified?: string | null;
};

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string | null;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export function useUsers() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data: users, error, isLoading: loading } = useSWR<User[]>("/api/users", fetcher);

  const fetchUserById = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data: User = await response.json();
      setCurrentUser(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch user by ID:", err);
      toast({
        title: "Error",
        description: "Failed to load user",
        variant: "destructive",
      });
      return null;
    }
  };

  const createUser = async (data: UserFormData) => {
    const optimisticUser = {
      id: `temp-${Date.now()}` as string,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: null,
      image: data.image || null,
    } as User;

    const options = {
      optimisticData: users ? [...users, optimisticUser] : [optimisticUser],
      revalidate: false,
    };

    try {
      const result = await mutate("/api/users", async (currentUsers: User[] | undefined) => {
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
        const newUser: User = await response.json();
        return currentUsers ? [...currentUsers.filter(user => user.id !== optimisticUser.id), newUser] : [newUser];
      }, options);

      if (result) {
        toast({
          title: "Success",
          description: `User "${result.find(user => user.id !== optimisticUser.id)?.name || 'New User'} created successfully`,
        });
      }

      const newUser = result?.find(user => user.id !== optimisticUser.id);
      return newUser || null;
    } catch (err) {
      console.error("Failed to create user:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create user",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateUser = async (id: string, data: Partial<UserFormData>) => {
    const originalUsers = users;
    const updatedUsers = originalUsers?.map(user =>
      user.id === id ? { ...user, ...data, updatedAt: new Date().toISOString() } : user
    );

    const options = {
      optimisticData: updatedUsers,
      revalidate: false,
    };

    try {
      const result = await mutate("/api/users", async (currentUsers: User[] | undefined) => {
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
        const updatedUser: User = await response.json();
        return currentUsers?.map(user =>
          user.id === id ? updatedUser : user
        ) || [updatedUser];
      }, options);

      if (currentUser?.id === id && result) {
        const latestUser = result.find(user => user.id === id);
        if (latestUser) setCurrentUser(latestUser);
      }

      if (result) {
        const updatedUserFromList = result.find(user => user.id === id);
        if (updatedUserFromList) {
          toast({
            title: "Success",
            description: `User "${updatedUserFromList.name}" updated successfully`,
          });
        }
      }

      const updatedUser = result?.find(user => user.id === id);
      return updatedUser || null;
    } catch (err) {
      console.error("Failed to update user:", err);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteUser = async (id: string) => {
    const originalUsers = users;
    const filteredUsers = originalUsers?.filter(user => user.id !== id);

    const options = {
      optimisticData: filteredUsers,
      revalidate: false,
    };

    try {
      await mutate("/api/users", async (currentUsers: User[] | undefined) => {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        return currentUsers?.filter(user => user.id !== id) || [];
      }, options);

      if (currentUser?.id === id) {
        setCurrentUser(null);
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      return true;
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const changeUserRole = async (id: string, role: UserRole) => {
    return await updateUser(id, { role });
  };

  return {
    users: users || [],
    currentUser,
    loading,
    error,
    fetchUsers: () => mutate("/api/users"),
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
  };
} 