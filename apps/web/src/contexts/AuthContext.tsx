"use client";
import API from "@/libs/api/client";
import { RegisterInput, Session, type LoginInput } from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

// Types
type LoginResult = "success" | "invalid_credentials" | "error";
type RegisterResult = "success" | "email_already_exists" | "error";

interface LoginProps {
  inputs: LoginInput;
}

interface RegisterProps {
  inputs: RegisterInput;
}

interface AuthContextType {
  user: Session | null;
  login: (props: LoginProps) => Promise<LoginResult>;
  register: (props: RegisterProps) => Promise<RegisterResult>;
  logout: () => Promise<boolean>;
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

  const register = async (props: RegisterProps): Promise<RegisterResult> => {
    setIsLoading(true);

    try {
      const resp = await API.auth.register(props.inputs);
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
    () => ({ user, login, register, logout, isLoading }),
    [user, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
