import HREF from "./HREF"; /* CURSOR: This file is too large , don't read HREF.ts (already ignore) */

interface LogoProps {
  width?: number;
  height?: number;
  size?: number;
}

const Logo = ({ width, height, size }: LogoProps) => {
  width = width || size || 128;
  height = height || size || 128;

  return (
    <div
      style={{
        width: "50%",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width}
        height={height}
        xmlSpace="preserve"
        version="1.1"
        viewBox="0 0 4500 4500"
      >
        <image width="4500" height="4500" xlinkHref={HREF} />
      </svg>
    </div>
  );
};

export default Logo;
