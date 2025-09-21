import { useEffect, useState } from "react";
import { Center, Loader, Overlay, Stack, Text } from "../../core";

interface LoadingEventDetail {
  isLoading: boolean;
  text?: string;
}

export const Backdrop = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleLoading = (event: CustomEvent<LoadingEventDetail>) => {
      setIsLoading(event.detail.isLoading);
      setLoadingText(event.detail.text);
    };

    document.addEventListener("triggerLoading", handleLoading as EventListener);

    return () => {
      document.removeEventListener(
        "triggerLoading",
        handleLoading as EventListener
      );
    };
  });

  if (!isLoading) return null;

  return (
    <Overlay zIndex={1000} fixed backgroundOpacity={0.35} blur={6}>
      <Center h="100vh">
        <Stack align="center">
          <Loader color="white" />
          {loadingText && <Text ta="center">{loadingText}</Text>}
        </Stack>
      </Center>
    </Overlay>
  );
};
