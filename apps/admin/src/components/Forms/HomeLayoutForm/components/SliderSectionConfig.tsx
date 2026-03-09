"use client";
import {
  ENUM_HOME_SECTION_LOADER_TYPE,
  HomeLayoutInput,
  HomeSectionLoaderType,
} from "@pawpal/shared";
import { Grid } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import HomeSectionLoaderTypeSelect from "../../../Select/HomeSectionLoaderType";
import CategoryLoaderInput from "./loaders/CategoryLoaderInput";
import SystemLoaderInput from "./loaders/SystemLoaderInput";
import TagLoaderInput from "./loaders/TagLoaderInput";

interface SliderSectionConfigProps {
  index: number;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function SliderSectionConfig({
  index,
  form,
}: Readonly<SliderSectionConfigProps>) {
  const loaderType = form.getValues().sections[index]?.config?.loader?.type;

  const renderLoaderNameInput = () => {
    switch (loaderType) {
      case ENUM_HOME_SECTION_LOADER_TYPE.system:
        return <SystemLoaderInput index={index} form={form} />;
      case ENUM_HOME_SECTION_LOADER_TYPE.category:
        return <CategoryLoaderInput index={index} form={form} />;
      case ENUM_HOME_SECTION_LOADER_TYPE.tag:
      default:
        return <TagLoaderInput index={index} form={form} />;
    }
  };

  return (
    <>
      <Grid.Col span={6}>
        <HomeSectionLoaderTypeSelect
          withAsterisk
          {...form.getInputProps(`sections.${index}.config.loader.type`)}
          onChange={(value) => {
            form.setFieldValue(
              `sections.${index}.config.loader.type`,
              value as HomeSectionLoaderType,
            );
            form.setFieldValue(`sections.${index}.config.loader.name`, "");
          }}
        />
      </Grid.Col>
      <Grid.Col span={6}>{renderLoaderNameInput()}</Grid.Col>
    </>
  );
}
