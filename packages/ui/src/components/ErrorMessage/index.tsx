import { Text, useMantineColorScheme } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ErrorMessageProps {
  message?: string | null;
  align?: "start" | "center" | "end";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabledAutoFormat?: boolean;
  formatGroup?: string;
}

const ErrorMessage = ({
  message,
  align = "center",
  size = "sm",
  disabledAutoFormat = false,
  formatGroup = "",
}: ErrorMessageProps) => {
  const { colorScheme } = useMantineColorScheme();
  const __ = useTranslations();
  if (!message) return null;

  const formattedMessage = formatGroup ? `${formatGroup}.${message}` : message;

  return (
    <Text size={size} ta={align} c={colorScheme === "dark" ? "red.8" : "red.6"}>
      {disabledAutoFormat ? message : __(formattedMessage)}
    </Text>
  );
};

export default ErrorMessage;
