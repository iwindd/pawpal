import APISession from "@/libs/api/server";
import { getTranslations } from "next-intl/server";

export default async function HomeLayoutEditPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const API = await APISession();
  const __ = await getTranslations("HomeLayout");
  const homeLayout = await API.homeLayout.getHomeLayout(id);

  /* TODO:: Implement view */
  return <p>DO SOMETHING</p>;
}
