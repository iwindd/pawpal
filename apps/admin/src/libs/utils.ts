import { FileWithPath } from "@pawpal/ui/dropzone";
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

  /**
   * Convert FileWithPath[] to FileList
   * @param files Array of FileWithPath
   * @returns FileList
   */
  static fileWithPathToFileList(files: FileWithPath[]): FileList {
    const dataTransfer = new DataTransfer();

    files.forEach((file) => {
      dataTransfer.items.add(file);
    });

    return dataTransfer.files;
  }

  /**
   * Get resource url from storage
   * @param url Resource url
   * @returns Resource url
   */
  static getResourceUrl(url: string) {
    return `${process.env.NEXT_PUBLIC_STORAGE_URL}/${url}`;
  }

  /**
   * Get relative time from date
   * @param date Date to get relative time
   * @param locale Locale to get relative time
   * @returns Relative time
   */
  static getRelativeTime(date: Date, locale: string) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const diff = date.getTime() - Date.now();
    const seconds = Math.round(diff / 1000);

    const divisions = [
      { amount: 60, unit: "second" },
      { amount: 60, unit: "minute" },
      { amount: 24, unit: "hour" },
      { amount: 7, unit: "day" },
      { amount: 4.34524, unit: "week" },
      { amount: 12, unit: "month" },
      { amount: Infinity, unit: "year" },
    ] as const;

    let duration = seconds;

    for (const division of divisions) {
      if (Math.abs(duration) < division.amount) {
        return rtf.format(duration, division.unit);
      }
      duration = Math.round(duration / division.amount);
    }
  }
}

/** @deprecated Use `Util.similarity` instead */
export const similarity = Util.similarity;
