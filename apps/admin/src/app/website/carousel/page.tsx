"use client";

import CarouselDatatable from "@/components/Datatables/Carousel/carousel";
import PublishDatatable from "@/components/Datatables/Carousel/publish";
import { Button, Grid, Group, Paper } from "@pawpal/ui/core";
import Link from "next/link";
import { PreviewCarousel } from "./components/PreviewCarousel";

const CarouselPage = () => {
  return (
    <div>
      <Grid gutter={0}>
        <Grid.Col span={8}>
          <PreviewCarousel />
        </Grid.Col>
        <Grid.Col span={4}>
          <PublishDatatable />
        </Grid.Col>
        <Grid.Col span={12}>
          <Group justify="space-between" py="md">
            <Group>
              <Button component={Link} href={"carousel/create"}>
                Add
              </Button>
            </Group>
            <Group>
              <Button>Publish</Button>
              <Button>Archive</Button>
            </Group>
          </Group>
          <Paper p={"lg"}>
            <CarouselDatatable />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default CarouselPage;
