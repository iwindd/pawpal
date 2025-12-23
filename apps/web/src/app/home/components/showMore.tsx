"use client";
import { Button } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

const ShowMore = () => {
  const __ = useTranslations("Home");
  return (
    <Button variant="subtle" component={Link} href={"/products"}>
      {__("showMore")}
    </Button>
  );
};

export default ShowMore;
