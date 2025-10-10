"use client";

import useDatatable from "@/hooks/useDatatable";
import { Button, Grid, Group } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import Link from "next/link";
import { PreviewCarousel } from "./components/PreviewCarousel";

const MOCKUP = [
  {
    id: 1,
    image: "fallback-carousel.jpg",
    title: "Title",
    product: {
      name: "Product",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    image: "fallback-carousel.jpg",
    title: "Title",
    product: {
      name: "Product",
    },
  },
  {
    id: 3,
    image: "fallback-carousel.jpg",
    title: "Title",
    product: {
      name: "Product",
    },
  },
  {
    id: 4,
    image: "fallback-carousel.jpg",
    title: "Title",
    product: {
      name: "Product",
    },
  },
  {
    id: 5,
    image: "fallback-carousel.jpg",
    title: "Title",
    product: {
      name: "Product",
    },
  },
];

const CarouselPage = () => {
  const datatable = useDatatable<any>();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <Grid gutter={0}>
        <Grid.Col span={8}>
          <PreviewCarousel />
        </Grid.Col>
        <Grid.Col span={4}>
          {/*        <PublishDatatable
            records={MOCKUP}
            totalRecords={MOCKUP.length}
            {...datatable}
          /> */}
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
          {/*           <ArchiveDatatable
            records={MOCKUP}
            totalRecords={MOCKUP.length}
            {...datatable}
          /> */}
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default CarouselPage;
