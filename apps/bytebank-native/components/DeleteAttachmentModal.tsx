import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Colors } from '@/constants/Colors';

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
      description="Você tem certeza que deseja remover o anexo? Esta ação não poderá ser desfeita."
      itemName={fileName || undefined}
      confirmText="Remover anexo"
      loadingText="Removendo..."
      onClose={onClose}
      onConfirm={onConfirm}
      showTwoButtons
      confirmButtonColor={Colors.light.danger}
    />
  );
}
