import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  showPasswordToggle,
  secureTextEntry,
  className,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const iconColor = useThemeColor({}, 'icon');

  const isPassword = showPasswordToggle && secureTextEntry;
  const actualSecureTextEntry = isPassword ? !isPasswordVisible : secureTextEntry;

  return (
    <ThemedView className="mb-4">
      <Text className="text-base font-medium mb-2">
        {label}
      </Text>

      <ThemedView className="relative">
        <TextInput
          {...props}
          secureTextEntry={actualSecureTextEntry}
          className={`
            border-2 rounded-lg px-4 py-3 text-base bg-white
            ${isFocused ? 'border-primary' : error ? 'border-destructive' : 'border-secondary'}
            ${showPasswordToggle ? 'pr-12' : ''}
            ${className || ''}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={Colors.light.grayLight}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-3 p-1"
          >
            <IconSymbol
              name={isPasswordVisible ? 'eye.slash' : 'eye'}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </ThemedView>

      {error && (
        <Text className="text-destructive text-sm mt-1">
          {error}
        </Text>
      )}
    </ThemedView>
  );
}
