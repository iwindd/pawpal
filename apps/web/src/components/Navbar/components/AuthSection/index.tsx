"use client";
import { Button, Group } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const AuthSection = () => {
  const __ = useTranslations("Navbar.auth");
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    if (pathname === "/login") return;
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <Group gap={"sm"}>
      <Button variant="outline" onClick={handleLoginClick}>
        {__("login-btn")}
      </Button>
      <Button onClick={handleRegisterClick}>{__("register-btn")}</Button>
    </Group>
  );
};

export default AuthSection;
