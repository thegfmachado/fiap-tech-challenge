import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { COLORS } from '@/utils/constants';

export interface DeleteAttachmentModalProps {
  visible: boolean;
  fileName?: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAttachmentModal({
  visible,
  fileName,
  onClose,
  onConfirm,
}: DeleteAttachmentModalProps) {
  return (
    <ConfirmationModal
      visible={visible}
      title="Remover anexo?"
      description="Você tem certeza que deseja remover o anexo"
      itemName={fileName || undefined}
      confirmText="Remover"
      cancelText="Cancelar"
      loadingText="Removendo..."
      onClose={onClose}
      onConfirm={onConfirm}
      showTwoButtons={true} 
      confirmButtonColor={COLORS.DANGER}
    />
  );
}