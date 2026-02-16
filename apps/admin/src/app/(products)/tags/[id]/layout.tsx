import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import TabNavigation from "./TabNavigation";
import { TagProvider } from "./TagContext";

const TagLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const tag = await API.productTag.findOne(id);

  if (!tag.success) return notFound();

  return (
    <TagProvider defaultValue={tag.data}>
      <PageHeader title={tag.data.name} />
      <TabNavigation />
      {children}
    </TagProvider>
  );
};

export default TagLayout;
