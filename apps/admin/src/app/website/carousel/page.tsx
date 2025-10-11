"use client";

import PublishDatatable from "@/components/Datatables/Carousel/publish";
import { Button, Grid, Group } from "@pawpal/ui/core";
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
