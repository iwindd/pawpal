import { getPath } from "@/configs/route";
import APISession from "@/libs/api/server";
import { MiddlewareFunction } from "@pawpal/nextjs-middleware";

const RedirectIfAdminMiddleware: MiddlewareFunction = async (context) => {
  try {
    const API = await APISession();
    const { success: isLoggedIn, data: user } = await API.auth.getProfile();

    if (isLoggedIn && user.roles.includes("Admin"))
      return { type: "redirect", url: getPath("home") };

    return { type: "continue" };
  } catch (error) {
    console.error("[RedirectIfAdminMiddleware] error:", error);
    return { type: "redirect", url: getPath("home") };
  }
};

export default RedirectIfAdminMiddleware;
