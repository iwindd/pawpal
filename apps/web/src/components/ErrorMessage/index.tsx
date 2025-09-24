import { Text, useMantineColorScheme } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ErrorMessageProps {
  message?: string | null;
  align?: "start" | "center" | "end";
}

const ErrorMessage = ({ message, align = "center" }: ErrorMessageProps) => {
  const { colorScheme } = useMantineColorScheme();
  const __ = useTranslations();
  if (!message) return null;

  return (
    <Text size="sm" ta={align} c={colorScheme === "dark" ? "red.8" : "red.6"}>
      {__(message)}
    </Text>
  );
};

export default ErrorMessage;
