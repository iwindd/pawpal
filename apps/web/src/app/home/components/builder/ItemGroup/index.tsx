"use client";

import { Anchor, Box, Card, Grid, Group, Text, Title } from "@pawpal/ui/core";
import Link from "next/link";
import classes from "./style.module.css";

export type ItemGroupItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

interface ItemGroupProps {
  items: ItemGroupItem[];
}

const ItemGroup = ({ items }: ItemGroupProps) => {
  return (
    <Grid>
      {items.map((item) => (
        <Grid.Col key={item.id} span={{ xs: 12, md: 6, lg: 3 }}>
          <Anchor component={Link} href={item.href} underline="never">
            <Card className={classes.item}>
              <Card.Section inheritPadding py="sm">
                <Group justify="space-between" gap={"lg"}>
                  <Box h={64} w={64} style={{ overflow: "hidden" }}>
                    {/* <ResourceImage
                      src={item.image}
                      alt={item.title}
                      h={64}
                      w={64}
                    /> */}
                  </Box>
                  <Group flex={1}>
                    <div>
                      <Title order={3}>{item.title}</Title>
                      <Text c="dimmed">{item.subtitle}</Text>
                    </div>
                  </Group>
                </Group>
              </Card.Section>
            </Card>
          </Anchor>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default ItemGroup;
