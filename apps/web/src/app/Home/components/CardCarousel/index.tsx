import { Image, Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import classes from "./style.module.css";

interface CardCarouselProps {
  image: string;
  category: string | null;
  title: string;
  href: string | null;
}

const CardCarousel = ({
  image,
  category,
  title,
  href,
}: Readonly<CardCarouselProps>) => {
  const __ = useTranslations("Home.CardCarousel");

  return (
    <Paper shadow="md" p="xl" radius={0} className={classes.card}>
      <div className={classes.imageContainer}>
        <Image
          component={NextImage}
          alt={`${category}-${title}`}
          fill
          className={classes.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
          unoptimized
          src={`/assets/images/carousel/${image}`}
          fallbackSrc="/assets/images/fallback-carousel.jpg"
        />
        <div className={classes.overlay} />
      </div>
    </Paper>
  );
};

export default CardCarousel;
