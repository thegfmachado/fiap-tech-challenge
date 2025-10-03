import React, { useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { AttachmentCard } from './AttachmentCard';
import { FileUpload } from './FileUpload';
import { DeleteAttachmentModal } from './DeleteAttachmentModal';
import { TransactionAttachmentService } from '@/lib/services/attachment-service';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import { supabase } from '@/lib/supabase';
import { useAsyncAction } from '@/hooks/useAsyncOperation';

export interface BaseTransaction {
  id: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
}

interface TransactionAttachmentProps {
  transaction?: BaseTransaction;
  onAttachmentChange?: (transaction: BaseTransaction) => void;
  onFileSelect?: (file: { name: string; uri: string; type: string; size: number } | null) => void;
  disabled?: boolean;
  mode?: 'create' | 'edit';
  className?: string;
}

export function TransactionAttachment({
  transaction,
  onAttachmentChange,
  onFileSelect,
  disabled = false,
  mode = 'edit',
  className,
}: TransactionAttachmentProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string; type: string; size: number } | null>(null);
  
  const attachmentService = new TransactionAttachmentService();
  const transactionService = new TransactionsQueriesService(supabase);

  const uploadOperation = useAsyncAction({
    onSuccess: () => Alert.alert('Sucesso', 'Arquivo anexado com sucesso!'),
    onError: (error) => `Falha ao anexar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
  });

  const downloadOperation = useAsyncAction({
    onError: () => 'Não foi possível baixar o arquivo. Tente novamente.',
  });

  const deleteOperation = useAsyncAction({
    onSuccess: () => Alert.alert('Sucesso', 'Anexo removido com sucesso!'),
    onError: (error) => `Falha ao remover anexo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
  });

  const isCreateMode = mode === 'create' || !transaction;
  const hasAttachment = !isCreateMode && transaction?.attachment_name && transaction?.attachment_url;
  const hasSelectedFile = isCreateMode && selectedFile;

    const handleUpload = async (transactionId: string, file: { name: string; uri: string; type: string; size: number }) => {
    try {
      await attachmentService.uploadAttachment(transactionId, file);
      
      const updatedTransaction = await transactionService.getTransactionById(transactionId);
      return {
        url: updatedTransaction.attachment_url || '',
        name: updatedTransaction.attachment_name || ''
      };
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  const handleFileSelect = async (file: { name: string; uri: string; type: string; size: number } | null) => {
    if (!file) return;
    if (isCreateMode) {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else if (transaction) {
      await uploadOperation.execute(async () => {
        const attachment = await handleUpload(transaction.id, file);
        
        const updatedTransaction = {
          ...transaction,
          attachment_url: attachment.url,
          attachment_name: attachment.name,
        };
        
        onAttachmentChange?.(updatedTransaction);
      });
    }
  };

  const handleDownload = async () => {
    if (!transaction?.attachment_url || !transaction?.attachment_name) return;

    await downloadOperation.execute(async () => {
      const fileName = transaction.attachment_url!;
      const blob = await attachmentService.downloadAttachment(transaction.id, fileName);
      
      if (Platform.OS === 'web') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = transaction.attachment_name!;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Alert.alert(
          'Download Iniciado', 
          `O download do arquivo "${transaction.attachment_name}" foi iniciado.`,
          [{ text: 'OK' }]
        );
      } else {
        // Mobile platform - use FileSystem
        if (!FileSystem.documentDirectory) {
          throw new Error('Diretório de documentos não disponível');
        }

        const sanitizedFileName = transaction.attachment_name!.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileUri = `${FileSystem.documentDirectory}${sanitizedFileName}`;
        
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result && typeof reader.result === 'string') {
              const base64Data = reader.result.split(',')[1];
              resolve(base64Data);
            } else {
              reject(new Error('Erro ao converter arquivo'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: blob.type,
            dialogTitle: `Compartilhar ${transaction.attachment_name}`,
          });
        } else {
          Alert.alert(
            'Download Concluído', 
            `Arquivo salvo com sucesso!\n\nLocal: ${fileUri}`,
            [{ text: 'OK' }]
          );
        }
      }
    });
  };

  const handleDelete = () => {
    if (isCreateMode && selectedFile) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    if (!transaction?.attachment_url || !transaction?.attachment_name) return;

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!transaction?.attachment_url || !transaction?.attachment_name) return;

    await deleteOperation.execute(async () => {
      const attachmentUrl = transaction.attachment_url!;
      const fileName = attachmentUrl.split('/').pop() || attachmentUrl;
      
      await attachmentService.deleteAttachment(transaction.id, fileName);
      
      const updatedTransaction = {
        ...transaction,
        attachment_url: null,
        attachment_name: null,
      };
      
      onAttachmentChange?.(updatedTransaction);
    });
  };

  return (
    <View className={className}>
      <Text className="text-sm font-medium text-gray-700 mb-3">
        Anexo (opcional)
      </Text>

      {hasAttachment && transaction ? (
        <AttachmentCard
          fileName={transaction.attachment_name!}
          fileStatus="Arquivo anexado"
          onDownload={handleDownload}
          onDelete={handleDelete}
          isDeleting={deleteOperation.isLoading}
          isDownloading={downloadOperation.isLoading}
          disabled={disabled}
          showDownload={true}
          showDelete={true}
        />
      ) : hasSelectedFile ? (
        <AttachmentCard
          fileName={selectedFile!.name}
          fileStatus="Arquivo selecionado"
          onDelete={handleDelete}
          disabled={disabled}
          showDownload={false}
          showDelete={true}
        />
      ) : (
        <FileUpload
          onFileSelect={handleFileSelect}
          disabled={disabled}
          isUploading={uploadOperation.isLoading}
        />
      )}

      <DeleteAttachmentModal
        visible={showDeleteModal}
        fileName={transaction?.attachment_name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}