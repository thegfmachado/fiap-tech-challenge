import type { TypedSupabaseClient } from "@fiap-tech-challenge/database/types";

import type { IStorageService } from "./storage-service.interface.js";

export class StorageService implements IStorageService {
  private readonly client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient) {
    this.client = client;
  }

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Error uploading file: ${error.message}`);
    }

    return data.path;
  }

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Storage download error:', error);
      throw new Error(`Error downloading file: ${error.message}`);
    }

    return data;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
