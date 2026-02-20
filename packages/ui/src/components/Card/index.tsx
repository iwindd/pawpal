import { Card as BaseCard, CardSectionProps, Text, Title } from "@mantine/core";

const Header = ({
  title,
  subtitle,
  ...props
}: CardSectionProps & { title: string; subtitle?: string }) => (
  <BaseCard.Section inheritPadding py="md" {...props}>
    <Title order={5}>{title}</Title>
    {subtitle && (
      <Text size="xs" c="dimmed" lh={1.2}>
        {subtitle}
      </Text>
    )}
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
