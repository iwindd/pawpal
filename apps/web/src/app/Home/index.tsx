import Carousel from "@/components/Carousel";
import { BuilderLoader, loadBuilderProducts } from "@/configs/home";
import APISession from "@/libs/api/server";
import { Center, Container, Stack } from "@pawpal/ui/core";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import ItemGroup, { ItemGroupItem } from "./components/builder/ItemGroup";
import ItemGroupSkeleton from "./components/builder/ItemGroup/skeleton";
import ItemSlider from "./components/builder/ItemSlider";
import ItemSliderSkeleton from "./components/builder/ItemSlider/skeleton";
import ShowMore from "./components/showMore";

type LayoutBuilderComponent = {
  id: string;
} & (
  | { type: "item-group"; items: ItemGroupItem[] }
  | {
      type: "item-slider";
      title: string;
      loader: BuilderLoader;
    }
);

export const AppBuilderData: LayoutBuilderComponent[] = [
  {
    id: "1",
    type: "item-group",
    items: [
      {
        id: "1",
        title: "เกม PC",
        subtitle: "4,500 สินค้า",
        href: "/products/tags/pc",
        image: "",
      },
      {
        id: "2",
        title: "เกม Mobile",
        subtitle: "1,200 สินค้า",
        href: "/products/tags/mobile",
        image: "",
      },
      {
        id: "3",
        title: "Streaming",
        subtitle: "บริการสตรีมมิ่ง",
        href: "/products/categories/streaming",
        image: "",
      },
      {
        id: "4",
        title: "บัตรเติมเงิน",
        subtitle: "บัตรเติมเงิน",
        href: "/products/tags/card",
        image: "",
      },
    ],
  },
  {
    id: "2",
    type: "item-slider",
    title: "สินค้าลดราคา",
    loader: { type: "system", name: "sale" },
  },
  {
    id: "3",
    type: "item-slider",
    title: "สินค้าใหม่",
    loader: { type: "system", name: "new" },
  },
  {
    id: "4",
    type: "item-slider",
    title: "เกม FPS",
    loader: { type: "tag", name: "fps" },
  },
  {
    id: "5",
    type: "item-slider",
    title: "สตรีมมิ่ง",
    loader: { type: "category", name: "streaming" },
  },
];

async function ItemSliderLoader({
  title,
  loader,
}: {
  title: string;
  loader: BuilderLoader;
}) {
  const API = await APISession();
  const items = await loadBuilderProducts(API, loader);

  return <ItemSlider title={title} items={items} />;
}

export default async function HomePage() {
  const __ = await getTranslations("Home");
  const API = await APISession();
  const carouselResponse = await API.carousel.findAll();
  const carousels = carouselResponse.success ? carouselResponse.data : [];

  return (
    <Container size="xl" my="lg">
      <Carousel carousels={carousels} />
      <Stack gap="xl" py="lg">
        {AppBuilderData.map((item) => {
          if (item.type === "item-group") {
            return (
              <Suspense
                fallback={<ItemGroupSkeleton />}
                key={`item-group-${item.id}`}
              >
                <ItemGroup items={item.items} />
              </Suspense>
            );
          }

          if (item.type === "item-slider") {
            return (
              <Suspense
                fallback={<ItemSliderSkeleton />}
                key={`item-slider-${item.id}`}
              >
                <ItemSliderLoader title={item.title} loader={item.loader} />
              </Suspense>
            );
          }
        })}
      </Stack>
      <Center mt="lg">
        <ShowMore />
      </Center>
    </Container>
  );
}
