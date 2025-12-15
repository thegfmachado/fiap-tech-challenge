import React from 'react';
import {
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAsyncAction } from '@/hooks/useAsyncOperation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema } from '@fiap-tech-challenge/validation-schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';

type LoginFormData = z.infer<typeof loginSchema>;

const handleError = (error: unknown) => `Erro no login: ${error instanceof Error ? error.message : 'Tente novamente'}`;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const loginOperation = useAsyncAction({
    onError: handleError,
  });

  const form = useFormValidation(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const handleSubmit = async (values: LoginFormData) => {
    await loginOperation.execute(async () => {
      await signIn(values.email, values.password);
    });

    if (loginOperation.error) {
      Alert.alert('Erro no Login', loginOperation.error);
    }
  };

  return (
    <AuthScreenLayout>
      <ThemedText className="text-4xl text-center mb-12" type="title">
        Bem-vindo de volta!
      </ThemedText>

      <ThemedView className="px-8">
        <Controller
          control={form.control}
          name="email"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              label="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Digite sua senha"
              secureTextEntry
              showPasswordToggle
              autoComplete="password"
              autoCapitalize="none"
              error={error?.message}
            />
          )}
        />

        <Button
          title="Entrar"
          onPress={form.handleSubmit(handleSubmit)}
          loading={loginOperation.isLoading}
          className="mt-6 mb-4"
        />

        <ThemedView className="flex-row justify-center items-center mb-8">
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <ThemedText type="link">
                Esqueci minha senha
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>

        <ThemedView className="flex-row justify-center items-center gap-1">
          <Text className="text-sm">
            Ainda não tem uma conta?
          </Text>

          <Link href="/signup" asChild>
            <TouchableOpacity>
              <ThemedText className="text-sm" type="link">
                Criar conta gratuita
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </AuthScreenLayout>
  );
}
