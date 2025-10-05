import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { TransactionType } from '@fiap-tech-challenge/models';
import type { ITransaction, ITransactionInsert } from '@fiap-tech-challenge/database/types';
import { CurrencyInput } from './ui/CurrencyInput';
import { RadioGroup } from './ui/RadioGroup';
import CalendarPicker from './CalendarPicker';
import { TransactionAttachment, BaseTransaction } from './TransactionAttachment';
import { useFormValidation, formSchemas } from '@/hooks/useFormValidation';
import { Colors } from '@/constants/Colors';

export type TransactionFormProps = {
  disabled?: boolean;
  onSubmit: (transaction: ITransaction | ITransactionInsert) => void;
  readOnly?: boolean;
  transaction?: ITransaction;
  onAttachmentChange?: (transaction: ITransaction) => void;
}

const createTransactionSchema = formSchemas.transaction;

type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

const transactionTypeOptions = [
  {
    value: TransactionType.DEBIT,
    label: 'Transferência',
  },
  {
    value: TransactionType.CREDIT,
    label: 'Depósito',
  },
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

export function TransactionForm({
  disabled = false,
  readOnly = false,
  onSubmit,
  transaction,
  onAttachmentChange,
}: TransactionFormProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string; type: string; size: number } | null>(null);

  const form = useFormValidation(createTransactionSchema, {
    defaultValues: transaction ? {
      id: transaction.id,
      description: transaction.description,
      value: transaction.value,
      type: transaction.type as TransactionType,
      date: new Date(transaction.date),
    } : {
      id: Date.now().toString(),
      type: TransactionType.DEBIT,
      description: '',
      value: 0,
      date: new Date(),
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = form;
  const selectedDate = watch('date');

  const handleDateSelect = (date: Date) => {
    setValue('date', date);
    setShowCalendar(false);
  };

  const handleFormSubmit = (values: CreateTransactionSchema) => {
    const transactionData = {
      ...values,
      date: values.date.toISOString(),
    } as ITransaction | ITransactionInsert;

    if (selectedFile) {
      (transactionData as any).selectedFile = selectedFile;
    }

    onSubmit(transactionData);
  };

  return (
    <View className="flex-1 p-4">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <RadioGroup
            options={transactionTypeOptions}
            value={field.value}
            onValueChange={field.onChange}
            label="Tipo de transação"
            error={errors.type?.message}
            disabled={readOnly || disabled}
          />
        )}
      />

      <View className="h-5" />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Descrição</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Descrição da transação"
              editable={!readOnly && !disabled}
              className={`border rounded-md px-3 py-2 ${
                errors.description
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${(readOnly || disabled) ? 'opacity-50' : ''}`}
            />
            {errors.description && (
              <Text className="text-sm text-red-600 mt-1">{errors.description.message}</Text>
            )}
          </View>
        )}
      />

      <View className="h-5" />

      <Controller
        control={control}
        name="value"
        render={({ field }) => (
          <CurrencyInput
            value={field.value}
            onChange={field.onChange}
            label="Valor"
            error={errors.value?.message}
            editable={!readOnly && !disabled}
          />
        )}
      />

      <View className="h-5" />

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Data</Text>
        <TouchableOpacity
          onPress={() => !readOnly && !disabled && setShowCalendar(true)}
          className={`border rounded-md px-3 py-2 flex-row items-center justify-between ${
            errors.date
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white'
          } ${(readOnly || disabled) ? 'opacity-50' : ''}`}
          disabled={readOnly || disabled}
        >
          <Text className="text-gray-900">
            {formatDate(selectedDate)}
          </Text>
          <Ionicons name="calendar-outline" size={16} color={Colors.light.grayMedium} />
        </TouchableOpacity>
        {errors.date && (
          <Text className="text-sm text-red-600 mt-1">{errors.date.message}</Text>
        )}
      </View>

      <View className="h-5" />

      <TransactionAttachment
        transaction={transaction as BaseTransaction}
        onFileSelect={setSelectedFile}
        onAttachmentChange={(updatedTransaction) => {
          if (transaction && onAttachmentChange) {
            onAttachmentChange(updatedTransaction as ITransaction);
          }
        }}
        disabled={readOnly || disabled}
        mode={transaction ? 'edit' : 'create'}
      />

      <View className="flex-1" />

      {!readOnly && (
        <TouchableOpacity
          onPress={handleSubmit(handleFormSubmit)}
          disabled={disabled}
          className={`bg-primary rounded-md py-3 ${disabled ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-semibold text-center text-base">
            {transaction ? 'Editar transação' : 'Criar transação'}
          </Text>
        </TouchableOpacity>
      )}

      <CalendarPicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        maximumDate={new Date()}
        title="Selecionar data da transação"
      />
    </View>
  );
}
