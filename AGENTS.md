# AGENTS.md - PawPal Development Guide

This document provides guidelines and commands for agentic coding agents working in this repository.

---

## 1. Project Structure

```
pawpal/
├── apps/
│   ├── api/         # NestJS backend
│   ├── web/         # Next.js frontend (customer-facing)
│   └── admin/       # Next.js frontend (admin dashboard)
├── packages/
│   ├── ui/          # Shared UI components
│   ├── shared/      # Shared types and utilities
│   ├── icons/       # Icon library
│   ├── eslint-config/  # ESLint configurations
│   ├── typescript-config/  # TypeScript configs
│   └── nextjs-middleware/  # Next.js middleware
```

### `apps/admin` — Admin Dashboard (Next.js App Router)

Internal dashboard for managing products, orders, employees, etc.

| Directory             | Purpose                                                                        |
| --------------------- | ------------------------------------------------------------------------------ |
| `src/app/`            | Next.js App Router pages and layouts                                           |
| `src/components/`     | Reusable UI components (layouts, selectors, datatables, etc.)                  |
| `src/configs/`        | App configuration (API endpoints, locales, navbar, routes)                     |
| `src/features/`       | Feature-specific server actions grouped by domain (auth, product, order, etc.) |
| `src/hooks/`          | Custom React hooks (datatable, form validation, image upload, etc.)            |
| `src/i18n/`           | `next-intl` request configuration for server-side localization                 |
| `src/libs/`           | Utilities and API client (Axios-based, with server/client variants)            |
| `src/middlewares/`    | Route-level middleware definitions (auth guards, redirects)                    |
| `src/providers/`      | React context providers (Redux store, WebSocket)                               |
| `src/server/actions/` | Next.js Server Actions                                                         |
| `src/proxy.ts`        | Middleware pipeline configuration using `@pawpal/nextjs-middleware`            |
| `src/route.tsx`       | Route definitions with permissions and sidebar config                          |
| `messages/`           | Translation JSON files (`th.json`, `en.json`)                                  |

---

### `apps/web` — Customer-facing Website (Next.js App Router)

Public-facing storefront for customers.

| Directory             | Purpose                              |
| --------------------- | ------------------------------------ |
| `src/app/`            | Next.js App Router pages and layouts |
| `src/components/`     | Reusable UI components               |
| `src/configs/`        | App configuration                    |
| `src/features/`       | Feature-specific server actions      |
| `src/hooks/`          | Custom React hooks                   |
| `src/i18n/`           | `next-intl` request configuration    |
| `src/libs/`           | Utilities and API client             |
| `src/middlewares/`    | Route-level middleware definitions   |
| `src/providers/`      | React context providers              |
| `src/server/actions/` | Next.js Server Actions               |
| `src/themes/`         | Theme configuration                  |
| `src/utils/`          | General utility functions            |
| `src/proxy.ts`        | Middleware pipeline configuration    |
| `src/route.ts`        | Route definitions                    |
| `messages/`           | Translation JSON files               |

---

### `apps/api` — Backend API (NestJS + Prisma)

RESTful API server implementing **Hexagonal Architecture (Ports and Adapters)**. No localization needed.

