import Carousel from "@/components/Carousel";
import NewProductRow from "@/components/Row/NewProductRow";
import SaleProductRow from "@/components/Row/SaleProductRow";
import APISession from "@/libs/api/server";
import { Center, Container, Stack } from "@pawpal/ui/core";
import { getTranslations } from "next-intl/server";
import ShowMore from "./components/showMore";

export default async function HomePage() {
  const __ = await getTranslations("Home");
  const API = await APISession();
  const carouselResponse = await API.carousel.findAll();
  const carousels = carouselResponse.success ? carouselResponse.data : [];

  return (
    <>
      <Carousel carousels={carousels} />
      <Container size="xl" my="lg">
        <Stack gap="xl">
          <SaleProductRow />
          <NewProductRow />
        </Stack>
        <Center mt="lg">
          <ShowMore />
        </Center>
      </Container>
    </>
  );
}
