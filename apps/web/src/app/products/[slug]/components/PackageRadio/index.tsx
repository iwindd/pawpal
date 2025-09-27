import { ProductPackage } from "@pawpal/shared";
import { Box, Group, Image, Radio, Stack, Text, Title } from "@pawpal/ui/core";
import NextImage from "next/image";
import classes from "./style.module.css";

interface PackageProps {
  package: ProductPackage;
}

const PackageRadio = ({ package: data }: PackageProps) => {
  return (
    <Radio.Card className={classes.root} radius="md" value={data.id}>
      <Group wrap="nowrap" align="center" justify="space-between" w="100%">
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
        <Stack>
          <Text size="xs" className={classes.price}>
            {data.price}
          </Text>
        </Stack>
      </Group>
    </Radio.Card>
  );
};

export default PackageRadio;
