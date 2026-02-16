import { Button as BaseButton } from "@mantine/core";

const Button = BaseButton.extend({
  styles: {
    label: {
      fontWeight: 500,
    },
  },
});

export default Button;
