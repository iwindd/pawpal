import {
  Paper as BasePaper,
  createPolymorphicComponent,
  Group,
  Title,
  type PaperProps as BasePaperProps,
  type TitleProps,
} from "@mantine/core";
import { forwardRef } from "react";

interface ExtraPaperProps extends BasePaperProps {
  order?: TitleProps["order"];
  title?: string;
  rightSection?: React.ReactNode;
  titleProps?: TitleProps;
  children?: React.ReactNode;
}

const _Paper = forwardRef<HTMLDivElement, BasePaperProps & ExtraPaperProps>(
  (props, ref) => {
    const { order, title, children, rightSection, titleProps, ...others } =
      props;

    const titleComponent = title ? (
      <Title order={order ?? 6} mb="md" {...titleProps}>
        {title}
      </Title>
    ) : null;

    return (
      <BasePaper ref={ref} {...others}>
        {rightSection && (
          <Group justify={"title" in props ? "space-between" : "flex-end"}>
            {titleComponent}
            {rightSection}
          </Group>
        )}
        {title && !rightSection && titleComponent}
        {children}
      </BasePaper>
    );
  }
);

_Paper.displayName = "CustomPaper";

const Paper = createPolymorphicComponent<"div", ExtraPaperProps>(_Paper);

export default Paper;
