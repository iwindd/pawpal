import { ProductResponse } from "@pawpal/shared";
import { Box, Group, Image, Stack, Text, Title } from "@pawpal/ui/core";
import NextImage from "next/image";

interface InfoPartialProps {
  product: ProductResponse;
}

const InfoPartial = ({ product }: InfoPartialProps) => {
  return (
    <Group>
      <Group>
        <Box h={150} w={150}>
          <Image
            component={NextImage}
            src={`/assets/images/products/${product.slug}`}
            alt={product.name}
            height={150}
            width={150}
            fit="cover"
            fallbackSrc="/assets/images/fallback-product.png"
          />
        </Box>
        <Stack gap="xs">
          <Title order={1}>{product.name}</Title>
          <Text c="dimmed" size="sm">
            {product.category.name}
          </Text>
        </Stack>
      </Group>
      <Group>{/* TODO: Add download platform */}</Group>
    </Group>
  );
};

export default InfoPartial;
