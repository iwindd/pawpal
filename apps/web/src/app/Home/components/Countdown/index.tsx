"use client";
import { Badge } from "@pawpal/ui/core";
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

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

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

  return (
    <Badge color="red" size="lg" variant="filled">
      {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
      {countdown.seconds}s
    </Badge>
  );
};

export default Countdown;
