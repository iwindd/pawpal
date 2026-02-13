---
trigger: always_on
---

# Import Rules

You MUST follow these import rules when working with UI components and Icons:

## 1. UI Components (Mantine)

ALWAYS import Mantine UI components, hooks, and notifications from the `@pawpal/ui` package. DO NOT import directly from `@mantine/*` or `mantine-datatable`.

- **Core Components & Data Table**:

  ```typescript
  // ✅ GOOD
  import { Button, TextInput, DataTable } from "@pawpal/ui/core";

  // ❌ BAD
  import { Button } from "@mantine/core";
  import { DataTable } from "mantine-datatable";
  ```

- **Hooks**:

  ```typescript
  // ✅ GOOD
  import {
    useDisclosure,
    useDebouncedValue,
    useConfirmation,
  } from "@pawpal/ui/hooks";

  // ❌ BAD
  import { useDisclosure } from "@mantine/hooks";
  import { useConfirmation } from "@/hooks/useConfirmation"; // Use the one re-exported from @pawpal/ui
  ```

- **Notifications**:

  ```typescript
  // ✅ GOOD
  import { Notifications, notify } from "@pawpal/ui/notifications";

  // ❌ BAD
  import { Notifications } from "@mantine/notifications";
  ```

## 2. Icons

ALWAYS import icons from the `@pawpal/icons` package. DO NOT import directly from `@tabler/icons-react`.

- **Icons**:

  ```typescript
  // ✅ GOOD
  import { IconEdit, IconTrash } from "@pawpal/icons";

  // ❌ BAD
  import { IconEdit, IconTrash } from "@tabler/icons-react";
  ```

## 3. General

- Prioritize using shared components and utilities from `@pawpal/*` packages over direct external dependencies to ensure consistency and maintainability.
