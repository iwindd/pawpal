"use client";
import { AddButton } from "@/components/Button/AddButton";
import TagDatatable from "@/components/Datatables/Tag";
import CreateTagModal from "@/components/Modals/CreateTagModal";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function TagPage() {
  const [open, { open: openModal, close: closeModal }] = useDisclosure();
  const __ = useTranslations("Tag");

  return (
    <main>
      <PageHeader title={__("main.title")}>
        <AddButton onClick={openModal}>{__("main.add-btn")}</AddButton>
      </PageHeader>

      <Paper p={0}>
        <TagDatatable />
      </Paper>

      <CreateTagModal opened={open} onClose={closeModal} />
    </main>
  );
}
