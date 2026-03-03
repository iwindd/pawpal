"use client";
import { Box, Card, Center, Skeleton } from "@pawpal/ui/core";
import classes from "./style.module.css";

const ProductCardSkeleton = () => {
  return (
    <Card
      shadow="sm"
      w={"100%"}
      className={classes.card}
      padding={0}
      radius={0}
      withBorder={false}
      p={"xs"}
    >
      <Card.Section
        style={{
          aspectRatio: "500 / 550",
          position: "relative",
        }}
      >
        <Box w="100%" h="100%" pos="absolute">
          <Skeleton w="100%" h="100%" />
        </Box>
      </Card.Section>

      <Center>
        <Skeleton w={100} h={20} mt={"xs"} />
      </Center>
    </Card>
  );
};

export default ProductCardSkeleton;
