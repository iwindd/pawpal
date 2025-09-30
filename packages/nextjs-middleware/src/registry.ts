import { MiddlewareConfig } from "./types";

/**
 * Middleware registry for managing and executing middleware
 */
export class MiddlewareRegistry {
  private readonly middleware: Map<string, MiddlewareConfig> = new Map();
  private globalMiddleware: string[] = [];

  /**
   * Register a middleware
   */
  register(config: MiddlewareConfig): void {
    this.middleware.set(config.name, config);
  }

  /**
   * Register multiple middleware at once
   */
  registerMany(configs: MiddlewareConfig[]): void {
    configs.forEach((config) => this.register(config));
  }

  /**
   * Get a middleware by name
   */
  get(name: string): MiddlewareConfig | undefined {
    return this.middleware.get(name);
  }

  /**
   * Check if middleware exists
   */
  has(name: string): boolean {
    return this.middleware.has(name);
  }

  /**
   * Get all registered middleware
   */
  getAll(): MiddlewareConfig[] {
    return Array.from(this.middleware.values());
  }

  /**
   * Get middleware by names, sorted by priority
   */
  getByNames(names: string[]): MiddlewareConfig[] {
    return names
      .map((name) => this.middleware.get(name))
      .filter((config): config is MiddlewareConfig => config !== undefined)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  /**
   * Add global middleware (runs on all routes)
   */
  addGlobal(name: string): void {
    if (!this.globalMiddleware.includes(name)) {
      this.globalMiddleware.push(name);
    }
  }

  /**
   * Remove global middleware
   */
  removeGlobal(name: string): void {
    this.globalMiddleware = this.globalMiddleware.filter((n) => n !== name);
  }

  /**
   * Get all global middleware
   */
  getGlobal(): MiddlewareConfig[] {
    return this.getByNames(this.globalMiddleware);
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.middleware.clear();
    this.globalMiddleware = [];
  }

  /**
   * Get middleware count
   */
  count(): number {
    return this.middleware.size;
  }

  /**
   * Remove a middleware by name
   */
  remove(name: string): boolean {
    return this.middleware.delete(name);
  }

  /**
   * Get middleware names
   */
  getNames(): string[] {
    return Array.from(this.middleware.keys());
  }
}

// Global registry instance
export const middlewareRegistry = new MiddlewareRegistry();
