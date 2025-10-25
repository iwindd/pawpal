import { getDiscountedPrice } from "@/utils/productUtils";
import { ProductResponse } from "@pawpal/shared";
import {
  Box,
  Card,
  Grid,
  Group,
  Image,
  Radio,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useFormatter } from "next-intl";
import NextImage from "next/image";
import { PurchaseFormInput } from "../..";
import classes from "./style.module.css";

interface PackagePartialProps {
  product: ProductResponse;
  form: UseFormReturnType<PurchaseFormInput>;
}

const PackagePartial = ({ product, form }: PackagePartialProps) => {
  const format = useFormatter();
  return (
    <Card shadow="sm">
      <Radio.Group
        key={form.key("packageId")}
        {...form.getInputProps("packageId")}
      >
        <Grid gutter="sm">
          {product.packages.map(({ sale, ...data }) => {
            return (
              <Grid.Col span={{ base: 12, md: 6 }} key={data.id}>
                <Radio.Card
                  className={classes.root}
                  radius="md"
                  value={data.id}
                >
                  <Group
                    wrap="nowrap"
                    align="center"
                    justify="space-between"
                    w="100%"
                  >
                    <Group>
                      <Box w={50} h={50}>
                        <Image
                          component={NextImage}
                          src={`/assets/images/fallback-product.jpg`}
                          alt={data.name}
                          width={50}
                          height={50}
                        />
                      </Box>
                      <div>
                        <Title order={5} className={classes.label}>
                          {data.name}
                        </Title>
                        <Text size="xs" className={classes.description}>
                          {data.description}
                        </Text>
                      </div>
                    </Group>
                    <Stack gap={0} align="flex-end">
                      <Text size="sm" inline>
                        {format.number(
                          getDiscountedPrice(data.price, sale),
                          "currency"
                        )}
                      </Text>
                      {sale && (
                        <Text size="xs" c="dimmed" td="line-through" inline>
                          {format.number(data.price, "currency")}
                        </Text>
                      )}
                    </Stack>
                  </Group>
                </Radio.Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Radio.Group>
    </Card>
  );
};

export default PackagePartial;
