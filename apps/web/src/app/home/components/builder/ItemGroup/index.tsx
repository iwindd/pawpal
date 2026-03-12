"use client";

import ResourceImage from "@/components/ResourceImage";
import { Anchor, Box, Card, Grid, Group, Text, Title } from "@pawpal/ui/core";
import Link from "next/link";
import classes from "./style.module.css";

export type ItemGroupItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string | null;
  image_url?: string;
};

interface ItemGroupProps {
  items: ItemGroupItem[];
}

const ItemGroup = ({ items }: ItemGroupProps) => {
  const renderCardContent = (item: ItemGroupItem) => (
    <Card className={classes.item}>
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" gap={"lg"}>
          <Box h={64} w={64} style={{ overflow: "hidden" }}>
            <ResourceImage
              src={item.image_url || ""}
              alt={item.title}
              height={64}
              width={64}
            />
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
  );

  return (
    <Grid>
      {items.map((item) => (
        <Grid.Col key={item.id} span={{ xs: 12, md: 6, lg: 3 }}>
          {item.href ? (
            //TODO: Implement render the actual link
            <Anchor component={Link} href={"#"} underline="never">
              {renderCardContent(item)}
            </Anchor>
          ) : (
            renderCardContent(item)
          )}
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default ItemGroup;
