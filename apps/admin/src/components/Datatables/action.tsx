import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MenuItemProps,
  Text,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Fragment } from "react";

type ActionAlign = "start" | "center" | "end";

export interface Action {
  label?: string;
  translate?: string;
  action?: string | (() => void);
  icon?: React.ComponentType<any>;
  divider?: boolean;
  header?: string;
  rightSection?: React.ReactNode;
  color?: MenuItemProps["color"];
  props?: MenuItemProps;
}
interface ActionProps {
  label?: string;
  displayType?: "menu" | "icon";
  actions: Action[];
  align?: ActionAlign;
}

const RenderMenu = ({
  label,
  actions,
}: {
  label: string;
  actions: ActionProps["actions"];
}) => {
  const __ = useTranslations("Datatable.Action");

  return (
    <Menu shadow="md" withArrow width={200}>
      <Menu.Target>
        <Button variant="transparent">{label}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {actions.map((action, index) => {
          const props: any = {
            onClick: action.action,
            color: action.color,
            leftSection: action.icon && <action.icon size={14} />,
            rightSection: action.rightSection && (
              <Text size="xs" c="dimmed">
                {action.rightSection}
              </Text>
            ),
            ...(action.props && { ...action.props }),
          };

          if (typeof action.action === "string") {
            props.onClick = () => undefined;
            props.component = Link;
            props.href = action.action;
          }

          return (
            <Fragment key={"action-" + index}>
              {action.header && <Menu.Label>{action.header}</Menu.Label>}
              <Menu.Item {...props}>
                {action.label ||
                  (action.translate && __(action.translate)) ||
                  "No Label"}
              </Menu.Item>
              {action.divider && <Menu.Divider />}
            </Fragment>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

const RenderIcon = ({ actions }: { actions: ActionProps["actions"] }) => {
  if (actions.length === 0) return null;

  return (
    <>
      {actions.map((action, index) => {
        const props: any = {
          onClick: action.action,
          color: action.color,
          ...(action.props && { ...action.props }),
        };

        if (typeof action.action === "string") {
          props.onClick = () => undefined;
          props.component = Link;
          props.href = action.action;
        }

        if (!action.icon) return null;

        const Icon = action.icon;

        return (
          <ActionIcon
            key={"action-icon-" + index}
            variant="light"
            size="sm"
            {...props}
          >
            <Icon size={14} />
          </ActionIcon>
        );
      })}
    </>
  );
};

const TableAction = ({
  label,
  displayType = "menu",
  align,
  actions,
}: ActionProps) => {
  return (
    <Group gap={4} justify={align} wrap="nowrap">
      {displayType == "icon" && <RenderIcon actions={actions} />}
      {displayType === "menu" && (
        <RenderMenu label={label || "Actions"} actions={actions} />
      )}
    </Group>
  );
};

export default TableAction;
