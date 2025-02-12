"use client";

import { useLocale } from "@/hooks/locale-context";

export const Timestamp = ({
  timestamp,
  showTime = true,
}: {
  timestamp: string | null;
  showTime?: boolean;
}) => {
  const locale = useLocale();
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const dateTime = date.toISOString();
  const formattedDateTime = date.toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: showTime ? "short" : undefined,
  });
  return <time dateTime={dateTime}>{formattedDateTime}</time>;
};
