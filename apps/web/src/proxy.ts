import {
  middlewareRegistry,
  RouteDefinition,
  withMiddleware,
} from "@pawpal/nextjs-middleware";
import { NextRequest, NextResponse } from "next/server";
import AuthMiddleware from "./middlewares/AuthMiddleware";

// Define routes for this application
const routes: RouteDefinition[] = [
  { path: "/user", middleware: ["auth"] },
  { path: "/user/*", middleware: ["auth"] },
];

// Register middleware
middlewareRegistry.register({
  name: "auth",
  handler: AuthMiddleware,
  priority: 1,
});

export async function proxy(request: NextRequest) {
  return withMiddleware(
    request,
    routes,
    (result) => {
      if (result) return result.response;

      return NextResponse.next();
    },
    (error) => {
      if (process.env.NODE_ENV === "development") {
        return new NextResponse(
          `Middleware Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          { status: 500 }
        );
      }

      return NextResponse.next();
    }
  );
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
