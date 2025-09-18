import { ComponentProps } from "react";

export interface IconProps
  extends Omit<ComponentProps<"svg">, "ref" | "stroke"> {
  size?: number | string;
  stroke?: number | string;
  color?: string;
  className?: string;
}

export type IconComponent = React.ComponentType<IconProps>;
