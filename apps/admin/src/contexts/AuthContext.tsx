"use client";
import {
  useLazyGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/services/auth";
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
  const [getProfile] = useLazyGetProfileQuery();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const refreshProfile = async (): Promise<Session | null> => {
    const resp = await getProfile();

    if (!resp.error && resp.data) {
      setUser(resp.data);
      return resp.data;
    }

    return null;
  };

  const login = async (props: LoginProps): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const resp = await loginMutation(props.inputs);

      if (!resp.error) {
        setUser(resp.data);
        return "success";
      }

      const status = (resp.error as unknown as { status: number }).status;
      if (status === 401) return "invalid_credentials";
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
      const resp = await logoutMutation();
      if (resp.error) return false;

      setUser(null);
      return true;
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
