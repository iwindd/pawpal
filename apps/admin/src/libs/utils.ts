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
}

/** @deprecated Use `Util.similarity` instead */
export const similarity = Util.similarity;
