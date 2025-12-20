export const ENUM_RESOURCE_TYPE = {
  RESOURCE_IMAGE: "RESOURCE_IMAGE",
  PRODUCT_IMAGE: "PRODUCT_IMAGE",
};

export type ResourceType = keyof typeof ENUM_RESOURCE_TYPE;
