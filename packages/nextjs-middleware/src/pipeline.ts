import { NextRequest, NextResponse } from "next/server";
import { middlewareRegistry } from "./registry";
import {
  MiddlewareConfig,
  MiddlewareContext,
  PipelineResult,
  RouteDefinition,
} from "./types";

/**
 * Middleware pipeline for executing middleware in sequence
 */
export class MiddlewarePipeline {
  private readonly context: MiddlewareContext;

  constructor(request: NextRequest, route?: RouteDefinition) {
    this.context = {
      request,
      response: NextResponse.next(),
      params: {},
      query: {},
      data: {},
    };

    // Extract query parameters
    const url = new URL(request.url);
    url.searchParams.forEach((value, key) => {
      this.context.query![key] = value;
    });
  }

  /**
   * Execute middleware pipeline
   */
  async execute(middlewareNames: string[]): Promise<PipelineResult> {
    const executed: string[] = [];
    let blocked = false;

    // Get middleware configurations sorted by priority
    const middlewareConfigs = middlewareRegistry.getByNames(middlewareNames);

    for (const config of middlewareConfigs) {
      // Check if middleware should run on this route
      if (!this.shouldRunMiddleware(config)) {
        continue;
      }

      try {
        const result = await config.handler(this.context);
        executed.push(config.name);

        // Handle middleware result
        switch (result.type) {
          case "continue":
            if (result.response) {
              this.context.response = result.response;
            }
            break;

          case "redirect":
            return {
              response: NextResponse.redirect(
                new URL(result.url, this.context.request.url),
                {
                  status: result.status || 302,
                }
              ),
              context: this.context,
              executed,
              blocked: false,
            };

          case "rewrite":
            return {
              response: NextResponse.rewrite(
                new URL(result.url, this.context.request.url)
              ),
              context: this.context,
              executed,
              blocked: false,
            };

          case "block": {
            const status = result.status || 403;
            const message = result.message || "Access denied";

            return {
              response: new NextResponse(message, { status }),
              context: this.context,
              executed,
              blocked: true,
            };
          }
        }
      } catch (error) {
        console.error(`Middleware ${config.name} failed:`, error);
        // Continue to next middleware on error
      }
    }

    return {
      response: this.context.response,
      context: this.context,
      executed,
      blocked,
    };
  }

  /**
   * Check if middleware should run on current route
   */
  private shouldRunMiddleware(config: MiddlewareConfig): boolean {
    const pathname = this.context.request.nextUrl.pathname;

    // Check 'only' routes
    if (config.only && config.only.length > 0) {
      return config.only.some((pattern: string) =>
        this.matchesPattern(pathname, pattern)
      );
    }

    // Check 'except' routes
    if (config.except && config.except.length > 0) {
      return !config.except.some((pattern: string) =>
        this.matchesPattern(pathname, pattern)
      );
    }

    return true;
  }

  /**
   * Check if pathname matches pattern (supports wildcards)
   */
  private matchesPattern(pathname: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern === pathname) return true;

    // Convert pattern to regex
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  /**
   * Get current context
   */
  getContext(): MiddlewareContext {
    return this.context;
  }

  /**
   * Set data in context
   */
  setData(key: string, value: any): void {
    this.context.data![key] = value;
  }

  /**
   * Get data from context
   */
  getData(key: string): any {
    return this.context.data![key];
  }
}
