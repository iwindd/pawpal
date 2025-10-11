"use client";

import { IconArchive, IconDraft, IconPublish } from "@pawpal/icons";
import { CarouselStatus, ENUM_CAROUSEL_STATUS } from "@pawpal/shared";

export const CAROUSEL_STATUS: {
  value: CarouselStatus;
  icon: React.ComponentType<any>;
  label: string;
}[] = [
  {
    value: ENUM_CAROUSEL_STATUS.DRAFT,
    icon: IconDraft,
    label: "draft",
  },
  {
    value: ENUM_CAROUSEL_STATUS.ARCHIVED,
    icon: IconArchive,
    label: "archived",
  },
  {
    value: ENUM_CAROUSEL_STATUS.PUBLISHED,
    icon: IconPublish,
    label: "published",
  },
];

export const DEFAULT_CAROUSEL_STATUS = ENUM_CAROUSEL_STATUS.DRAFT;
