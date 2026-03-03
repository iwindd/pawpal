"use client";
import AppCarouselSkeleton from "@/components/Carousel/skeleton";
import { Container, Stack } from "@pawpal/ui/core";
import ItemGroupSkeleton from "./components/builder/ItemGroup/skeleton";
import ItemSliderSkeleton from "./components/builder/ItemSlider/skeleton";

const HomeLoadingPage = () => {
  return (
    <Container size="xl" my="lg">
      <AppCarouselSkeleton />
      <Stack gap="xl" py="lg">
        <ItemGroupSkeleton />
        <ItemSliderSkeleton />
        <ItemSliderSkeleton />
        <ItemSliderSkeleton />
      </Stack>
    </Container>
  );
};

export default HomeLoadingPage;
