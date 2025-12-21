import { Image, ImageProps as UiImageProps } from "@pawpal/ui/core";
import NextImage, { ImageProps as NextImageProps } from "next/image";

type ResourceImageProps = Omit<UiImageProps, "src" | "alt" | "component"> &
  Omit<NextImageProps, "src" | "alt"> & {
    src: string;
    alt: string;
  };

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

const ResourceImage = ({ src, alt, ...props }: ResourceImageProps) => {
  return (
    <Image
      component={NextImage}
      src={`${STORAGE_URL}/${src}`}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};

export default ResourceImage;
