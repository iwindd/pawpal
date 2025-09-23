"use client";
import { getSectionIcon } from "@/utils/productUtils";
import { Badge } from "@pawpal/ui/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  endTime: string;
}

const Countdown = ({ endTime }: CountdownProps) => {
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const icon = getSectionIcon("flashsale");
  const __ = useTranslations("Time");

  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      const end = dayjs(endTime);
      const difference = end.diff(now);

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!countdown) return null;

  let displayTime = "";
  const translatedTime = {
    days: __("short.days"),
    hours: __("short.hours"),
    minutes: __("short.minutes"),
    seconds: __("short.seconds"),
  };

  if (countdown.days > 0) {
    displayTime = `${countdown.days} ${translatedTime.days} ${countdown.hours} ${translatedTime.hours}`;
  } else if (countdown.hours > 0) {
    displayTime = `${countdown.hours} ${translatedTime.hours} ${countdown.minutes} ${translatedTime.minutes}`;
  } else if (countdown.minutes > 0) {
    displayTime = `${countdown.minutes} ${translatedTime.minutes} ${countdown.seconds} ${translatedTime.seconds}`;
  } else {
    displayTime = `${countdown.seconds} ${translatedTime.seconds}`;
  }

  return (
    <Badge color="red" size="lg" variant="filled" leftSection={icon}>
      {displayTime}
    </Badge>
  );
};

export default Countdown;
