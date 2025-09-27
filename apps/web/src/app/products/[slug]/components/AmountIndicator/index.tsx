import { IconMinus, IconPlus } from "@pawpal/icons";
import { Button } from "@pawpal/ui/core";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 99;

interface AmountIndicatorProps {
  readonly amount: number;
  readonly setAmount: (amount: number) => void;
}

const AmountIndicator = ({ amount, setAmount }: AmountIndicatorProps) => {
  const onIncrease = () => {
    setAmount(Math.min(MAX_AMOUNT, amount + 1));
  };

  const onDecrease = () => {
    setAmount(Math.max(MIN_AMOUNT, amount - 1));
  };

  return (
    <Button.Group>
      <Button variant="default" radius="md" onClick={onDecrease}>
        <IconMinus size={12} />
      </Button>
      <Button.GroupSection
        variant="default"
        bg="var(--mantine-color-body)"
        miw={80}
      >
        {amount}
      </Button.GroupSection>
      <Button variant="default" radius="md" onClick={onIncrease}>
        <IconPlus size={12} />
      </Button>
    </Button.Group>
  );
};

export default AmountIndicator;
