import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RadioGroupOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioGroupOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  label,
  error,
  className,
  disabled = false
}: RadioGroupProps) {
  return (
    <View className={className}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-3">{label}</Text>
      )}
      <View className="flex-row space-x-6 gap-4">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => !disabled && onValueChange(option.value)}
            className="flex-row items-center"
            disabled={disabled}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-2 ${
                value === option.value
                  ? 'border-primary bg-primary'
                  : 'border-gray-300 bg-white'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              {value === option.value && (
                <View className="w-2 h-2 rounded-full bg-white m-auto" />
              )}
            </View>
            <Text className={`text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && (
        <Text className="text-sm text-red-600 mt-1">{error}</Text>
      )}
    </View>
  );
}
