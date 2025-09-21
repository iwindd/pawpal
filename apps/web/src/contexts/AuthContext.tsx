"use client";
import { API } from "@/libs/api";
import { RegisterInput, Session, type LoginInput } from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AuthContextType {
  user: Session | null;
  login: (props: {
    inputs: LoginInput;
  }) => Promise<"success" | "invalid_credentials" | "error">;
  register: (props: {
    inputs: RegisterInput;
  }) => Promise<"success" | "email_already_exists" | "error">;
  logout: () => Promise<boolean>;
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
  session: Session | null;
}

export const AuthProvider = ({ children, session }: AuthProviderProps) => {
  const [user, setUser] = useState<Session | null>(session);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (props: { inputs: LoginInput }) => {
    setIsLoading(true);

    try {
      const resp = await API.login(props.inputs);

      if (resp.success) {
        setUser(resp.data);
        return "success";
      }

      if (resp.data.response?.status === 401) return "invalid_credentials";
      return "error";
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
      const resp = await API.register(inputs);
      if (resp.success) {
        setUser(resp.data);
        return "success";
      }

      if (resp.data.response?.status === 409) return "email_already_exists";
      return "error";
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { success } = await API.logout();
      if (success) setUser(null);

      return success;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, login, register, logout, isLoading }),
    [user, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
