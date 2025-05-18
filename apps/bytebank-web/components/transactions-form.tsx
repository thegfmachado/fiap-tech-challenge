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
import { TransactionType } from "@bytebank/app/shared/enums/transaction-type.enum";
import { CurrencyInput } from "@bytebank/components/ui/currency-input";
import { ITransaction } from "@bytebank/app/shared/models/transaction.interface";
import { DatePicker } from "@bytebank/components/date-picker";

export interface TransactionsFormProps {
  onSubmit: (transaction: ITransaction) => void;
  transaction?: ITransaction;
}

const createTransactionSchema = z.object({
  id: z.string(),
  type: z.enum([TransactionType.DEBIT, TransactionType.CREDIT]),
  description: z.string().nonempty("Este campo é obrigatório"),
  value: z.number().positive("O valor deve ser maior que zero"),
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

const defaultValues = {
  type: TransactionType.DEBIT,
  description: "",
  value: undefined,
  date: new Date(),
}

export function TransactionsForm(props: TransactionsFormProps) {
  const { transaction, onSubmit } = props;

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      ...defaultValues,
      ...transaction,
      id: transaction ? transaction.id : Date.now().toString(),
      date: transaction ? new Date(transaction.date) : undefined,
    },
  })

  const handleSubmit = (values: CreateTransactionSchema) => {
    onSubmit({
      ...values,
      date: values.date.toISOString(),
    });
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Tipo de transação</FormLabel>
              <FormControl>
                <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex space-x-4">
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
                <Input placeholder="Descrição" {...field} />
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
                <CurrencyInput placeholder="R$ 0,00" {...field} />
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
                <DatePicker fitParent mode="single" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button size="lg" type="submit">Criar transação</Button>
        </div>
      </form>
    </Form>
  )
}
