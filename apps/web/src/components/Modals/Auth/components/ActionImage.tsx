import { ActionIcon, ActionIconProps, Box, Image } from "@pawpal/ui/core";
import NextImage from "next/image";

interface ActionImageProps extends ActionIconProps {
  iconName: string;
  label: string;
}

const ActionImage = ({ iconName, label, ...props }: ActionImageProps) => {
  return (
    <ActionIcon size={"lg"} variant="default" {...props}>
      <Box w="70%" h="70%" style={{ position: "relative" }}>
        <Image
          component={NextImage}
          src={`/assets/images/icons/${iconName}.png`}
          alt={label}
          fill
        />
      </Box>
    </ActionIcon>
  );
};

export default ActionImage;
