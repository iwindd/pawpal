import { IconMinus, IconPlus } from "@pawpal/icons";
import { PurchaseInput } from "@pawpal/shared";
import { Button } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 99;

interface AmountIndicatorProps {
  form: UseFormReturnType<PurchaseInput>;
}

const AmountIndicator = ({ form }: AmountIndicatorProps) => {
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
    <Button.Group key={form.key("amount")} {...form.getInputProps("amount")}>
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
  );
};

export default AmountIndicator;
