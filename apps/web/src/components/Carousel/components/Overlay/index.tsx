import { CarouselResponse } from "@pawpal/shared";
import { Box, Button, Flex, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import classes from "../style.module.css";

const CarouselOverlay = ({
  currentItem,
}: {
  currentItem: CarouselResponse;
}) => {
  const __ = useTranslations("Home");
  return (
    <Group className={`${classes.overlay} ${classes.fader}`}>
      <Box className={classes.content}>
        <Flex className={classes.flex}>
          <Stack gap={0} className={classes.carouselMessage} justify="end">
            <Text className={classes.category} size="xs" m="0">
              {currentItem?.product?.name}
            </Text>
            <Title order={3} className={classes.title} m="0">
              {currentItem?.title}
            </Title>
          </Stack>
          <Box>
            {currentItem?.product && (
              <Button
                component={Link}
                variant="primary"
                mt={"md"}
                className={classes.button}
                href={`/products/${currentItem.product.slug}`}
                px={"xl"}
              >
                {__("topup")}
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
    </Group>
  );
};

export default CarouselOverlay;
