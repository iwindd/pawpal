import levenshtein from "./levenshtein";

export class Util {
  /**
   * Calculate similarity between two strings
   * @param label String to compare
   * @param search String to search
   * @returns Similarity percentage
   */
  static similarity(label: string, search: string) {
    if (!search) return 0;

    label = label.toLowerCase();
    const q = search.toLowerCase();

    if (label.startsWith(q)) return 100;
    if (label.includes(q)) return 50;

    const distance = levenshtein(label, q) || 0;

    return 10 - distance;
  }
}

/** @deprecated Use `Util.similarity` instead */
export const similarity = Util.similarity;
