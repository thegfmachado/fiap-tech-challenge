export interface IStorageService {
  uploadFile(bucket: string, path: string, file: File): Promise<string>;
  downloadFile(bucket: string, path: string): Promise<Blob>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
}
