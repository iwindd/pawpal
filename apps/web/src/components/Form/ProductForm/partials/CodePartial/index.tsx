import { Button, Card, Group, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

const CodePartial = () => {
  const __ = useTranslations("ProductDetail");

  return (
    <Card shadow="sm">
      <Group justify="space-between" align="center">
        <TextInput placeholder={__("codePlaceholder")} flex={1} m={0} />
        <Button variant="default" w="fit-content" m={0}>
          {__("useCode")}
        </Button>
      </Group>
    </Card>
  );
};

export default CodePartial;
