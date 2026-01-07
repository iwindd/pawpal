import { Text, Title, TitleProps } from "@pawpal/ui/core";

const TextWithCaption = ({
  text,
  caption,
  order,
}: {
  order?: TitleProps["order"];
  text: string;
  caption: string;
}) => {
  return (
    <>
      <Title order={order}>{text}</Title>
      <Text c="dimmed" size="xs">
        {caption}
      </Text>
    </>
  );
};

export default TextWithCaption;
