import Image from "next/image";
import LogoImage from "./logo.png";

interface LogoProps {
  width?: number;
  height?: number;
  size?: number;
  alt?: string;
}

const Logo = ({ width, height, size, alt }: Readonly<LogoProps>) => {
  width = width || size || 60;
  height = height || size || 40;
  alt = alt || "Logo";

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      <Image
        src={LogoImage}
        alt={alt}
        fill
        quality={90}
        priority={true}
        loading={"eager"}
        decoding={"async"}
        unoptimized
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default Logo;
