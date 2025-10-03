import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import type { ITransaction } from '@fiap-tech-challenge/database/types';

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
  const handleConfirm = async () => {
    if (!transaction) return;
    await onConfirm(transaction.id);
  };

  if (!transaction) return null;

  return (
    <ConfirmationModal
      visible={visible}
      title="Você tem certeza que quer deletar essa transação?"
      description="Esta ação não poderá ser desfeita."
      confirmText="Deletar transação"
      loadingText="Deletando..."
      onClose={onClose}
      onConfirm={handleConfirm}
      showTwoButtons={false}
      confirmButtonColor="#664373"
    />
  );
}