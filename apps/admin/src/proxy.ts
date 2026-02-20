import {
  middlewareRegistry,
  RouteDefinition,
  withMiddleware,
} from "@pawpal/nextjs-middleware";
import { NextRequest, NextResponse } from "next/server";
import AuthMiddleware from "./middlewares/AdminMiddleware";
import RedirectIfAdminMiddleware from "./middlewares/RedirectIfAdminMiddleware";

// Define routes for this application
const routes: RouteDefinition[] = [
  // Allow guests on the login page
  { path: "/login", middleware: ["redirectIfAdmin"] },
  // Apply admin middleware globally to all other routes
  { path: "/*", middleware: ["admin"] },
];

// Register middleware
middlewareRegistry.register({
  name: "admin",
  handler: AuthMiddleware,
  priority: 1,
});

middlewareRegistry.register({
  name: "redirectIfAdmin",
  handler: RedirectIfAdminMiddleware,
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
          { status: 500 },
        );
      }

      return NextResponse.next();
    },
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
