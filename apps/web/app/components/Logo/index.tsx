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
        backgroundColor: "gray",
      }}
    >
      {width}x{height}
    </div>
  );
};

export default Logo;
