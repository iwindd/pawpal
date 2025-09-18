import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import Image from "next/image";
import Link from "next/link";
import classes from "./style.module.css";

interface CardCarouselProps {
  image: string;
  category: string | null;
  title: string;
  href: string | null;
}

const CardCarousel = ({
  image,
  category,
  title,
  href,
}: Readonly<CardCarouselProps>) => {
  return (
    <Paper shadow="md" p="xl" radius={0} className={classes.card}>
      <div className={classes.imageContainer}>
        <Image
          src={`/assets/images/${image}`}
          alt={`${category}-${title}`}
          fill
          className={classes.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
          unoptimized
        />
        <div className={classes.overlay} />
      </div>
      <Group className={classes.content}>
        <Box style={{ width: "100%" }}>
          <Grid p={0} w="100%">
            <Grid.Col span={10}>
              <Stack gap={0}>
                <Text className={classes.category} size="xs">
                  {category}
                </Text>
                <Title order={3} className={classes.title}>
                  {title}
                </Title>
              </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
              {href && (
                <Group justify="flex-end" align="flex-end" h="100%">
                  <Box>
                    <Button
                      component={Link}
                      variant="priamry"
                      className={classes.button}
                      href={href}
                    >
                      เติมทันที
                    </Button>
                  </Box>
                </Group>
              )}
            </Grid.Col>
          </Grid>
        </Box>
      </Group>
    </Paper>
  );
};

export default CardCarousel;
