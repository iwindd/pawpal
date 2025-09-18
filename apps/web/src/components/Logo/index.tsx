import Image from "next/image";
interface LogoProps {
  width?: number;
  height?: number;
  size?: number;
  alt?: string;
}

const Logo = ({ width, height, size, alt }: Readonly<LogoProps>) => {
  width = width || size || 128;
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
        src={"/assets/images/logo.png"}
        alt={alt}
        fill
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default Logo;
