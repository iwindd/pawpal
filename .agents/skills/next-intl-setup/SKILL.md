---
name: next-intl-setup
description: Comprehensive guide for setting up `next-intl` in Next.js App Router projects using a cookie-based, non-prefixing localization strategy. Use this skill when you need to initialize or configure localization for a new or existing Next.js application (e.g., in `apps/admin` or `apps/web`).
---

# next-intl Setup Skill

This skill provides a step-by-step guide and templates for implementing localization in Next.js App Router projects, specifically tailored for the `pawpal` workspace patterns.

## Strategy: Cookie-based, Non-prefixing

This setup uses cookies to store the user's locale preference and does not use URL prefixes (e.g., `/th/dashboard`). This is ideal for internal dashboards or apps where a consistent URL structure is preferred.

## Workflow

### 1. Install Dependencies

Ensure `next-intl` is installed in your application:

```bash
npm install next-intl
```

### 2. Configure Next.js Plugin

Update `next.config.ts` (or `next.config.mjs`) to use the `next-intl` plugin.

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
};

export default withNextIntl(nextConfig);
```

### 3. Create Locale Configuration

Create `src/configs/locales.ts` to define supported languages. You can use the provided template:

- Templates: [locales.ts.template](assets/locales.ts.template)

```bash
# Example command to copy template (if applicable)
cp assets/locales.ts.template src/configs/locales.ts
```

### 4. Set Up i18n Request Configuration

Create `src/i18n/request.ts`. This file handles loading messages for Server Components.

- Templates: [request.ts.template](assets/request.ts.template)

> [!IMPORTANT]
> The template assumes messages are located in the `messages/` directory at the project root.

### 5. Add Translation Messages

Create JSON files for each locale in the `messages/` directory (e.g., `messages/th.json`, `messages/en.json`).

- Templates: [th.json.template](assets/th.json.template)

### 6. Wrap Root Layout

Wrap your application in the `NextIntlClientProvider` within `src/app/layout.tsx`.

```typescript
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 7. Global Middleware (Optional but Recommended)

If the project uses a shared middleware (like `@pawpal/nextjs-middleware`), ensure it handles locale detection or redirects if necessary. For standard setup, `next-intl` uses its own middleware if URL prefixing is required, but for this cookie-based approach, the `request.ts` handles the heavy lifting on the server.

## Best Practices

- **Type Safety**: Use the `locales` array to derive types for your application.
- **Server Components**: Use `getTranslations` for async Server Components.
- **Client Components**: Use `useTranslations` hooks in Client Components.
- **Dynamic Formatting**: Use the `formats` object in `request.ts` for consistent currency and date formatting.
