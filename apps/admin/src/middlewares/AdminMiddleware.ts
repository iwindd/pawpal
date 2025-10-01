import { ROUTES } from "@/configs/route";
import APISession from "@/libs/api/server";
import { MiddlewareFunction } from "@pawpal/nextjs-middleware";

const AdminMiddleware: MiddlewareFunction = async (context) => {
  try {
    const API = await APISession();
    const { success: isLoggedIn, data: user } = await API.auth.getProfile();

    if (!isLoggedIn)
      return { type: "redirect", url: ROUTES["login"]?.path as string };

    if (!user.roles.includes("Admin"))
      return { type: "redirect", url: ROUTES["login"]?.path as string };

    return { type: "continue" };
  } catch (error) {
    console.error("[AdminMiddleware] error:", error);
    return { type: "redirect", url: ROUTES["login"]?.path as string };
  }
};

export default AdminMiddleware;
