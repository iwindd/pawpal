import levenshtein from "./levenshtein";

export const similarity = (label: string, search: string) => {
  if (!search) return 0;

  label = label.toLowerCase();
  const q = search.toLowerCase();

  if (label.startsWith(q)) return 100;
  if (label.includes(q)) return 50;

  const distance = levenshtein(label, q) || 0;

  return 10 - distance;
};
