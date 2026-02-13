# Project Structure

Pawpal is a Turborepo monorepo managed with `pnpm`. It contains 3 apps and 6 shared packages.

## Apps

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

RESTful API server. No localization needed.

| Directory      | Purpose                                                           |
| -------------- | ----------------------------------------------------------------- |
| `src/modules/` | NestJS feature modules (each with controller, service, DTO, etc.) |
| `src/common/`  | Shared guards, decorators, interceptors, pipes, filters           |
| `src/config/`  | App configuration (env validation, etc.)                          |
| `src/utils/`   | Backend utility functions                                         |
| `prisma/`      | Prisma schema, migrations, and seed files                         |

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
