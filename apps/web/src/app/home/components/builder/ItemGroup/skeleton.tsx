"use client";
import { Card, Grid, Group, Skeleton } from "@pawpal/ui/core";

const ItemGroupSkeleton = () => {
  return (
    <Grid>
      {[1, 2, 3, 4].map((item) => (
        <Grid.Col key={item} span={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <Card.Section inheritPadding py="sm">
              <Group justify="space-between" gap={"lg"}>
                <Skeleton h={64} w={64} circle />
                <Group flex={1}>
                  <div>
                    <Skeleton h={20} w={100} mb={"xs"} />
                    <Skeleton h={10} w={200} />
                  </div>
                </Group>
              </Group>
            </Card.Section>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default ItemGroupSkeleton;
