import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@pawpal/shared";
import { AnchorProps, Breadcrumbs, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BreadcrumbLink extends AnchorProps {
  route: Route & { disabled?: boolean };
  isActive?: boolean;
  isDisabled?: boolean;
}

const BreadcrumbLink = ({
  route,
  isActive = false,
  isDisabled = false,
  ...props
}: BreadcrumbLink) => {
  const __ = useTranslations("Navbar.links");

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
      {activeRouteTrail.map((route, index) => {
        const isLast = index === activeRouteTrail.length - 1;

        return (
          <BreadcrumbLink
            key={route.name + route.path + index}
            route={route}
            isActive={isLast}
            isDisabled={route.disabled}
          />
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;
