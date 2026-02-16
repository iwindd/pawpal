import { IconPlus } from "@pawpal/icons";
import { Button } from "@pawpal/ui/core";
import Link from "next/link";

export const AddButton = Button.withProps({
  variant: "subtle",
  color: "secondary",
  size: "xs",
  rightSection: <IconPlus size={14} />,
});

export const AddButtonLink = Button.withProps({
  variant: "subtle",
  color: "secondary",
  size: "xs",
  component: Link,
  href: "#",
  rightSection: <IconPlus size={14} />,
});
