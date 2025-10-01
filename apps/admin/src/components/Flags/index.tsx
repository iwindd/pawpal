import { LocaleValue } from "@/configs/locales";
import Image from "next/image";

const FlagImage = ({ value, size }: { value: LocaleValue; size: number }) => {
  return (
    <Image
      src={`https://cdn.gtranslate.net/flags/svg/${value}.svg`}
      alt={value}
      width={size}
      height={size}
    />
  );
};

export default FlagImage;
