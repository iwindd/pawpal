type LocaleMap = Record<string, Record<string, string>>;

interface ReplaceOptions {
  locale?: string;
  replacement?: string;
  remove?: RegExp;
  strict?: boolean;
  trim?: boolean;
  lower?: boolean;
}

const charMap: Record<string, string> = {
  $: "dollar",
  "%": "percent",
  "&": "and",
  "<": "less",
  ">": "greater",
  "|": "or",
  "¢": "cent",
  "£": "pound",
  "¤": "currency",
  "¥": "yen",
  "©": "(c)",
  ª: "a",
  "®": "(r)",
  º: "o",
};

const locales: LocaleMap = {
  bg: {
    Й: "Y",
    Ц: "Ts",
    Щ: "Sht",
    Ъ: "A",
    Ь: "Y",
    й: "y",
    ц: "ts",
    щ: "sht",
    ъ: "a",
    ь: "y",
  },
  de: {
    Ä: "AE",
    ä: "ae",
    Ö: "OE",
    ö: "oe",
    Ü: "UE",
    ü: "ue",
    ß: "ss",
    "%": "prozent",
    "&": "und",
    "|": "oder",
    "∑": "summe",
    "∞": "unendlich",
    "♥": "liebe",
  },
  es: {
    "%": "por ciento",
    "&": "y",
    "<": "menor que",
    ">": "mayor que",
    "|": "o",
    "¢": "centavos",
    "£": "libras",
    "¤": "moneda",
    "₣": "francos",
    "∑": "suma",
    "∞": "infinito",
    "♥": "amor",
  },
  fr: {
    "%": "pourcent",
    "&": "et",
    "<": "plus petit",
    ">": "plus grand",
    "|": "ou",
    "¢": "centime",
    "£": "livre",
    "¤": "devise",
    "₣": "franc",
    "∑": "somme",
    "∞": "infini",
    "♥": "amour",
  },
  pt: {
    "%": "porcento",
    "&": "e",
    "<": "menor",
    ">": "maior",
    "|": "ou",
    "¢": "centavo",
    "∑": "soma",
    "£": "libra",
    "∞": "infinito",
    "♥": "amor",
  },
  uk: {
    И: "Y",
    и: "y",
    Й: "Y",
    й: "y",
    Ц: "Ts",
    ц: "ts",
    Х: "Kh",
    х: "kh",
    Щ: "Shch",
    щ: "shch",
    Г: "H",
    г: "h",
  },
  vi: { Đ: "D", đ: "d" },
  da: {
    Ø: "OE",
    ø: "oe",
    Å: "AA",
    å: "aa",
    "%": "procent",
    "&": "og",
    "|": "eller",
    $: "dollar",
    "<": "mindre end",
    ">": "større end",
  },
  nb: { "&": "og", Å: "AA", Æ: "AE", Ø: "OE", å: "aa", æ: "ae", ø: "oe" },
  it: { "&": "e" },
  nl: { "&": "en" },
  sv: { "&": "och", Å: "AA", Ä: "AE", Ö: "OE", å: "aa", ä: "ae", ö: "oe" },
};

export const slugify = (string: string, options?: ReplaceOptions): string => {
  options = options || {};
  options.lower = options?.lower ?? true;
  options.trim = options?.trim ?? true;
  options.replacement = options?.replacement ?? "-";
  options.strict = options?.strict ?? true;

  if (typeof string !== "string")
    throw new TypeError("slugify: string argument expected");

  options = options || {};
  const localeMap = locales[options.locale || ""] || {};

  let slug = string
    .normalize()
    .split("")
    .reduce((result, ch) => {
      let appendChar = localeMap[ch] ?? charMap[ch] ?? ch;
      if (appendChar === options.replacement) appendChar = " ";
      return (
        result +
        appendChar.replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, "")
      );
    }, "");

  if (options.strict) slug = slug.replaceAll(/[^A-Za-z0-9\s]/g, "");
  if (options.trim) slug = slug.trim();

  slug = slug.replaceAll(/\s+/g, options.replacement || "-");

  if (options.lower) slug = slug.toLowerCase();

  return slug;
};
