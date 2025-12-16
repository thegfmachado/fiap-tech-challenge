import { OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { TransactionService } from "@bytebank/client/services/transaction-service";

import type { ITransaction } from "@fiap-tech-challenge/database/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fiap-tech-challenge/design-system/components";
import { HTTPService } from "@fiap-tech-challenge/services";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export type DeleteTransactionProps = {
  transaction: ITransaction;
  onClose?: () => void;
  onSuccess?: (transaction: ITransaction) => void;
  onError?: (error: Error) => void;
}

export function DeleteTransaction(props: DeleteTransactionProps) {
  const { onClose, onSuccess, onError, transaction } = props;

  const [open, setOpen] = useState(Boolean(transaction));

  useEffect(() => {
    if (!open) {
      onClose?.();
    }
  }, [onClose, open])

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.delete(transaction.id);

      onSuccess?.(transaction);
    } catch (error) {
      onError?.(new Error("Erro ao excluir transação"));
      console.error("Erro ao excluir transação", error);
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center gap-4">
          <OctagonAlert size={76} className="text-primary-light" />
          <DialogTitle className="text-2xl sm:text-3xl text-center">Você tem certeza que quer deletar essa transação?</DialogTitle>
        </DialogHeader>
        <p className="text-md sm:text-lg text-center">Esta ação não poderá ser desfeita.</p>
        <div className="flex justify-center">
          <Button onClick={handleDeleteTransaction}>Deletar transação</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
