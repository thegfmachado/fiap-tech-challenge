export interface IAttachment {
  url: string;
  name: string;
}

export interface IAttachmentService {
  uploadTransactionAttachment(transactionId: string, file: File): Promise<IAttachment>;
  downloadTransactionAttachment(transactionId: string, fileName: string): Promise<Blob>;
  deleteTransactionAttachment(transactionId: string, fileName: string): Promise<void>;
  getTransactionAttachmentUrl(transactionId: string, fileName: string): string;
}
