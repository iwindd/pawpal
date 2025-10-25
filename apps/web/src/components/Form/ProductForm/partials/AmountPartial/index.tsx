import { IconMinus, IconPlus } from "@pawpal/icons";
import { Button, Card, ErrorMessage, Group, Title } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";
import { PurchaseFormInput } from "../..";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 99;

interface AmountPartialProps {
  form: UseFormReturnType<PurchaseFormInput>;
}

const AmountPartial = ({ form }: AmountPartialProps) => {
  const __ = useTranslations("ProductDetail");
  const onIncrease = () => {
    form.setFieldValue(
      "amount",
      Math.min(MAX_AMOUNT, form.getValues().amount + 1)
    );
  };

  const onDecrease = () => {
    form.setFieldValue(
      "amount",
      Math.max(MIN_AMOUNT, form.getValues().amount - 1)
    );
  };

  return (
    <Card shadow="sm">
      <Group justify="space-between" align="center">
        <Title order={6}>{__("amount")}</Title>
        <Button.Group
          key={form.key("amount")}
          {...form.getInputProps("amount")}
        >
          <Button variant="default" radius="md" onClick={onDecrease}>
            <IconMinus size={12} />
          </Button>
          <Button.GroupSection
            variant="default"
            bg="var(--mantine-color-body)"
            miw={80}
          >
            {form.getValues().amount}
          </Button.GroupSection>
          <Button variant="default" radius="md" onClick={onIncrease}>
            <IconPlus size={12} />
          </Button>
        </Button.Group>
      </Group>
      <ErrorMessage
        align="start"
        size="xs"
        formatGroup="Errors.purchase"
        message={form.errors.amount as string}
      />
    </Card>
  );
};

export default AmountPartial;
