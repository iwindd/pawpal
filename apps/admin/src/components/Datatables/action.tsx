import { Button, Menu, MenuItemProps, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Fragment } from "react";

interface ActionProps {
  label: string;
  actions: {
    label?: string;
    translate?: string;
    action?: string | (() => void);
    icon?: React.ComponentType<any>;
    divider?: boolean;
    header?: string;
    rightSection?: React.ReactNode;
    color?: MenuItemProps["color"];
    props?: MenuItemProps;
  }[];
}
const TableAction = ({ label, actions }: ActionProps) => {
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

export default TableAction;
