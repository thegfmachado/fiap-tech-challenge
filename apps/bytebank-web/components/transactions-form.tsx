import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TransactionService } from "@bytebank/client/services/transaction-service";

import type { ITransaction, ITransactionInsert } from "@fiap-tech-challenge/database/types";
import type { BaseTransaction } from "@fiap-tech-challenge/design-system/components";
import {
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button, RadioGroup, FormLabel, RadioGroupItem,
  TransactionAttachment,
  CurrencyInput, DatePicker
} from "@fiap-tech-challenge/design-system/components";
import { TransactionType } from "@fiap-tech-challenge/models";
import { HTTPService } from "@fiap-tech-challenge/services";
import { transactionSchema, type TransactionSchema } from "@fiap-tech-challenge/validation-schemas";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export type TransactionsFormProps = {
  disabled?: boolean;
  onSubmit: (transaction: ITransaction | ITransactionInsert, file?: File) => void;
  onAttachmentChange?: (transaction: ITransaction) => void;
  readOnly?: boolean;
  transaction?: ITransaction;
}

type CreateTransactionSchema = TransactionSchema;

const options = [
  {
    value: TransactionType.DEBIT,
    label: "Transferência",
  },
  {
    value: TransactionType.CREDIT,
    label: "Depósito",
  },
]

export function TransactionsForm({
  disabled = false,
  readOnly = false,
  onSubmit,
  onAttachmentChange,
  transaction,
}: TransactionsFormProps) {
  const [currentTransaction, setCurrentTransaction] = useState<ITransaction | undefined>(transaction);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? {
      id: transaction.id,
      description: transaction.description,
      value: transaction.value,
      type: transaction.type as TransactionType,
      date: new Date(transaction.date),
    } : {
      id: Date.now().toString(),
      type: TransactionType.DEBIT,
      description: "",
      value: 0,
      date: new Date(),
    },
  })

  const handleSubmit = (values: CreateTransactionSchema) => {
    onSubmit({
      ...values,
      date: values.date.toISOString(),
    } as ITransaction | ITransactionInsert, selectedFile || undefined);
  }

  const handleAttachmentChange = (updatedTransaction: BaseTransaction & Record<string, unknown>) => {
    const typedTransaction = updatedTransaction as ITransaction;
    setCurrentTransaction(typedTransaction);
    onAttachmentChange?.(typedTransaction);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          disabled={readOnly}
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Tipo de transação</FormLabel>
              <FormControl>
                <RadioGroup disabled={field.disabled} defaultValue={field.value} onValueChange={field.onChange} readOnly={readOnly}
                  className="flex space-x-4">
                  {options.map(option => (
                    <FormItem key={option.value} className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="text-muted-foreground">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Descrição" readOnly={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CurrencyInput placeholder="R$ 0,00" readOnly={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker fitParent mode="single" readOnly={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TransactionAttachment
          transaction={currentTransaction}
          onAttachmentChange={handleAttachmentChange}
          onFileSelect={(file) => setSelectedFile(file)}
          disabled={readOnly || disabled}
          mode={currentTransaction ? "edit" : "create"}
          onUpload={async (transactionId: string, file: File) => {
            return await transactionService.uploadAttachment(transactionId, file);
          }}
          onDownload={async (transactionId: string, fileName: string) => {
            return await transactionService.downloadAttachment(transactionId, fileName);
          }}
          onDelete={async (transactionId: string, fileName: string) => {
            await transactionService.deleteAttachment(transactionId, fileName);
          }}
        />

        {!readOnly && (
          <div className="flex justify-center">
            <Button disabled={disabled} size="lg" type="submit">
              {transaction ? "Editar transação" : "Criar transação"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
