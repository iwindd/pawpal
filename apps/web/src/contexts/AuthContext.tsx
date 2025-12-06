"use client";
import {
  useChangePasswordMutation,
  useLazyGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/features/auth/authApi";
import { setUser } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks";
import API from "@/libs/api/client";
import {
  ChangeEmailInput,
  ChangePasswordInput,
  RegisterInput,
  Session,
  UpdateProfileInput,
  type LoginInput,
} from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

// Types
type LoginResult = "success" | "invalid_credentials" | "error";
type RegisterResult = "success" | "email_already_exists" | "error";
type ChangePasswordResult = "success" | "invalid_old_password" | "error";
type ChangeEmailResult =
  | "success"
  | "invalid_password"
  | "email_already_exists"
  | "error";
type UpdateProfileResult = "success" | "error";

interface LoginProps {
  inputs: LoginInput;
}

interface RegisterProps {
  inputs: RegisterInput;
}

interface ChangePasswordProps {
  inputs: ChangePasswordInput;
}

interface ChangeEmailProps {
  inputs: ChangeEmailInput;
}

interface UpdateProfileProps {
  inputs: UpdateProfileInput;
}

interface AuthContextType {
  user: Session | null;
  login: (props: LoginProps) => Promise<LoginResult>;
  register: (props: RegisterProps) => Promise<RegisterResult>;
  changePassword: (props: ChangePasswordProps) => Promise<ChangePasswordResult>;
  changeEmail: (props: ChangeEmailProps) => Promise<ChangeEmailResult>;
  updateProfile: (props: UpdateProfileProps) => Promise<UpdateProfileResult>;
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
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [getProfile] = useLazyGetProfileQuery();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [registerMutation] = useRegisterMutation();
  const [changePasswordMutation] = useChangePasswordMutation();
  const dispatch = useDispatch();

  const refreshProfile = async (): Promise<Session | null> => {
    const resp = await getProfile();

    if (!resp.error && resp.data) {
      dispatch(setUser(session));
      return resp.data;
    }

    return null;
  };

  const login = async (props: LoginProps): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const resp = await loginMutation(props.inputs);

      if (!resp.error) {
        dispatch(setUser(session));
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

  const register = async (props: RegisterProps): Promise<RegisterResult> => {
    setIsLoading(true);

    try {
      const resp = await registerMutation(props.inputs);
      if (!resp.error) {
        dispatch(setUser(session));
        return "success";
      }

      const status = (resp.error as unknown as { status: number }).status;
      if (status === 409) return "email_already_exists";
      return "error";
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    props: ChangePasswordProps
  ): Promise<ChangePasswordResult> => {
    setIsLoading(true);

    try {
      const resp = await changePasswordMutation(props.inputs);

      if (!resp.error) {
        return "success";
      }

      const error = resp.error as unknown as {
        status: number;
        data: { message?: string };
      };
      if (error.status === 400) {
        const errorData = error.data as { message?: string };
        if (errorData?.message === "invalid_old_password")
          return errorData.message;
      }
      return "error";
    } catch (error) {
      console.error("Change password failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = async (
    props: ChangeEmailProps
  ): Promise<ChangeEmailResult> => {
    setIsLoading(true);

    try {
      const resp = await API.auth.changeEmail(props.inputs);

      if (resp.success) {
        await refreshProfile();
        return "success";
      }

      if (resp.data.response?.status === 400) {
        const errorData = resp.data.response?.data as { message?: string };
        if (errorData?.message === "invalid_password") {
          return "invalid_password";
        }
      }

      if (resp.data.response?.status === 409) {
        return "email_already_exists";
      }

      return "error";
    } catch (error) {
      console.error("Change email failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    props: UpdateProfileProps
  ): Promise<UpdateProfileResult> => {
    setIsLoading(true);

    try {
      const resp = await API.auth.updateProfile(props.inputs);

      if (resp.success) {
        dispatch(setUser(session));
        return "success";
      }

      return "error";
    } catch (error) {
      console.error("Update profile failed:", error);
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

      dispatch(setUser(null));
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
      register,
      changePassword,
      changeEmail,
      updateProfile,
      logout,
      refreshProfile,
      isLoading,
    }),
    [
      user,
      login,
      register,
      changePassword,
      changeEmail,
      updateProfile,
      logout,
      refreshProfile,
      isLoading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
