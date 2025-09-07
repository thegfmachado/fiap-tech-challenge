import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { GradientLogo } from '@/components/GradientLogo';

interface AuthScreenLayoutProps {
  children: React.ReactNode;
}

export function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ minHeight: '100%', justifyContent: 'flex-end', paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <GradientLogo />

          <ThemedView className="grow rounded-t-2xl py-8 -mt-4">
            {children}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
