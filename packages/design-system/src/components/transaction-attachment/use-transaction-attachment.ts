"use client";

import { useState, useRef } from "react";

import type { TransactionAttachmentProps, BaseTransaction } from "./transaction-attachment.types";

export const TRANSACTION_ATTACHMENT_DEFAULT_PROPS: Partial<TransactionAttachmentProps> = {
  disabled: false,
  mode: "edit",
  onUpload: undefined,
  onDownload: undefined,
  onDelete: undefined,
};

export function useTransactionAttachment(props: TransactionAttachmentProps) {
  const {
    transaction,
    onAttachmentChange,
    onFileSelect,
    onUpload,
    onDownload,
    onDelete,
    disabled = false,
    mode = "edit",
    ...rest
  } = props;

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transactionAny = transaction as BaseTransaction | undefined;
  const isCreateMode = mode === "create" || !transaction;

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: "Arquivo muito grande. Tamanho máximo: 10MB" };
    }
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Tipo de arquivo não suportado" };
    }

    return { isValid: true };
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      
      console.error(validation.error);
      return;
    }

    if (isCreateMode) {
      
      setSelectedFile(file);
      onFileSelect?.(file);
    } else if (transaction && onUpload) {
      
      setIsUploading(true);
      try {
        const attachment = await onUpload(transaction.id, file);
        
        const updatedTransaction = {
          ...transaction,
          attachment_url: attachment.url,
          attachment_name: attachment.name
        };
        
        onAttachmentChange?.(updatedTransaction);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!transactionAny?.attachment_url || !transactionAny?.attachment_name || !transaction || !onDownload) return;

    try {
      const fileName = transactionAny.attachment_url.split('/').pop()!;
      const blob = await onDownload(transaction.id, fileName);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = transactionAny.attachment_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async () => {
    if (!transactionAny?.attachment_url || !transactionAny?.attachment_name || !transaction || !onDelete) return;

    setIsDeleting(true);
    try {
      const fileName = transactionAny.attachment_url.split('/').pop()!;
      await onDelete(transaction.id, fileName);
      
      const updatedTransaction = {
        ...transaction,
        attachment_url: null,
        attachment_name: null
      };
      
      onAttachmentChange?.(updatedTransaction);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const hasAttachment = !isCreateMode && transactionAny?.attachment_name && transactionAny?.attachment_url;
  const hasSelectedFile = isCreateMode && selectedFile;

  return {
    isUploading,
    isDeleting,
    selectedFile,
    fileInputRef,
    isCreateMode,
    hasAttachment,
    hasSelectedFile,
    handleFileSelect,
    handleDownload,
    handleDelete,
    clearSelectedFile,
    triggerFileInput,
    validateFile,
    disabled,
    transaction,
    ...rest
  };
}
