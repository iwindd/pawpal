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
    <Paper className={classes.card}>
      <div className={classes.imageContainer}>
        <ResourceImage
          alt={alt}
          width={1200}
          height={500}
          className={classes.image}
          src={src}
          fallbackSrc="/assets/images/fallback-carousel.jpg"
        />
      </div>
    </Paper>
  );
};

export default CardCarousel;
