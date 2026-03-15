"use client";

import { AddButtonLink } from "@/components/Button/AddButton";
import HomeLayoutDatatable from "@/components/Datatables/HomeLayout";
import PageHeader from "@/components/Pages/PageHeader";
import { getPath } from "@/configs/route";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

const HomeLayoutPage = () => {
  const __ = useTranslations("HomeLayout.main");

  return (
    <>
      <PageHeader title={__("title")}>
        <AddButtonLink href={getPath("website.home.create")}>
          {__("add-btn")}
        </AddButtonLink>
      </PageHeader>

      <Paper p={0}>
        <HomeLayoutDatatable />
      </Paper>
    </>
  );
};

export default HomeLayoutPage;
