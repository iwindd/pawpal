import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { CategoryProvider } from "./CategoryContext";
import TabNavigation from "./TabNavigation";

const CategoryLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const category = await API.category.findOne(id);

  if (!category.success) return notFound();

  return (
    <CategoryProvider defaultValue={category.data}>
      <PageHeader title={category.data.name} />
      <TabNavigation />
      {children}
    </CategoryProvider>
  );
};

export default CategoryLayout;
