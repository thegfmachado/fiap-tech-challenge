import type React from "react";

export interface BaseTransaction {
  id: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
}

export interface TransactionAttachmentProps {
  /** Dados da transação (opcional para modo de criação) */
  transaction?: BaseTransaction & Record<string, unknown>;
  /** Callback chamado quando o anexo é alterado (upload/delete) */
  onAttachmentChange?: (transaction: BaseTransaction & Record<string, unknown>) => void;
  /** Callback chamado quando um arquivo é selecionado no modo de criação */
  onFileSelect?: (file: File | null) => void;
  /** Callback chamado quando um arquivo é enviado */
  onUpload?: (transactionId: string, file: File) => Promise<{ url: string; name: string }>;
  /** Callback chamado quando um arquivo é baixado */
  onDownload?: (transactionId: string, fileName: string) => Promise<Blob>;
  /** Callback chamado quando um arquivo é deletado */
  onDelete?: (transactionId: string, fileName: string) => Promise<void>;
  /** Se true, desabilita a interação com o componente */
  disabled?: boolean;
  /** Modo de operação do componente */
  mode?: "create" | "edit";
  /** Classes CSS customizadas */
  className?: string;
}

export interface FileIconProps {
  fileName: string;
  className?: string;
}

export interface AttachmentCardProps {
  fileName: string;
  fileStatus: string;
  onDownload?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  disabled?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;
}

export interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isUploading?: boolean;
  accept?: string;
}
