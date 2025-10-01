import { IconDashboard, IconHome, IconMinus, IconPlus } from "@pawpal/icons";
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
import Link from "next/link";
import classes from "./style.module.css";

interface Props {
  opened: boolean;
  toggle: () => void;
}

export default function Navbar({ opened, toggle }: Readonly<Props>) {
  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Group gap={8} w="100%" align="center">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text className={classes.teams}>PawPal</Text>
      </Group>

      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          {navlinks.map((navlink) => {
            return navlink.files.length > 0 ? (
              <Folder key={navlink.id} {...navlink} />
            ) : (
              <Flex w="100%" direction="column" align="start" key={navlink.id}>
                <NavLink {...navlink} />
                {navlink.hasBorderBottom && <Divider my={10} w="100%" />}
              </Flex>
            );
          })}
        </Flex>
      </ScrollArea>

      <Flex w="100%" direction="column" align="start" gap={6}>
        {others.map((otherLink) => (
          <NavLink key={otherLink.id} {...otherLink} />
        ))}
      </Flex>
    </Stack>
  );
}

const NavLink = ({ title, icon: Icon, link }: NavLink) => {
  return (
    <Link data-active={false} className={classes.navlink} href={link}>
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {title}
      </Text>
    </Link>
  );
};

const Folder = ({ title, icon: Icon, files }: NavLink) => {
  const [opened, { toggle }] = useDisclosure(true);
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
            {title}
          </Text>
        </Flex>
        {opened && <IconMinus size={17} />}
        {!opened && <IconPlus size={17} />}
      </UnstyledButton>
      <Collapse w="100%" pl={30} in={opened}>
        <Flex w="100%" py={14} direction="column" align="start" gap={10}>
          {files.map((file) => (
            <Link key={file.id} className={classes.subNavLink} href={file.link}>
              <Text lts={-0.5}>{file.name}</Text>
              <Badge radius={6} className={classes.noti} px={6}>
                {file.noti}
              </Badge>
            </Link>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};

interface NavLink {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  link: string;
  files: {
    id: number;
    name: string;
    link: string;
    noti: number;
  }[];
  hasBorderBottom?: boolean;
}

const navlinks: NavLink[] = [
  {
    id: 1,
    icon: IconDashboard,
    title: "ภาพรวม",
    link: "/",
    files: [],
    hasBorderBottom: true,
  },
  {
    id: 3,
    icon: IconHome,
    title: "งานหลัก",
    link: "/",
    files: [
      {
        id: 1,
        name: "คำสั่งซื้อ",
        link: "/",
        noti: 48,
      },
      {
        id: 2,
        name: "เติมเงิน",
        link: "/",
        noti: 6,
      },
    ],
  },
];

const others: NavLink[] = [
  {
    id: 11,
    title: "Fanpage",
    link: "/",
    files: [],
    icon: IconHome,
  },
];
