"use client";
import loginAction from "@/server/actions/auths/login";
import { RegisterInput, Session, type LoginInput } from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AuthContextType {
  user: Session | null;
  login: (props: {
    inputs: LoginInput;
  }) => Promise<"success" | "invalid_credentials" | "error">;
  register: (props: { inputs: RegisterInput }) => Promise<void>;
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
  const [user, setUser] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (props: { inputs: LoginInput }) => {
    setIsLoading(true);

    try {
      const response = await loginAction<Session>(props.inputs);
      if (response.status === 401) return "invalid_credentials";
      if (response.status !== 201) return "error";

      console.log(response.data);
      setUser(response.data);
      return "success";
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ inputs }: { inputs: RegisterInput }) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual registration API call
      // For now, simulate a registration with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(null);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, isLoading }),
    [user, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
