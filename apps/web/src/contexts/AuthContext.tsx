"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface User {
  name: string;
  email: string;
  image: string;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual login API call
      // For now, simulate a login with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser({
        name: "Achirawit Kaewkhong",
        email: email,
        image:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
        coins: 9999.999,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
