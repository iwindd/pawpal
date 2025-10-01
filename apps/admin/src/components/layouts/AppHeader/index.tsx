import { useAuth } from "@/contexts/AuthContext";
import { Burger, Flex, Group } from "@pawpal/ui/core";
import dynamic from "next/dynamic";
import LocaleSwitcher from "./components/LocaleSwitcher";
import UserMenu from "./components/UserMenu";

interface Props {
  opened: boolean;
  toggle: () => void;
}

const ThemeSwitcher = dynamic(() => import("./components/ThemeSwitcher"), {
  ssr: false,
});

export default function AppHeader({ opened, toggle }: Readonly<Props>) {
  const { user } = useAuth();
  return (
    <Group h="100%" px="lg" justify="space-between">
      <Flex align="center" gap={16}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Flex>

      <Flex align="center" gap={24}>
        <LocaleSwitcher />
        <ThemeSwitcher />
        {user && <UserMenu user={user} />}
      </Flex>
    </Group>
  );
}
