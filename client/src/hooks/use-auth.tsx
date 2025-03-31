import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Define User type
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "client" | "advocate";
  phone?: string;
}

// Authentication context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdvocate: () => boolean;
  isClient: () => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch current user
  const { isLoading, data } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          // User not authenticated - this is not an error
          if (response.status === 401) {
            return { user: null };
          }
          throw new Error('Failed to fetch user');
        }
        return response.json();
      } catch (error) {
        // Log error but don't throw - allows app to continue
        console.error('Error fetching user:', error);
        return { user: null };
      }
    },
  });
  
  // Update user state when data changes
  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  }, [data]);
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
  });
  
  // Login function
  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };
  
  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  // Check if user is an advocate
  const isAdvocate = () => {
    return user?.role === 'advocate';
  };
  
  // Check if user is a client
  const isClient = () => {
    return user?.role === 'client';
  };
  
  // Value to provide in context
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    isAdvocate,
    isClient,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};