import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';

import { AttachmentCard } from '../ui/AttachmentCard';
import { FileUpload } from '../ui/FileUpload';
import { DeleteAttachmentModal } from './modals/DeleteAttachmentModal';
import { TransactionAttachmentService } from '@/lib/services/attachment-service';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import { supabase } from '@/lib/supabase';
import { useAsyncAction } from '@/hooks/useAsyncOperation';
import { isWeb } from '@/constants/device';

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

/**
 * Realiza o download de um arquivo no ambiente Web.
 */
async function handleWebDownload(url: string, fileName: string) {
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.target = '_blank';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  Alert.alert(
    'Download Iniciado',
    `O download do arquivo "${fileName}" foi iniciado.`,
    [{ text: 'OK' }]
  );
}

/**
 * Realiza o download de um arquivo no ambiente mobile.
 */
async function handleMobileDownload(fileUri: string, fileName: string) {

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      dialogTitle: `Compartilhar ${fileName}`,
    });
  } else {
    Alert.alert(
      'Download Concluído',
      `Arquivo salvo com sucesso!\n\nLocal: ${fileUri}`,
      [{ text: 'OK' }]
    );
  }
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
        url: updatedTransaction.attachment_url ?? '',
        name: updatedTransaction.attachment_name ?? ''
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
      return;
    }

    if (!transaction) return;

    await uploadOperation.execute(async () => {
      const attachment = await handleUpload(transaction.id, file);

      const updatedTransaction = {
        ...transaction,
        attachment_url: attachment.url,
        attachment_name: attachment.name,
      };

      onAttachmentChange?.(updatedTransaction);
    });
  };

  const handleDownload = async () => {
    const { attachment_url: url, attachment_name: fileName, id: transactionId } = transaction ?? {};

    if (!url || !fileName || !transactionId) return;

    await downloadOperation.execute(async () => {
      const fileUriOrUrl = await attachmentService.downloadAttachment(url, transactionId);

      if (isWeb) {
        await handleWebDownload(fileUriOrUrl, fileName);
      } else {
        await handleMobileDownload(fileUriOrUrl, fileName);
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
