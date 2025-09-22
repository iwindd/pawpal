import { Text, useMantineColorScheme } from "@pawpal/ui/core";

const ErrorMessage = ({ message }: { message?: string | null }) => {
  const { colorScheme } = useMantineColorScheme();
  if (!message) return null;

  return (
    <Text size="sm" ta="center" c={colorScheme === "dark" ? "red.8" : "red.6"}>
      {message}
    </Text>
  );
};

export default ErrorMessage;
