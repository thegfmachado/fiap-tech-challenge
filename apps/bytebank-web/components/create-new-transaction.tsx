import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { TransactionsForm } from "@bytebank/components/transactions-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@fiap-tech-challenge/design-system/components";
import { SquarePlus } from "lucide-react";
import { useState } from "react";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export interface CreateNewTransactionProps {
  onSuccess?: (transaction: ITransaction) => void;
  onError?: (error: Error) => void;
}

export function CreateNewTransaction(props: CreateNewTransactionProps) {
  const { onSuccess, onError } = props;

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  }

  const handleCreateNewTransaction = async (transaction: ITransaction) => {
    setSubmitting(true);
    try {
      await transactionService.create(transaction);

      onSuccess?.(transaction);
    } catch (error) {
      onError?.(new Error("Erro ao criar nova transação"));
      console.error("Erro ao criar nova transação", error);
    } finally {
      setSubmitting(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={handleOpenDialog}>
          <SquarePlus />
          Nova transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova transação</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Formulário para criar uma nova transação
        </DialogDescription>
        <TransactionsForm disabled={submitting} onSubmit={handleCreateNewTransaction} />
      </DialogContent>
    </Dialog>
  )
}
