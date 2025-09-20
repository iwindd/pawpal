"use client";
import LoginModal from "@/components/Modals/Auth/LoginModal";
import RegisterModal from "@/components/Modals/Auth/RegisterModal";
import { Button, Group } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";

const AuthSection = () => {
  const __ = useTranslations("Navbar.auth");
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  const handleLoginClick = () => setModalType("login");
  const handleRegisterClick = () => setModalType("register");
  const handleCloseModal = () => setModalType(null);

  const isRegisterModalOpen = modalType === "register";
  const isLoginModalOpen = modalType === "login";

  const switchModal = () => {
    setModalType((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <Group gap={"sm"}>
      <Button variant="outline" onClick={handleLoginClick}>
        {__("login-btn")}
      </Button>
      <Button onClick={handleRegisterClick} visibleFrom="sm">
        {__("register-btn")}
      </Button>
      <LoginModal
        opened={isLoginModalOpen}
        onClose={handleCloseModal}
        onSwitch={switchModal}
      />
      <RegisterModal
        opened={isRegisterModalOpen}
        onClose={handleCloseModal}
        onSwitch={switchModal}
      />
    </Group>
  );
};

export default AuthSection;
