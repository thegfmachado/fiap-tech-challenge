import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fiap-tech-challenge/design-system/components";

import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction, ITransactionInsert } from "@fiap-tech-challenge/database/types";
import { TransactionsForm } from "@bytebank/components/transactions-form";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export type EditTransactionProps = {
  transaction: ITransaction;
  readOnly?: boolean;
  onClose?: () => void;
  onSuccess?: (transaction: ITransaction) => void;
  onError?: (error: Error) => void;
}

export function EditTransaction(props: EditTransactionProps) {
  const { onClose, onSuccess, onError, readOnly, transaction } = props;

  const [open, setOpen] = useState(Boolean(transaction));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      onClose?.();
    }
  }, [onClose, open])

  const handleEditTransaction = async (transactionData: ITransaction | ITransactionInsert) => {
    setSubmitting(true);
    try {
      await transactionService.update(transaction!.id, transactionData as Partial<ITransaction>);

      onSuccess?.(transaction!);
    } catch (error) {
      onError?.(new Error("Erro ao editar transação"));
      console.error("Erro ao editar transação", error);
    } finally {
      setSubmitting(false);
    }
  }

  const title = readOnly ? "Visualizar transação" : "Editar transação";

  const handleAttachmentChange = (updatedTransaction: ITransaction) => {
    onSuccess?.(updatedTransaction);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <TransactionsForm 
          readOnly={readOnly} 
          disabled={submitting} 
          onSubmit={handleEditTransaction} 
          onAttachmentChange={handleAttachmentChange}
          transaction={transaction} 
        />
      </DialogContent>
    </Dialog>
  )
}
