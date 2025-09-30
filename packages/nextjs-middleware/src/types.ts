import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware context containing request information and shared data
 */
export interface MiddlewareContext {
  request: NextRequest;
  response: NextResponse;
  user?: any; // User session data
  params?: Record<string, string>; // Route parameters
  query?: Record<string, string>; // Query parameters
  data?: Record<string, any>; // Shared data between middleware
}

/**
 * Middleware result indicating what should happen next
 */
export type MiddlewareResult =
  | { type: "continue"; response?: NextResponse }
  | { type: "redirect"; url: string; status?: number }
  | { type: "rewrite"; url: string }
  | { type: "block"; status?: number; message?: string };

/**
 * Middleware function signature
 */
export type MiddlewareFunction = (
  context: MiddlewareContext
) => Promise<MiddlewareResult> | MiddlewareResult;

/**
 * Middleware configuration options
 */
export interface MiddlewareConfig {
  name: string;
  handler: MiddlewareFunction;
  priority?: number; // Lower numbers run first
  only?: string[]; // Routes to apply middleware to
  except?: string[]; // Routes to exclude middleware from
  parameters?: Record<string, any>; // Middleware-specific parameters
}

/**
 * Route group configuration
 */
export interface RouteGroup {
  prefix?: string;
  middleware?: string[];
  routes: RouteDefinition[];
}

/**
 * Route definition
 */
export interface RouteDefinition {
  path: string;
  methods?: string[];
  middleware?: string[];
  name?: string;
  parameters?: Record<string, any>;
}

/**
 * Middleware pipeline result
 */
export interface PipelineResult {
  response: NextResponse;
  context: MiddlewareContext;
  executed: string[]; // Names of executed middleware
  blocked: boolean;
}
