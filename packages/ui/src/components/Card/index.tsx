import {
  Card as BaseCard,
  CardSectionProps,
  Group,
  Text,
  Title,
} from "@mantine/core";

const Header = ({
  title,
  subtitle,
  action,
  ...props
}: CardSectionProps & {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <BaseCard.Section inheritPadding py="md" {...props}>
    <Group justify="space-between" align="center" wrap="nowrap">
      <div>
        <Title order={5}>{title}</Title>
        {subtitle && (
          <Text size="xs" c="dimmed" lh={1.2}>
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div>{action}</div>}
    </Group>
  </BaseCard.Section>
);

const Content = ({
  children,
  ...props
}: CardSectionProps & { children: React.ReactNode }) => (
  <BaseCard.Section inheritPadding pb="md" {...props}>
    {children}
  </BaseCard.Section>
);

export const Card = Object.assign(BaseCard, {
  Header,
  Content,
}) as typeof BaseCard & {
  Header: typeof Header;
  Content: typeof Content;
};
