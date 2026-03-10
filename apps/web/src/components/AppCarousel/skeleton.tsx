import { Group, Skeleton } from "@pawpal/ui/core";

const AppCarouselLoading = () => {
  return (
    <Group gap={"lg"}>
      <Skeleton height={400} flex={1} opacity={40}></Skeleton>
      <Skeleton height={400} width={"70%"}></Skeleton>
      <Skeleton height={400} flex={1} opacity={40}></Skeleton>
    </Group>
  );
};

export default AppCarouselLoading;
