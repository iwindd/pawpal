import { IconPlus } from "@pawpal/icons";
import { ActionIcon, Stack, Text, UnstyledButton } from "@pawpal/ui/core";

interface AddPackageCardButtonProps {
  handleAddPackage: () => void;
  isLoading?: boolean;
  label: string;
}

const AddPackageCardButton = ({
  handleAddPackage,
  isLoading,
  label,
}: AddPackageCardButtonProps) => {
  return (
    <UnstyledButton
      w="100%"
      h="100%"
      mih={150}
      onClick={handleAddPackage}
      disabled={isLoading}
      style={{
        border: "2px dashed var(--mantine-color-default-border)",
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      <Stack align="center" gap="xs">
        <ActionIcon
          size="xl"
          radius="xl"
          variant="light"
          color="secondary"
          style={{ pointerEvents: "none" }}
          component="a"
        >
          <IconPlus size={24} />
        </ActionIcon>
        <Text fw={500} c="secondary">
          {label}
        </Text>
      </Stack>
    </UnstyledButton>
  );
};

export default AddPackageCardButton;
