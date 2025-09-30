"use client";
import API from "@/libs/api/client";
import { Session, type LoginInput } from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

// Types
type LoginResult = "success" | "invalid_credentials" | "error";

interface LoginProps {
  inputs: LoginInput;
}

interface AuthContextType {
  user: Session | null;
  login: (props: LoginProps) => Promise<LoginResult>;
  logout: () => Promise<boolean>;
  refreshProfile: () => Promise<Session | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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

export const AuthProvider = ({
  children,
  session,
}: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<Session | null>(session);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = async (): Promise<Session | null> => {
    try {
      const resp = await API.auth.getProfile();
      if (resp.success) {
        setUser(resp.data);
        return resp.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      return null;
    }
  };

  const login = async (props: LoginProps): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const resp = await API.auth.login(props.inputs);

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

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { success } = await API.auth.logout();
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
    () => ({
      user,
      login,
      logout,
      refreshProfile,
      isLoading,
    }),
    [user, login, logout, refreshProfile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
