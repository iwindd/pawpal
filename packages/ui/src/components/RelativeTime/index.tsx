import { useFormatter, useNow } from "next-intl";

const RelativeTime = ({ date, now }: { date: Date; now?: Date }) => {
  now = now ?? useNow();
  const f = useFormatter();

  return <>{f.relativeTime(date, now)}</>;
};

export default RelativeTime;
