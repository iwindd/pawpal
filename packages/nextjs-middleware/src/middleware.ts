import { NextRequest } from "next/server";
import { getMiddlewareForRoute } from "./config";
import { MiddlewarePipeline } from "./pipeline";
import { PipelineResult, RouteDefinition } from "./types";

export const withMiddleware = async (
  request: NextRequest,
  routes: RouteDefinition[],
  onSuccess: (response?: PipelineResult) => void,
  onError: (error: unknown) => void
) => {
  try {
    // Get middleware for this route
    const middlewareNames = getMiddlewareForRoute(
      request.nextUrl.pathname,
      routes
    );

    // Skip if no middleware
    if (middlewareNames.length === 0) return onSuccess();

    // Create and execute pipeline
    const pipeline = new MiddlewarePipeline(request);
    const result = await pipeline.execute(middlewareNames);

    // Return the response
    return onSuccess(result);
  } catch (error) {
    console.error("Middleware execution failed:", error);
    return onError(error);
  }
};
