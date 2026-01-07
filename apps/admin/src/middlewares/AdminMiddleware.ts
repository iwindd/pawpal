import { getPath } from "@/configs/route";
import APISession from "@/libs/api/server";
import { MiddlewareFunction } from "@pawpal/nextjs-middleware";

const AdminMiddleware: MiddlewareFunction = async (context) => {
  try {
    const API = await APISession();
    const { success: isLoggedIn, data: user } = await API.auth.getProfile();

    if (!isLoggedIn) return { type: "redirect", url: getPath("login") };

    if (!user.roles.includes("Admin"))
      return { type: "redirect", url: getPath("login") };

    return { type: "continue" };
  } catch (error) {
    console.error("[AdminMiddleware] error:", error);
    return { type: "redirect", url: getPath("login") };
  }
};

export default AdminMiddleware;
