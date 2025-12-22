"use client";

import { Colorization } from "@/libs/colorization";
import { Util } from "@/libs/utils";
import { Text } from "@pawpal/ui/core";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  date: Date | string;
  successAfter?: number;
  warningAfter?: number;
  errorAfter?: number;
};

export function RelativeTime({
  date,
  successAfter = 1,
  warningAfter = 3 * 60,
  errorAfter = 4 * 60,
}: Readonly<Props>) {
  const locale = useLocale();
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((v) => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text
      size="sm"
      c={Colorization.relativeTime(targetDate, {
        successAfter,
        warningAfter,
        errorAfter,
      })}
    >
      {Util.getRelativeTime(targetDate, locale)}
    </Text>
  );
}
