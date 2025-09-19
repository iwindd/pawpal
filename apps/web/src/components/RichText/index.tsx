import { Anchor, Text } from "@pawpal/ui/core";
import { ReactNode } from "react";

type Tag = "p" | "b" | "i";

type RichTextProps = {
  children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode;
};

const RichTextComponents = {
  p: (chunks: ReactNode) => <Text>{chunks}</Text>,
  b: (chunks: ReactNode) => <Text fw={700}>{chunks}</Text>,
  i: (chunks: ReactNode) => <Text fs={"italic"}>{chunks}</Text>,
  register: (chunks: ReactNode) => <Anchor href={"/register"}>{chunks}</Anchor>,
  dimmed: (chunks: ReactNode) => (
    <Text size="sm" c="dimmed">
      {chunks}
    </Text>
  ),
};

const RichText = ({ children }: RichTextProps) => {
  return <>{children(RichTextComponents)}</>;
};

export default RichText;
