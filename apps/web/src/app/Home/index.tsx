import AppCarousel from "@/components/AppCarousel";
import { BuilderLoader, loadBuilderProducts } from "@/configs/home";
import APISession from "@/libs/api/server";
import { ENUM_HOME_SECTION_TYPE } from "@pawpal/shared";
import { Center, Container, Stack } from "@pawpal/ui/core";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import ItemGroup from "./components/builder/ItemGroup";
import ItemGroupSkeleton from "./components/builder/ItemGroup/skeleton";
import ItemSlider from "./components/builder/ItemSlider";
import ItemSliderSkeleton from "./components/builder/ItemSlider/skeleton";
import ShowMore from "./components/showMore";

async function ItemSliderLoader({
  title,
  loader,
}: Readonly<{
  title: string;
  loader: BuilderLoader;
}>) {
  const API = await APISession();
  const items = await loadBuilderProducts(API, loader);

  return <ItemSlider title={title} items={items} />;
}

export default async function HomePage() {
  const __ = await getTranslations("Home");
  const API = await APISession();
  const [homeLayout, carousels] = await Promise.all([
    API.homeLayout.getPublished(),
    API.carousel.getPublished(),
  ]);

  return (
    <Container size="xl" my="lg">
      <AppCarousel carousels={carousels} />

      <Stack gap="xl" py="lg">
        {homeLayout.sections.map((section: any) => {
          if (section.type === ENUM_HOME_SECTION_TYPE.ITEM_GROUP) {
            const items = section.config?.items || [];
            return (
              <Suspense
                fallback={<ItemGroupSkeleton />}
                key={`item-group-${section.id}`}
              >
                <ItemGroup items={items} />
              </Suspense>
            );
          }

          if (section.type === ENUM_HOME_SECTION_TYPE.ITEM_SLIDER) {
            const loader = section.config?.loader;
            if (!loader) return null;
            return (
              <Suspense
                fallback={<ItemSliderSkeleton />}
                key={`item-slider-${section.id}`}
              >
                <ItemSliderLoader title={section.title} loader={loader} />
              </Suspense>
            );
          }

          return null;
        })}
      </Stack>
      <Center mt="lg">
        <ShowMore />
      </Center>
    </Container>
  );
}
