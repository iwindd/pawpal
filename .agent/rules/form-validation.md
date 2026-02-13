# Form Validation Rules

All forms that submit data to the server MUST use Zod validation via the `useFormValidate` hook.

## Stack

| Layer     | Tool                                         | Location                                         |
| --------- | -------------------------------------------- | ------------------------------------------------ |
| Schema    | Zod (v4)                                     | `@pawpal/shared` → `src/schemas/`                |
| Resolver  | `mantine-form-zod-resolver` (`zod4Resolver`) | Re-exported as `resolver` from `@pawpal/ui/form` |
| Form Hook | `useFormValidate`                            | `src/hooks/useFormValidate.ts` (in each app)     |
| UI        | Mantine form components                      | `@pawpal/ui/core`                                |

## Pattern

### 1. Define or reuse a Zod schema in `@pawpal/shared`

```typescript
// packages/shared/src/schemas/auth.ts
import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### 2. Use `useFormValidate` in the component

```typescript
import useFormValidate from "@/hooks/useFormValidate";
import { LoginInput, loginSchema } from "@pawpal/shared";

const form = useFormValidate<LoginInput>({
  schema: loginSchema,
  mode: "uncontrolled",
  initialValues: {
    email: "",
    password: "",
  },
});
```

### 3. Bind to form and inputs

```tsx
<form onSubmit={form.onSubmit(handleSubmit)}>
  <TextInput
    label={__("email")}
    key={form.key("email")}
    {...form.getInputProps("email")}
  />
</form>
```

## Rules

- **Never validate manually** — always use `useFormValidate` with a Zod schema.
- **Schemas live in `@pawpal/shared`** — keep them reusable across `apps/admin`, `apps/web`, and `apps/api`.
- **Export both schema and inferred type** — always export `const fooSchema` and `type FooInput`.
- **Use `mode: "uncontrolled"`** for better performance unless controlled mode is specifically needed.
- **Use `form.key()` and `form.getInputProps()`** — this is the standard Mantine pattern for binding inputs.
- **Submit via `form.onSubmit(handler)`** — this triggers validation before calling `handler`.
