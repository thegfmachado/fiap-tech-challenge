export interface IFileService {
  uploadFile<T>(url: string, file: File): Promise<T>;
  downloadFile(url: string): Promise<Blob>;
}
