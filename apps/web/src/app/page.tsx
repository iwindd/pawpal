import { useTranslations } from "next-intl";

export default function Home() {
  const __ = useTranslations("Home");

  return <div>{__("title")}</div>;
}
