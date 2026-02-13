import { MantineThemeComponents } from "@mantine/core";

const Modal = {
  defaultProps: {
    overlayProps: {
      backgroundOpacity: 0.55,
      blur: 6,
    },
  },
} satisfies MantineThemeComponents["Modal"];

export default Modal;
