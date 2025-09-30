import { ROUTES } from "@/configs/route";
import APISession from "@/libs/api/server";
import { MiddlewareFunction } from "@pawpal/nextjs-middleware";

const AuthMiddleware: MiddlewareFunction = async (context) => {
  try {
    const API = await APISession();
    const { success: isLoggedIn } = await API.auth.getProfile();

    if (!isLoggedIn) throw new Error("Session not found");
    return { type: "continue" };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return { type: "redirect", url: ROUTES["home"]?.path as string };
  }
};

export default AuthMiddleware;
