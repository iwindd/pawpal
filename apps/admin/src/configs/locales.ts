interface Locale {
  label: string;
  shortName: string;
  value: string;
}

const locales: Locale[] = [
  {
    label: "ภาษาไทย",
    shortName: "TH",
    value: "th",
  },
  // I don't want to support English for now
  // {
  //   label: "English",
  //   shortName: "EN",
  //   value: "en",
  // },
];

export type LocaleValue = (typeof locales)[number]["value"];
export default locales;
