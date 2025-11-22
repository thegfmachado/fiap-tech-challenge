import { isMobile } from '@/constants/device';
import { supabase } from '@/lib/supabase';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import * as FileSystem from 'expo-file-system';

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

      let fileData: Blob | ArrayBuffer;

      // Para React Native, precisamos usar expo-file-system
      if (isMobile) {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Converter base64 para ArrayBuffer
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        fileData = bytes.buffer;
      } else {
        // Para web, usar fetch normalmente
        const response = await fetch(file.uri);
        fileData = await response.blob();
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('transaction-attachments')
        .upload(filePath, fileData, {
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

  async downloadAttachment(filePath: string, transactionId?: string): Promise<string> {
    try {
      // Se o filePath não contém '/', é só o nome do arquivo - construir o caminho completo
      let fullPath = filePath;
      if (!filePath.includes('/') && transactionId) {
        fullPath = `transactions/${transactionId}/${filePath}`;
      }

      // Criar uma URL assinada que funciona para buckets privados
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('transaction-attachments')
        .createSignedUrl(fullPath, 60); // URL válida por 60 segundos

      if (signedUrlError || !signedUrlData?.signedUrl) {
        console.error('Erro ao criar URL assinada:', signedUrlError);
        throw new Error('Não foi possível gerar URL de download');
      }

      if (isMobile) {
        // Para mobile, baixar diretamente usando FileSystem
        const cacheDir = FileSystem.cacheDirectory;
        if (!cacheDir) {
          throw new Error('Diretório de cache não disponível');
        }

        const fileName = fullPath.split('/').pop() || 'download';
        const fileUri = `${cacheDir}${fileName}`;

        // Baixar o arquivo usando a URL assinada
        const downloadResult = await FileSystem.downloadAsync(signedUrlData.signedUrl, fileUri);

        if (downloadResult.status !== 200) {
          throw new Error(`Erro no download: Status ${downloadResult.status}`);
        }

        // Retornar o URI do arquivo baixado
        return downloadResult.uri;
      } else {
        // Para web, retornar a URL assinada
        return signedUrlData.signedUrl;
      }
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

  async getAttachmentUrl(fileName: string): Promise<string> {
    const { data: signedUrlData, error } = await supabase.storage
      .from('transaction-attachments')
      .createSignedUrl(fileName, 3600); // URL válida por 1 hora

    if (error || !signedUrlData?.signedUrl) {
      throw new Error('Não foi possível gerar URL do anexo');
    }

    return signedUrlData.signedUrl;
  }
}