| Directory                       | Purpose                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/modules/*/domain/`         | Domain layer containing abstract interfaces (`repository.port.ts`, business entities). Zero external dependencies.       |
| `src/modules/*/application/`    | Application layer containing UseCases that orchestrate business workflows. Depends only on the Domain layer.             |
| `src/modules/*/infrastructure/` | Infrastructure layer implementing Domain ports (e.g., `prisma-*.repository.ts`). Handles database and external services. |
| `src/modules/*/presentation/`   | Presentation layer containing HTTP Controllers. Handles requests and delegates to UseCases.                              |
| `src/modules/*/`                | Module definitions (`*.module.ts`) and dependency injection wiring (`*.providers.ts`).                                   |
| `src/common/`                   | Shared guards, decorators, interceptors, pipes, filters                                                                  |
| `src/config/`                   | App configuration (env validation, etc.)                                                                                 |
| `src/utils/`                    | Backend utility functions                                                                                                |
| `prisma/`                       | Prisma schema, migrations, and seed files                                                                                |

---

## Packages (shared)

| Package                     | Purpose                                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@pawpal/ui`                | Shared UI component library built on Mantine. Exports core components, fonts, styles, hooks, and providers.       |
| `@pawpal/shared`            | Shared TypeScript types, Zod schemas, enums, utility functions, and configs used by both frontend and backend.    |
| `@pawpal/nextjs-middleware` | Reusable middleware pipeline system for Next.js apps. Handles route matching and sequential middleware execution. |
| `@pawpal/icons`             | Shared icon components.                                                                                           |
| `@pawpal/eslint-config`     | Shared ESLint configurations.                                                                                     |
| `@pawpal/typescript-config` | Shared `tsconfig.json` presets.                                                                                   |

## Key Patterns

- **Server Actions**: Business logic for mutations lives in `src/features/<domain>/actions.ts`, called from components via `useTransition` or form actions.
- **API Client**: `src/libs/api/` provides both server-side (`APISession`) and client-side (`useAPI`) Axios instances with automatic auth token handling.
- **Route Config**: `src/route.tsx` (or `src/route.ts`) defines all routes with permissions, icons, and grouping, used by both the sidebar and middleware.
- **Middleware Pipeline**: `src/proxy.ts` maps routes to middleware chains using `@pawpal/nextjs-middleware`.

## 2. Build, Lint, and Test Commands

### Root Commands (Turbo)

```bash
# Build all packages and apps
pnpm build

# Run development servers (all apps)
pnpm dev

# Development servers excluding specific apps
pnpm dev:admin    # Excludes web
pnpm dev:web      # Excludes admin
pnpm dev:api      # Only API

# Lint all projects
pnpm lint

# Type check all projects
pnpm check-types

# Format code
pnpm format

# Database commands
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
pnpm db:reset

# Clean build artifacts
pnpm clean         # Clean all node_modules and build dirs
```

### API (NestJS)

```bash
cd apps/api

# Run tests
pnpm test              # Run all tests
pnpm test --testNamePattern="test-name"  # Run single test
pnpm test:watch       # Watch mode
pnpm test:cov         # Coverage

# Build & run
pnpm build
pnpm start            # Production
pnpm dev              # Development with watch

# Database
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
```

### Web/Admin (Next.js)

```bash
cd apps/web  # or apps/admin

# Development
pnpm dev

# Build & production
pnpm build
pnpm start

# Linting
pnpm lint
pnpm type-check
```

### Running a Single Test (API)

```bash
# Method 1: Use --testNamePattern
cd apps/api
pnpm test --testNamePattern="UserService"

# Method 2: Run specific test file
cd apps/api
pnpm test src/users/user.service.spec.ts
```

---

## 3. Code Style Guidelines

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Enable strict mode** - Use `strict: true` in tsconfig
- **Avoid `any`** - Use `unknown` or proper types instead
- **Use explicit return types** for public functions
- **Prefer interfaces over types** for object shapes

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`, `pet-list.tsx`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: SCREAMING_SNAKE_CASE for values, camelCase for exported consts
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `PetOwner`, `CreatePetInput`)
- **Booleans**: Use `is`, `has`, `can`, `should` prefixes (e.g., `isActive`, `hasPermission`)

### Imports

- **Use absolute imports** with `@/` prefix (configured in tsconfig)
- **Avoid barrel imports** (index files re-exporting everything)
- **Import directly from packages** for icon/component libraries when possible:

  ```typescript
  // Good - direct import
  import Check from "lucide-react/dist/esm/icons/check";

  // Or use Next.js optimizePackageImports in next.config.js
  ```

- **Group imports**: External > Internal (packages) > Relative
- **Sort imports alphabetically** within groups

### Formatting

- **Use Prettier** for all code formatting
- **Line length**: 100 characters (project default)
- **Use semicolons**: Yes
- **Quotes**: Single quotes for strings, double for JSX props
- **Trailing commas**: Always

### React/Next.js Guidelines

- **Use Server Components** by default in Next.js App Router
- **Add `'use client'`** directive only when needed (hooks, event handlers, browser APIs)
- **Avoid `use client` wrappers** - place directive at the leaf component
- **Use Suspense boundaries** for async data fetching
- **Prefer composition over wrapper components**
- **Use `next/dynamic`** for lazy loading heavy components

### Error Handling

- **Use Zod** for input validation in API and forms
- **Throw typed errors** with consistent error classes
- **Never expose internal errors** to clients - return user-friendly messages
- **Always wrap async operations** in try-catch
- **Use error boundaries** for React component trees

### Database (Prisma)

- **Use Prisma client** with connection pooling
- **Always include where clauses** in updates/deletes
- **Use transactions** for multi-step operations
- **Name migrations descriptively**: `add_user_role_field`

### Server Actions (Next.js)

- **Always validate input** with Zod schemas
- **Always authenticate and authorize** inside each Server Action
- **Do not rely solely on middleware** for authorization
- **Return typed responses**

---

## 4. Performance Guidelines

Follow the Vercel React Best Practices documented in `.agent/skills/vercel-react-best-practices/AGENTS.md`. Key points:

### Critical

- Eliminate waterfalls: use `Promise.all()` for parallel operations
- Defer awaits until needed
- Avoid barrel file imports
- Use `next/dynamic` for lazy loading

### Server-Side

- Authenticate Server Actions like API routes
- Minimize serialization at RSC boundaries
- Use `React.cache()` for deduplication within requests
- Use `after()` for non-blocking operations

### Client-Side

- Use SWR for data fetching with automatic deduplication
- Prefer derived state over `useEffect` + state
- Use functional setState updates: `setItems(curr => [...curr, newItem])`
- Use lazy state initialization for expensive values

---

## 5. Testing Guidelines

### API Tests (Jest)

- **Test files**: `*.spec.ts` in same directory as source
- **Use describe blocks** for grouping related tests
- **Use meaningful test names**: `should return 401 when not authenticated`
- **Mock external dependencies**: database, external APIs
- **Use `supertest`** for HTTP integration tests

```typescript
describe("AuthController", () => {
  describe("POST /auth/login", () => {
    it("should return 401 with invalid credentials", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: "invalid@test.com", password: "wrong" });

      expect(response.status).toBe(401);
    });
  });
});
```

### React Components

- Tests are not currently configured for web/admin apps
- When adding tests, use **Vitest + React Testing Library**

---

## 6. Git Conventions

- **Branch naming**: `feature/description`, `fix/description`, `hotfix/description`
- **Commits**: Use conventional commits (e.g., `feat: add pet profile`, `fix: resolve login issue`)
- **PR titles**: Descriptive, starts with type (feat, fix, refactor, etc.)

---

## 7. Key Technologies

| Area            | Technology                      |
| --------------- | ------------------------------- |
| Frontend        | Next.js 16+ (App Router), React |
| Styling         | Mantine, Tailwind CSS           |
| State           | Redux Toolkit                   |
| Backend         | NestJS                          |
| Database        | PostgreSQL, Prisma              |
| Auth            | Passport.js (JWT + Local)       |
| Testing         | Jest                            |
| i18n            | next-intl                       |
| Package Manager | pnpm                            |
| Build System    | Turborepo                       |

---

## 8. Common Patterns

### API Route Handler

```typescript
@Controller("users")
export class UsersController {
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
```

### Server Action (Next.js)

```typescript
"use server";

import { verifySession } from "@/lib/auth";
import { z } from "zod";

const createPetSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["dog", "cat", "other"]),
});

export async function createPet(data: unknown) {
  const input = createPetSchema.parse(data);

  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  return db.pet.create({ data: { ...input, ownerId: session.user.id } });
}
```

### Client Component

```typescript
'use client'

import { useState } from 'react'

export function PetCard({ pet }: { pet: Pet }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="pet-card">
      <h3>{pet.name}</h3>
    </div>
  )
}
```
