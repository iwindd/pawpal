import { NavLink, navlinks, othersNavlinks } from "@/configs/navbar";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { IconMinus, IconPlus } from "@pawpal/icons";
import {
  Badge,
  Burger,
  Collapse,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import classes from "./style.module.css";

interface Props {
  opened: boolean;
  toggle: () => void;
}

export default function Navbar({ opened, toggle }: Readonly<Props>) {
  const activeRoute = useActiveRouteConfig();

  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Group gap={8} w="100%" align="center">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text className={classes.teams}>PawPal</Text>
      </Group>

      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          {navlinks.map((navlink) => {
            const path =
              typeof navlink.link === "string" ? navlink.link : navlink.link();
            const isActive = activeRoute?.path === path;

            return navlink.files.length > 0 ? (
              <Folder key={navlink.id} {...navlink} />
            ) : (
              <Flex w="100%" direction="column" align="start" key={navlink.id}>
                <LinkItem {...navlink} link={path} isActive={isActive} />
                {navlink.hasBorderBottom && <Divider my={10} w="100%" />}
              </Flex>
            );
          })}
        </Flex>
      </ScrollArea>

      <Flex w="100%" direction="column" align="start" gap={6}>
        {othersNavlinks.map((otherLink) => (
          <LinkItem
            key={otherLink.id}
            {...otherLink}
            isActive={false}
            link={otherLink.link as string}
          />
        ))}
      </Flex>
    </Stack>
  );
}

const LinkItem = ({
  title,
  icon: Icon,
  link,
  isActive,
}: {
  title: string;
  icon: React.ComponentType<any>;
  link: string;
  isActive: boolean;
}) => {
  const __ = useTranslations("Navbar.links");

  return (
    <Link data-active={isActive} className={classes.navlink} href={link}>
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {__(title)}
      </Text>
    </Link>
  );
};

const Folder = ({ title, icon: Icon, files }: NavLink) => {
  const [opened, { toggle }] = useDisclosure(true);
  const __ = useTranslations("Navbar.links");
  const format = useFormatter();

  return (
    <Flex direction="column" align="start" w="100%">
      <UnstyledButton
        h={36.15}
        style={{
          justifyContent: "space-between",
        }}
        w="100%"
        className={classes.navlink}
        onClick={toggle}
        p={8}
      >
        <Flex align="center" gap={10}>
          <Icon size={20} />
          <Text className={classes.title} lts={-0.5}>
            {__(title)}
          </Text>
        </Flex>
        {opened && <IconMinus size={17} />}
        {!opened && <IconPlus size={17} />}
      </UnstyledButton>
      <Collapse w="100%" pl={30} in={opened}>
        <Flex w="100%" py={14} direction="column" align="start" gap={10}>
          {files.map((file) => (
            <Link key={file.id} className={classes.subNavLink} href={file.link}>
              <Text lts={-0.5}>{__(file.name)}</Text>
              <Badge radius={6} className={classes.noti} px={6}>
                {format.number(file.noti)}
              </Badge>
            </Link>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};
