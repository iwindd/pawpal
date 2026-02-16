"use client";

import { AddButtonLink } from "@/components/Button/AddButton";
import CarouselDatatable from "@/components/Datatables/Carousel/carousel";
import PublishDatatable from "@/components/Datatables/Carousel/publish";
import PageHeader from "@/components/Pages/PageHeader";
import { getPath } from "@/configs/route";
import { Grid, Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { PreviewCarousel } from "./components/PreviewCarousel";

const CarouselPage = () => {
  const __ = useTranslations("Carousel.main");

  return (
    <div>
      <Grid gutter={0}>
        <Grid.Col span={12}>
          <PageHeader title={__("title")}>
            <AddButtonLink href={getPath("website.carousel.create")}>
              {__("add-btn")}
            </AddButtonLink>
          </PageHeader>
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
