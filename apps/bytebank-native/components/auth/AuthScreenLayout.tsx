import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { GradientLogo } from '@/components/ui/GradientLogo';
import { isIOS } from '@/constants/device';

interface AuthScreenLayoutProps {
  children: React.ReactNode;
}

export function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
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
