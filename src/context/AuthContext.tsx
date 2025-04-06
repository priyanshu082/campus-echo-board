
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

// Define API URL
const API_URL = "http://localhost:9999/api";

// Define user roles to match Prisma schema
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: { name: string, email: string, password: string, role: UserRole }) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with auth header
export const authAPI = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
authAPI.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch users if authenticated as admin
  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async (): Promise<void> => {
    if (!user || user.role !== "ADMIN") return;
    
    try {
      const response = await authAPI.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user list",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid email or password";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const addUser = async (newUser: { name: string, email: string, password: string, role: UserRole }): Promise<boolean> => {
    try {
      await authAPI.post('/users', newUser);
      
      toast({
        title: "User added",
        description: `${newUser.name} has been added as a ${newUser.role.toLowerCase()}.`,
      });
      
      // Refresh the user list
      fetchUsers();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add user";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      await authAPI.put(`/users/${userId}/role`, { role });
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${role.toLowerCase()}.`,
      });
      
      // Refresh the user list
      fetchUsers();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update user role";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      await authAPI.delete(`/users/${userId}`);
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
      
      // Refresh the user list
      fetchUsers();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete user";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        login,
        logout,
        addUser,
        updateUserRole,
        fetchUsers,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
