import ResourceImage from "@/components/ResourceImage";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import classes from "./style.module.css";

interface CardCarouselProps {
  alt: string;
  src: string;
}

const CardCarousel = ({ alt, src }: Readonly<CardCarouselProps>) => {
  const __ = useTranslations("Home.CardCarousel");

  return (
    <Paper shadow="md" p="xl" radius={0} className={classes.card}>
      <div className={classes.imageContainer}>
        <ResourceImage
          alt={alt}
          height={530}
          width={1920}
          className={classes.image}
          preload={true}
          src={src}
          fallbackSrc="/assets/images/fallback-carousel.jpg"
        />
        <div className={classes.overlay} />
      </div>
    </Paper>
  );
};

export default CardCarousel;
