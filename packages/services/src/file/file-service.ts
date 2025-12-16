import type { IFileService } from "./file-service.interface.js";

export class FileService implements IFileService {
  async uploadFile<T>(url: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`HTTP error ${res.status}: ${error}`);
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");

    if (isJson) {
      return res.json();
    }

    return undefined as T;
  }

  async downloadFile(url: string): Promise<Blob> {
    const res = await fetch(url);

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`HTTP error ${res.status}: ${error}`);
    }

    return res.blob();
  }
}
