"use client";
import LoginForm from "@/app/(auth)/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Modal, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import modalClasses from "../modal.module.css";

export default function LoginModal() {
  const router = useRouter();
  const { login } = useAuth();
  const __ = useTranslations("Auth.login");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const onLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      await login(email, password);
      handleClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={handleClose}
      centered
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape
      trapFocus
      returnFocus
      withinPortal
      zIndex={1000}
      size="md"
      classNames={modalClasses}
      title={
        <Stack gap="xs">
          <Title order={2}>{__("title")}</Title>
          <Text size="sm">{__("subtitle")}</Text>
        </Stack>
      }
    >
      <Stack gap="md">
        <LoginForm onLogin={onLogin} isLoading={loading} />
      </Stack>
    </Modal>
  );
}
