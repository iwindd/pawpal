import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@pawpal/shared";
import { AnchorProps, Breadcrumbs, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BreadcrumbLink extends AnchorProps {
  route: Route & { disabled?: boolean };
  isDisabled?: boolean;
}

const BreadcrumbLink = ({
  route,
  isDisabled = false,
  ...props
}: BreadcrumbLink) => {
  const __ = useTranslations("Navbar.links");
  const activeRoute = useActiveRouteConfig();

  const isActive = route.name == activeRoute?.name;

  return (
    <Text
      component={!isActive && !route.disabled ? Link : undefined}
      href={route.disabled ? "/" : route.path}
      c={isActive ? "pink" : "dimmed"}
      size={"xs"}
      {...props}
    >
      {__(route.label)}
    </Text>
  );
};

interface AppBreadcrumbProps {}

const AppBreadcrumbs = (props: AppBreadcrumbProps) => {
  const activeRouteTrail = useActiveRouteTrail();

  return (
    <Breadcrumbs>
      {activeRouteTrail
        .filter((route) => !route.hiddenBreadcrumb)
        .map((route, index) => {
          return (
            <BreadcrumbLink
              key={route.name + route.path + index}
              route={route}
              isDisabled={route.disabled}
            />
          );
        })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;
