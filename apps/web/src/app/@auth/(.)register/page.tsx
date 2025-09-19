"use client";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { RegisterProps, useAuth } from "@/contexts/AuthContext";
import { Modal, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import modalClasses from "../modal.module.css";

export default function RegisterModal() {
  const router = useRouter();
  const { register } = useAuth();
  const __ = useTranslations("Auth.register");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (inputs: RegisterProps["inputs"]) => {
    try {
      await register({ inputs });
      handleClose();
    } catch (error) {
      console.error("Registration failed:", error);
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
        <RegisterForm onRegister={handleSubmit} isLoading={loading} />
      </Stack>
    </Modal>
  );
}
