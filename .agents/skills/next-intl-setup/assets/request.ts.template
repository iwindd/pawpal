import locales from "@/configs/locales";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get("locale")?.value || process.env.DEFAULT_LOCALE || "th";

  const validLocale = locale && locales.find((loc) => loc.value === locale);
  if (!validLocale) locale = process.env.DEFAULT_LOCALE || "th";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats: {
      number: {
        currency: {
          style: "currency",
          currency: "THB",
          currencyDisplay: "narrowSymbol",
        },
        amount: {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        },
        count: {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        },
      },
      dateTime: {
        date: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
        dateTime: {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      },
    },
  };
});
