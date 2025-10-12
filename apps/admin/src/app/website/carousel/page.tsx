"use client";

import CarouselDatatable from "@/components/Datatables/Carousel/carousel";
import PublishDatatable from "@/components/Datatables/Carousel/publish";
import { IconPlus } from "@pawpal/icons";
import {
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PreviewCarousel } from "./components/PreviewCarousel";

const CarouselPage = () => {
  const __ = useTranslations("Carousel.main");

  return (
    <div>
      <Grid gutter={0}>
        <Grid.Col span={12}>
          <Group pb={"md"} justify="space-between">
            <Stack gap="0">
              <Group>
                <Title order={2}>{__("title")}</Title>
              </Group>
              <Text size="sm" c="dimmed">
                {__("subtitle")}
              </Text>
            </Stack>
            <Button
              variant="outline"
              leftSection={<IconPlus />}
              component={Link}
              href="/website/carousel/create"
            >
              {__("add-btn")}
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            lg: 9,
          }}
        >
          <PreviewCarousel />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            lg: 3,
          }}
        >
          <PublishDatatable />
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper p={"lg"} mt={"md"}>
            <CarouselDatatable />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default CarouselPage;
