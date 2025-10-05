import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <ThemedView className="flex-1 justify-center items-center p-6">
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <ThemedText className="mt-4 text-gray-600 text-center">
        {message}
      </ThemedText>
    </ThemedView>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <ThemedView className="flex-1 justify-center items-center p-6">
      <ThemedText className="text-red-500 text-center mb-4">
        ❌ {message}
      </ThemedText>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <ThemedText className="text-white font-medium">
            Tentar novamente
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nenhuma transação encontrada' }: EmptyStateProps) {
  return (
    <ThemedView className="flex-1 justify-center items-center p-6">
      <ThemedText className="text-6xl mb-4">💳</ThemedText>
      <ThemedText className="text-gray-600 text-center text-lg">
        {message}
      </ThemedText>
      <ThemedText className="text-gray-500 text-center mt-2">
        Suas transações aparecerão aqui
      </ThemedText>
    </ThemedView>
  );
}
