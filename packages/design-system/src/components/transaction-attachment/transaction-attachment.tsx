"use client";

import { Upload, X, Download, FileText, Image, FileSpreadsheet } from "lucide-react";
import { cn } from "../../lib/utils";

import type { TransactionAttachmentProps, FileIconProps, AttachmentCardProps, FileUploadProps, BaseTransaction } from "./transaction-attachment.types";
import { useTransactionAttachment, TRANSACTION_ATTACHMENT_DEFAULT_PROPS } from "./use-transaction-attachment";

import { Button } from "../button/button";
import { Card, CardContent } from "../card/card";
import { Label } from "../label/label";

export { TRANSACTION_ATTACHMENT_DEFAULT_PROPS };

export function FileIcon({ fileName, className }: FileIconProps) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const iconClass = cn("h-4 w-4", className);
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <Image className={iconClass} />;
    case 'pdf':
      return <FileText className={iconClass} />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
}

export function AttachmentCard({
  fileName,
  fileStatus,
  onDownload,
  onDelete,
  isDeleting = false,
  disabled = false,
  showDownload = true,
  showDelete = true
}: AttachmentCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileIcon fileName={fileName} />
            <div>
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">{fileStatus}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showDownload && onDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownload}
                disabled={false}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            {showDelete && onDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={disabled || isDeleting}
              >
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FileUpload({
  onFileSelect,
  disabled = false,
  isUploading = false,
  accept = "image/*,.pdf,.txt,.csv,.xls,.xlsx"
}: FileUploadProps) {
  return (
    <div>
      <input
        type="file"
        onChange={onFileSelect}
        className="hidden"
        accept={accept}
        disabled={disabled || isUploading}
        id="file-upload-input"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('file-upload-input')?.click()}
        disabled={disabled || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Arquivo
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2">
        Formatos aceitos: JPG, PNG, PDF, TXT, CSV, XLS. Máximo: 10MB
      </p>
    </div>
  );
}

export function TransactionAttachment(props: TransactionAttachmentProps) {
  const {
    isUploading,
    isDeleting,
    selectedFile,
    fileInputRef,
    hasAttachment,
    hasSelectedFile,
    handleFileSelect,
    handleDownload,
    handleDelete,
    clearSelectedFile,
    triggerFileInput,
    className,
    disabled,
    transaction
  } = useTransactionAttachment({ ...TRANSACTION_ATTACHMENT_DEFAULT_PROPS, ...props });

  const transactionAny = transaction as BaseTransaction | undefined;

  return (
    <div className={cn("space-y-4", className)}>
      <Label htmlFor="attachment">Anexo (opcional)</Label>
      
      {hasAttachment && transactionAny ? (
        <AttachmentCard
          fileName={transactionAny.attachment_name!}
          fileStatus="Arquivo anexado"
          onDownload={handleDownload}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          disabled={disabled}
          showDownload={true}
          showDelete={true}
        />
      ) : hasSelectedFile ? (
        <AttachmentCard
          fileName={selectedFile!.name}
          fileStatus="Arquivo selecionado"
          onDelete={clearSelectedFile}
          disabled={disabled}
          showDownload={false}
          showDelete={true}
        />
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.txt,.csv,.xls,.xlsx"
            disabled={disabled || isUploading}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Arquivo
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Formatos aceitos: JPG, PNG, PDF, TXT, CSV, XLS. Máximo: 10MB
          </p>
        </div>
      )}
    </div>
  );
}
