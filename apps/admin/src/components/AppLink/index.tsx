import { useAppRouter } from "@/hooks/useAppRouter";
import { Anchor, AnchorProps } from "@pawpal/ui/core";
import Link from "next/link";
import { ReactNode } from "react";

const AppLink = (
  props: AnchorProps & { children: ReactNode; href: string },
) => {
  const appRouter = useAppRouter();

  return (
    <Anchor {...props} component={Link} href={appRouter.path(props.href)}>
      {props.children}
    </Anchor>
  );
};

export default AppLink;
