import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button, RadioGroup, FormLabel, RadioGroupItem,
} from "@fiap-tech-challenge/design-system/components";
import { TransactionType } from "@bytebank/shared/enums/transaction-type.enum";
import { CurrencyInput } from "@bytebank/components/ui/currency-input";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { DatePicker } from "@bytebank/components/date-picker";

export type TransactionsFormProps = {
  disabled?: boolean;
  onSubmit: (transaction: ITransaction) => void;
  readOnly?: boolean;
  transaction?: ITransaction;
}

const createTransactionSchema = z.object({
  id: z.string(),
  type: z.enum([TransactionType.DEBIT, TransactionType.CREDIT]),
  from: z.string({ required_error: "Este campo é obrigatório" }),
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

export function TransactionsForm(props: TransactionsFormProps) {
  const { disabled, transaction, onSubmit, readOnly } = props;

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    disabled,
    defaultValues: {
      type: TransactionType.DEBIT,
      from: "",
      id: Date.now().toString(),
      ...transaction,
      date: transaction ? new Date(transaction.date) : new Date(),
    },
  })

  const handleSubmit = (values: CreateTransactionSchema) => {
    onSubmit({
      accountId: '6850a729af1ef45a19b0422f',
      ...values,
      date: values.date.toISOString(),
    });
  }

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
          name="from"
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
