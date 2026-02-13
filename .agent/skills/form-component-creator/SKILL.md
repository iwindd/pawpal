---
name: form-component-creator
description: Guide for creating form components using useFormValidate and Zod. Use this skill when the user wants to create a new form component or refactor an existing one to use the project's standard form handling patterns.
---

# Form Component Creator

This skill provides a standardized approach to creating form components in the `apps/admin` (and potentially other) applications, ensuring consistency in validation, UI, and localization.

## Dependencies

- **Form Handling**: `useFormValidate` from `@/hooks/useFormValidate` (wrapper around standard form logic).
- **Validation**: Zod schemas from `@pawpal/shared`.
- **UI Components**: `@pawpal/ui/core` (TextInput, Button, Stack, Group, etc.).
- **Localization**: `useTranslations` from `next-intl`.

## Component Structure

A standard form component should follow this structure:

1.  **Imports**: Organize imports by source (hooks, shared types, UI, localization).
2.  **Props Interface**: Define `Props` including `initialValues` (if editable), `onSubmit`, `isLoading`, and optionally `errorMessage`.
3.  **Component Definition**:
    - Initialize translations: `const __ = useTranslations("Namespace.Context");`
    - Initialize form: `const form = useFormValidate(...)`
    - Render `<form onSubmit={form.onSubmit(onSubmit)}>`
    - Use `Stack` for vertical layout.
    - Use UI components with `key={form.key('field')}` and `{...form.getInputProps('field')}`.

## Code Template

```tsx
"use client";

import useFormValidate from "@/hooks/useFormValidate";
import { MyEntityInput, myEntitySchema } from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface MyFormProps {
  initialValues?: Partial<MyEntityInput>; // Optional for create, required for edit usually
  onSubmit: (values: MyEntityInput) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export default function MyForm({
  initialValues,
  onSubmit,
  isLoading,
  errorMessage,
}: MyFormProps) {
  const __ = useTranslations("MyEntity.form");

  const form = useFormValidate<MyEntityInput>({
    schema: myEntitySchema,
    initialValues: initialValues || {
      // Define default values here if strictly needed,
      // otherwise useFormValidate handles partials or undefined if schema allows?
      // Better to satisfy the type.
      description: "",
      name: "",
    },
    // Add `mode: 'controlled'` if you need to watch values or have dynamic conditional rendering based on values
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={__("name.label")}
          placeholder={__("name.placeholder")}
          required
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <TextInput
          label={__("description.label")}
          placeholder={__("description.placeholder")}
          key={form.key("description")}
          {...form.getInputProps("description")}
        />

        {errorMessage && (
          // Render error message if passed prop, or use specific error component
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}

        <Group justify="flex-end">
          <Button type="submit" loading={isLoading}>
            {__("actions.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
```

## Key Practices

### 1. Form Initialization

Use `useFormValidate` which likely wraps `@mantine/form` or `react-hook-form` logic adapted for the project.

```typescript
const form = useFormValidate<InputType>({
  schema: SchemaObject, // Zod schema
  initialValues: defaultOrPassedValues,
  // mode: "controlled" // Use this if you need to read values during render (variables dependent on form state)
});
```

### 2. Field Binding

Always use `key` and `getInputProps` for Mantine/UI integration.

```tsx
<TextInput key={form.key("fieldName")} {...form.getInputProps("fieldName")} />
```

### 3. Validation

Validation is handled by the Zod schema passed to `useFormValidate`. Ensure the schema in `@pawpal/shared` matches the form fields.

### 4. Localization

Use `next-intl`. Define keys in `messages/{lang}.json` under a structure that mimics the form fields when possible.

```json
"MyEntity": {
  "form": {
    "name": {
      "label": "Name",
      "placeholder": "Enter name"
    }
  }
}
```

### 5. Layout

- use `Stack` with `gap` for vertical spacing.
- use `Group` with `justify` for button placement (usually `flex-end`).
