import { PaymentData } from "@/configs/payment";
import { Box, Group, Image, Radio, Stack, Text, Title } from "@pawpal/ui/core";
import NextImage from "next/image";
import classes from "./style.module.css";

interface PaymentRadioProps {
  data: PaymentData;
  totalPrice: number;
}

const PaymentRadio = ({ data, totalPrice }: PaymentRadioProps) => {
  return (
    <Radio.Card className={classes.root} radius="md" value={data.value}>
      <Group wrap="nowrap" align="center" justify="space-between" w="100%">
        <Group>
          <Box w={32} h={32}>
            <Image
              component={NextImage}
              src={`/assets/images/fallback-product.jpg`}
              alt={data.label}
              width={32}
              height={32}
            />
          </Box>
          <div>
            <Title order={5} className={classes.label}>
              {data.label}
            </Title>
            <Text size="xs" className={classes.description}>
              {data.description}
            </Text>
          </div>
        </Group>
        <Stack>
          <Text size="xs" className={classes.price}>
            {totalPrice}
          </Text>
        </Stack>
      </Group>
    </Radio.Card>
  );
};

export default PaymentRadio;
