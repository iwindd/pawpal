export enum ENUM_HOME_LAYOUT_STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export type HomeLayoutStatus =
  (typeof ENUM_HOME_LAYOUT_STATUS)[keyof typeof ENUM_HOME_LAYOUT_STATUS];

export enum ENUM_HOME_SECTION_TYPE {
  ITEM_GROUP = "ITEM_GROUP",
  ITEM_SLIDER = "ITEM_SLIDER",
}

export type HomeSectionType =
  (typeof ENUM_HOME_SECTION_TYPE)[keyof typeof ENUM_HOME_SECTION_TYPE];

export enum ENUM_HOME_SECTION_LOADER_TYPE {
  system = "system",
  tag = "tag",
  category = "category",
}

export type HomeSectionLoaderType =
  (typeof ENUM_HOME_SECTION_LOADER_TYPE)[keyof typeof ENUM_HOME_SECTION_LOADER_TYPE];

export enum ENUM_HOME_SECTION_SYSTEM_LOADER_NAME {
  popular = "popular",
  newest = "newest",
  latest = "latest",
  favorite = "favorite",
  promotion = "promotion",
}

export type HomeSectionSystemLoaderName =
  (typeof ENUM_HOME_SECTION_SYSTEM_LOADER_NAME)[keyof typeof ENUM_HOME_SECTION_SYSTEM_LOADER_NAME];
