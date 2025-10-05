import { supabase } from '@/lib/supabase';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';

export interface AttachmentUploadResult {
  url: string;
  name: string;
}

export class TransactionAttachmentService {
  private transactionService: TransactionsQueriesService;

  constructor() {
    this.transactionService = new TransactionsQueriesService(supabase);
  }

  async uploadAttachment(
    transactionId: string, 
    file: { name: string; uri: string; type: string; size: number }
  ): Promise<AttachmentUploadResult> {
    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = `transactions/${transactionId}/${fileName}`;

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('transaction-attachments')
        .upload(filePath, blob, {
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      await this.transactionService.updateTransaction(transactionId, {
        attachment_url: uploadData.path,
        attachment_name: file.name,
      });

      return {
        url: uploadData.path,
        name: file.name,
      };
    } catch (error) {
      console.error('Erro no upload do anexo:', error);
      throw new Error('Falha ao anexar arquivo');
    }
  }

  async downloadAttachment(transactionId: string, filePath: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from('transaction-attachments')
        .download(filePath);

      if (error) {
        throw new Error(`Erro no download: ${error.message}`);
      }

      if (!data) {
        throw new Error('Arquivo não encontrado');
      }

      return data;
    } catch (error) {
      console.error('Erro no download do anexo:', error);
      throw new Error('Falha ao baixar arquivo');
    }
  }

  async deleteAttachment(transactionId: string, fileName: string): Promise<void> {
    try {
      let filePath = fileName;
      if (!fileName.includes('/')) {
        filePath = `transactions/${transactionId}/${fileName}`;
      }
      
      const { error: deleteError } = await supabase.storage
        .from('transaction-attachments')
        .remove([filePath]);

      if (deleteError) {
        console.error('Erro no Supabase Storage:', deleteError);
        throw new Error(`Erro ao deletar arquivo: ${deleteError.message}`);
      }
      
      await this.transactionService.updateTransaction(transactionId, {
        attachment_url: null,
        attachment_name: null,
      });
    } catch (error) {
      console.error('Erro ao deletar anexo:', error);
      throw error instanceof Error ? error : new Error('Falha ao remover anexo');
    }
  }

  getAttachmentUrl(fileName: string): string {
    const { data } = supabase.storage
      .from('transaction-attachments')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }
}