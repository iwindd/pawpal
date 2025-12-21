import { AspectRatio, Paper } from "@pawpal/ui/core";
import classes from "./style.module.css";

export interface OverlayImageProps {
  h?: number | string;
  w?: number | string;
  error?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  image?: React.ReactNode;
  onClick?: () => void;
}

const OverlayImage = ({
  h,
  w,
  error,
  disabled,
  children,
  image,
  onClick,
}: OverlayImageProps) => {
  return (
    <Paper
      radius={"sm"}
      h={h}
      w={w}
      style={{
        overflow: "hidden",
        border: error ? "1px solid var(--mantine-color-error)" : undefined,
        borderColor: error ? "var(--mantine-color-error)" : undefined,
      }}
    >
      <AspectRatio
        h={"100%"}
        mx="auto"
        style={{
          position: "relative",
        }}
      >
        {!disabled && (
          <button type="button" className={classes.overlay} onClick={onClick}>
            {children}
          </button>
        )}

        {image}
      </AspectRatio>
    </Paper>
  );
};

export default OverlayImage;
