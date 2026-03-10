import { z } from "zod";
import {
  ENUM_HOME_LAYOUT_STATUS,
  ENUM_HOME_SECTION_LOADER_TYPE,
  ENUM_HOME_SECTION_SYSTEM_LOADER_NAME,
  ENUM_HOME_SECTION_TYPE,
} from "../../enums/home-layout";

const itemGroupItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "title_required" }),
  subtitle: z.string().min(1, { message: "subtitle_required" }),
  href: z.string().min(1, { message: "href_required" }),
  resource_id: z.string().min(1, { message: "image_required" }),
  image_url: z.string().optional(),
});

const loaderSystemSchema = z.object({
  type: z.literal(ENUM_HOME_SECTION_LOADER_TYPE.system),
  name: z.nativeEnum(ENUM_HOME_SECTION_SYSTEM_LOADER_NAME, {
    message: "invalid_system_loader_name",
  }),
});

const loaderTagSchema = z.object({
  type: z.literal(ENUM_HOME_SECTION_LOADER_TYPE.tag),
  name: z.string().min(1, { message: "loader_tag_required" }),
});

const loaderCategorySchema = z.object({
  type: z.literal(ENUM_HOME_SECTION_LOADER_TYPE.category),
  name: z.string().min(1, { message: "category_required" }),
});

const baseSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
});

const baseSectionGroupSchema = z.object({
  id: z.string(),
});

type SectionValidationType =
  | "ITEM_GROUP"
  | "ITEM_SLIDER_SYSTEM"
  | "ITEM_SLIDER_TAG"
  | "ITEM_SLIDER_CATEGORY";

const resolveSectionValidationType = (val: any): SectionValidationType | "" => {
  const { type, config } = val || {};
  if (type === ENUM_HOME_SECTION_TYPE.ITEM_GROUP) return "ITEM_GROUP";

  if (type === ENUM_HOME_SECTION_TYPE.ITEM_SLIDER) {
    const loaderType = config?.loader?.type;
    switch (loaderType) {
      case ENUM_HOME_SECTION_LOADER_TYPE.system:
        return "ITEM_SLIDER_SYSTEM";
      case ENUM_HOME_SECTION_LOADER_TYPE.tag:
        return "ITEM_SLIDER_TAG";
      case ENUM_HOME_SECTION_LOADER_TYPE.category:
        return "ITEM_SLIDER_CATEGORY";
    }
  }

  return "";
};

const sectionItemSchema = z
  .preprocess(
    (val) => {
      if (typeof val === "object" && val !== null) {
        return { ...val, _validationType: resolveSectionValidationType(val) };
      }
      return val;
    },
    z.discriminatedUnion("_validationType", [
      baseSectionGroupSchema.extend({
        _validationType: z.literal("ITEM_GROUP"),
        type: z.literal(ENUM_HOME_SECTION_TYPE.ITEM_GROUP),
        config: z.object({
          items: z
            .array(itemGroupItemSchema)
            .min(4, { message: "items_required_4" })
            .max(4, { message: "items_required_4" }),
        }),
      }),
      baseSectionItemSchema.extend({
        _validationType: z.literal("ITEM_SLIDER_SYSTEM"),
        type: z.literal(ENUM_HOME_SECTION_TYPE.ITEM_SLIDER),
        config: z.object({
          loader: loaderSystemSchema,
        }),
      }),
      baseSectionItemSchema.extend({
        _validationType: z.literal("ITEM_SLIDER_TAG"),
        type: z.literal(ENUM_HOME_SECTION_TYPE.ITEM_SLIDER),
        config: z.object({
          loader: loaderTagSchema,
        }),
      }),
      baseSectionItemSchema.extend({
        _validationType: z.literal("ITEM_SLIDER_CATEGORY"),
        type: z.literal(ENUM_HOME_SECTION_TYPE.ITEM_SLIDER),
        config: z.object({
          loader: loaderCategorySchema,
        }),
      }),
    ]),
  )
  .transform(({ _validationType, ...rest }) => rest as any);

export const homeLayoutSchema = z.object({
  name: z.string().min(1, { message: "name_required" }).trim(),
  status: z.enum([
    ENUM_HOME_LAYOUT_STATUS.DRAFT,
    ENUM_HOME_LAYOUT_STATUS.PUBLISHED,
    ENUM_HOME_LAYOUT_STATUS.ARCHIVED,
  ]),
  sections: z.array(sectionItemSchema),
});

export type HomeLayoutInput = z.infer<typeof homeLayoutSchema>;
export type HomeLayoutSectionItem = z.infer<typeof sectionItemSchema>;
