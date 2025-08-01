import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction, ITransactionInsert } from "@fiap-tech-challenge/database/types";
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

  const handleCreateNewTransaction = async (transactionData: ITransactionInsert, file?: File) => {
    setSubmitting(true);
    try {
      const transactionCreate: ITransactionInsert = {
        id: transactionData.id || Date.now().toString(),
        type: transactionData.type,
        value: transactionData.value,
        date: transactionData.date || new Date().toISOString(),
        description: transactionData.description || '',
      };
      
      const createdTransaction = await transactionService.create(transactionCreate as ITransaction);
      
      if (file && createdTransaction) {
        try {
          await transactionService.uploadAttachment(createdTransaction.id, file);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          
        }
      }

      onSuccess?.(createdTransaction);
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
