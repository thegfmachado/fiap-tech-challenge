import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button, RadioGroup, FormLabel, RadioGroupItem,
  TransactionAttachment,
  BaseTransaction,
} from "@fiap-tech-challenge/design-system/components";
import type { ITransaction, ITransactionInsert } from "@fiap-tech-challenge/database/types";
import { TransactionType } from "@fiap-tech-challenge/models";

import { CurrencyInput } from "@bytebank/components/ui/currency-input";
import { DatePicker } from "@bytebank/components/date-picker";
import { HTTPService } from "@fiap-tech-challenge/services";
import { TransactionService } from "@bytebank/client/services/transaction-service";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export type TransactionsFormProps = {
  disabled?: boolean;
  onSubmit: (transaction: ITransaction | ITransactionInsert, file?: File) => void;
  onAttachmentChange?: (transaction: ITransaction) => void;
  readOnly?: boolean;
  transaction?: ITransaction;
}

const createTransactionSchema = z.object({
  id: z.string(),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
  description: z.string({ required_error: "Este campo é obrigatório" }),
  value: z.number({ required_error: "Este campo é obrigatório" }).min(1, "Valor deve ser maior que 0"),
  date: z.date({ required_error: "Este campo é obrigatório" }),
})

type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

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
    resolver: zodResolver(createTransactionSchema),
    defaultValues: transaction ? {
      id: transaction.id,
      description: transaction.description,
      value: transaction.value,
      type: transaction.type as typeof TransactionType.CREDIT | typeof TransactionType.DEBIT,
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
