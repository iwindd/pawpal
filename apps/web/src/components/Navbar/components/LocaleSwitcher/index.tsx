import FlagImage from "@/components/Flags";
import locales, { LocaleValue } from "@/configs/locales";
import { setLocaleCookie } from "@/server/actions/cookies/locale";
import { IconCheck, IconLanguage } from "@pawpal/icons";
import { ActionIcon, Menu } from "@pawpal/ui/core";
import { useLocale } from "next-intl";
import { useState } from "react";

const LocaleSwitcher = () => {
  const currentLocale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = async (value: LocaleValue) => {
    try {
      setIsLoading(true);
      await setLocaleCookie(value);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Menu
      width={180}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      withinPortal
      disabled={isLoading}
    >
      <Menu.Target>
        <ActionIcon autoContrast size={42} variant="transparent">
          <IconLanguage size={24} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {locales.map((locale) => (
          <Menu.Item
            key={locale.value}
            onClick={() => setLocale(locale.value)}
            leftSection={<FlagImage value={locale.value} size={24} />}
            rightSection={
              locale.value === currentLocale ? <IconCheck size={16} /> : null
            }
          >
            {locale.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LocaleSwitcher;
