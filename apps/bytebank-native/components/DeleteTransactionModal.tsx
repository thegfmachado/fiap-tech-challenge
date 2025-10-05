import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import type { ITransaction } from '@fiap-tech-challenge/database/types';
import { Colors } from '@/constants/Colors';

export interface DeleteTransactionModalProps {
  visible: boolean;
  transaction: ITransaction | null;
  onClose: () => void;
  onConfirm: (transactionId: string) => Promise<void>;
}

export function DeleteTransactionModal({
  visible,
  transaction,
  onClose,
  onConfirm,
}: DeleteTransactionModalProps) {
  if (!transaction) {
    return null
  };

  const handleConfirm = async () => {
    await onConfirm(transaction.id);
  };

  return (
    <ConfirmationModal
      visible={visible}
      title="Deletar transação?"
      description="Você tem certeza que quer deletar essa transação? Esta ação não poderá ser desfeita."
      confirmText="Deletar transação"
      loadingText="Deletando..."
      onClose={onClose}
      onConfirm={handleConfirm}
      showTwoButtons
      confirmButtonColor={Colors.light.danger}
    />
  );
}
