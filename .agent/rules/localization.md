# Localization Rules

When creating or modifying any web display elements (components, pages, UI layouts) in this workspace, you MUST use `next-intl` for localization.

## Rules

- **Language Support**: Currently, only Thai (`th`) localization is required. Avoid hardcoding English or Thai strings directly in the JSX/TSX.
- **Scope**: Applies to all frontend code in `apps/admin`, `apps/web`, and shared UI packages. Does not apply to backend-only logic (e.g., `apps/api` or server-side utility functions that don't produce UI).
- **Implementation Pattern**:
  - Use `useTranslations` hook in Client Components.
  - Use `getTranslations` function in Server Components.
  - Reference the `next-intl-setup` skill for the established patterns in this project.
  - Ensure all new strings are added to the corresponding `messages/th.json` file.

## Example

### Before

```tsx
<h1>สวัสดี</h1>
```

### After

```tsx
const t = useTranslations("Common");
return <h1>{t("hello")}</h1>;
```
