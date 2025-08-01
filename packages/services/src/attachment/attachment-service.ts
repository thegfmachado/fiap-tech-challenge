import { IStorageService } from "../storage/storage-service.interface.js";
import { IAttachmentService, IAttachment } from "./attachment-service.interface.js";

export class AttachmentService implements IAttachmentService {
  private readonly storageService: IStorageService;
  private readonly bucket = 'transaction-attachments';

  constructor(storageService: IStorageService) {
    this.storageService = storageService;
  }

  async uploadTransactionAttachment(transactionId: string, file: File): Promise<IAttachment> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = `transactions/${transactionId}/${fileName}`;

    try {
      await this.storageService.uploadFile(this.bucket, filePath, file);
      
      return {
        url: filePath,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading transaction attachment:', error);
      throw new Error('Failed to upload attachment');
    }
  }

  async downloadTransactionAttachment(transactionId: string, fileName: string): Promise<Blob> {
    const filePath = `transactions/${transactionId}/${fileName}`;
    
    try {
      return await this.storageService.downloadFile(this.bucket, filePath);
    } catch (error) {
      console.error('Error downloading transaction attachment:', error);
      throw new Error('Failed to download attachment');
    }
  }

  async deleteTransactionAttachment(transactionId: string, fileName: string): Promise<void> {
    const filePath = `transactions/${transactionId}/${fileName}`;
    
    try {
      await this.storageService.deleteFile(this.bucket, filePath);
    } catch (error) {
      console.error('Error deleting transaction attachment:', error);
      throw new Error('Failed to delete attachment');
    }
  }

  getTransactionAttachmentUrl(transactionId: string, fileName: string): string {
    const filePath = `transactions/${transactionId}/${fileName}`;
    return this.storageService.getPublicUrl(this.bucket, filePath);
  }
}
