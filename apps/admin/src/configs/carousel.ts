"use client";

import { ENUM_CAROUSEL_STATUS } from "@pawpal/shared";

export const CAROUSEL_STATUS = [
  {
    value: ENUM_CAROUSEL_STATUS.DRAFT,
    icon: null,
    label: "draft",
  },
  {
    value: ENUM_CAROUSEL_STATUS.ARCHIVED,
    icon: null,
    label: "archived",
  },
  {
    value: ENUM_CAROUSEL_STATUS.PUBLISHED,
    icon: null,
    label: "published",
  },
];

export const DEFAULT_CAROUSEL_STATUS = ENUM_CAROUSEL_STATUS.DRAFT;
