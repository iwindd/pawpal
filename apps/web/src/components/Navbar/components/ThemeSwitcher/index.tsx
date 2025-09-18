import { IconThemeDark, IconThemeLight } from "@pawpal/icons";
import { ActionIcon, useMantineColorScheme } from "@pawpal/ui/core";

const ThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const toggleTheme = () => {
    toggleColorScheme();
  };

  return (
    <div>
      <ActionIcon
        autoContrast
        size={42}
        variant="transparent"
        color=""
        onClick={toggleTheme}
      >
        {colorScheme === "light" ? (
          <IconThemeLight size={24} />
        ) : (
          <IconThemeDark size={24} />
        )}
      </ActionIcon>
    </div>
  );
};

export default ThemeSwitcher;
