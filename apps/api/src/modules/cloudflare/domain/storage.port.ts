export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface IStorageService {
  uploadResourceImage(file: Express.Multer.File): Promise<{ key: string }>;
  copyObject(key: string, newKey: string): Promise<void>;
}
