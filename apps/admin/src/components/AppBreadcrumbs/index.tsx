import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Anchor, Breadcrumbs, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BreadcrumbLink extends AnchorProps {
  route: Route;
  isActive?: boolean;
}

const BreadcrumbLink = ({
  route,
  isActive = false,
  ...props
}: BreadcrumbLink) => {
  const __ = useTranslations("Navbar.links");

  return (
    <Text
      component={!isActive && !route.disabled ? Link : undefined}
      href={!route.disabled ? route.path : undefined}
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
            key={route.id + index}
            route={route}
            isActive={isLast}
          />
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;
