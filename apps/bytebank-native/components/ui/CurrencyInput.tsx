import React, { useEffect, useReducer } from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';

interface CurrencyInputState {
  value?: number;
  formattedValue?: string;
}

export interface CurrencyInputProps extends Omit<TextInputProps, 'onChange' | 'value'> {
  onChange?: (value: number) => void;
  value: number;
  label?: string;
  error?: string;
  className?: string;
}

const currencyInputInitialState: CurrencyInputState = {
  value: undefined,
  formattedValue: '',
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const currencyInputReducer = (_: CurrencyInputState, next?: number) => {
  if (typeof next !== 'number') {
    return currencyInputInitialState;
  }

  const formattedValue = formatCurrency(next);

  return {
    value: next,
    formattedValue,
  };
};

export function CurrencyInput(props: CurrencyInputProps) {
  const { onChange, value, label, error, className, editable = true, ...textInputProps } = props;
  const [innerValue, setInnerValue] = useReducer(currencyInputReducer, currencyInputInitialState);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    const parsedValue = text.replace(/\D/g, '');
    const numberValue = Number(parsedValue) / 100;

    onChange?.(numberValue);
  };

  return (
    <View className={className}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <TextInput
        {...textInputProps}
        value={innerValue.formattedValue}
        onChangeText={handleChangeText}
        placeholder="R$ 0,00"
        keyboardType="numeric"
        editable={editable}
        className={`border rounded-md px-3 py-2 ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white'
        } ${!editable ? 'opacity-50' : ''} text-gray-900`}
      />
      {error && (
        <Text className="text-sm text-red-600 mt-1">{error}</Text>
      )}
    </View>
  );
}