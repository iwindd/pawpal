"use client";
import LinkSelector from "@/components/Inputs/LinkSelector";
import ResourceInput from "@/components/Inputs/ResourceInput";
import { HomeLayoutInput } from "@pawpal/shared";
import { Box, Grid, Group, Input, Stack, TextInput } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface GroupSectionConfigProps {
  index: number;
  item: any;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function GroupSectionConfig({
  index,
  item,
  form,
}: Readonly<GroupSectionConfigProps>) {
  const t = useTranslations("HomeLayout.form");

  return (
    <Box mt="md">
      <Grid>
        {item.config?.items?.map((sub: any, sIndex: number) => {
          const imageError =
            form.errors[`sections.${index}.config.items.${sIndex}.resource_id`];

          return (
            <Grid.Col span={{ base: 12, lg: 6 }} key={sub.id}>
              <Group align="flex-start">
                <Box>
                  <ResourceInput
                    w="128"
                    h="128"
                    {...form.getInputProps(
                      `sections.${index}.config.items.${sIndex}.resource_id`,
                    )}
                    error=""
                  />
                </Box>
                <Stack gap={"xs"} flex={1}>
                  <TextInput
                    placeholder={t("item-title")}
                    withAsterisk
                    {...form.getInputProps(
                      `sections.${index}.config.items.${sIndex}.title`,
                    )}
                  />
                  <TextInput
                    placeholder={t("item-subtitle")}
                    withAsterisk
                    {...form.getInputProps(
                      `sections.${index}.config.items.${sIndex}.subtitle`,
                    )}
                  />
                  <Box>
                    <LinkSelector
                      {...form.getInputProps(
                        `sections.${index}.config.items.${sIndex}.href`,
                      )}
                    />
                  </Box>
                </Stack>
              </Group>

              {imageError && <Input.Error>{imageError}</Input.Error>}
            </Grid.Col>
          );
        })}
      </Grid>
    </Box>
  );
}
