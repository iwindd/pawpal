import { MantineThemeComponents } from "@mantine/core";

const Modal = {
  defaultProps: {
    overlayProps: {
      backgroundOpacity: 0.55,
      blur: 6,
    },
  },
  styles: {
    title: {
      fontWeight: 500,
      fontSize: "var(--mantine-font-size-sm)",
    },
  },
} satisfies MantineThemeComponents["Modal"];

export default Modal;
