import React from 'react';
import {
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Link, router } from 'expo-router';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useAuth } from '@/contexts/auth-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAsyncAction } from '@/hooks/useAsyncOperation';
import { useFormValidation, formSchemas, createPasswordConfirmationSchema } from '@/hooks/useFormValidation';

const signupSchema = createPasswordConfirmationSchema(formSchemas.signup);

type SignupFormData = z.infer<typeof signupSchema>;

const handleError = (error: unknown) => `Erro ao criar conta: ${error instanceof Error ? error.message : 'Tente novamente'}`;

const handleSuccess = () => {
  Alert.alert(
    'Conta Criada!',
    'Sua conta foi criada com sucesso. Faça login para continuar.',
    [{ text: 'OK', onPress: () => router.push('/login') }]
  );
};

export default function SignupScreen() {
  const { signUp } = useAuth();

  const signupOperation = useAsyncAction({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const form = useFormValidation(signupSchema, {
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const handleSubmit = async (values: SignupFormData) => {
    await signupOperation.execute(async () => {
      await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      form.resetForm();
    });

    // Show error if signup failed
    if (signupOperation.error) {
      Alert.alert('Erro', signupOperation.error);
    }
  };

  return (
    <AuthScreenLayout>
      <ThemedText className="text-center mb-8" type="title">
        Criar conta
      </ThemedText>

      <ThemedView className="px-8">
        <Controller
          control={form.control}
          name="name"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              label="Nome"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Digite seu nome"
              autoCapitalize="words"
              autoComplete="name"
              error={error?.message}
            />
          )}
        />

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
              autoComplete="new-password"
              autoCapitalize="none"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              label="Confirmação de senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Confirme sua senha"
              secureTextEntry
              showPasswordToggle
              autoComplete="new-password"
              autoCapitalize="none"
              error={error?.message}
            />
          )}
        />

        <Text className="text-sm flex-1 mb-4">
          Ao continuar, você concorda com os{' '}
          <ThemedText className="text-sm font-medium">Termos de Uso</ThemedText>
          {' '}e{' '}
          <ThemedText className="text-sm font-medium">Política de Privacidade</ThemedText>.
        </Text>

        <Button
          title="Enviar"
          onPress={form.handleSubmit(handleSubmit)}
          loading={signupOperation.isLoading}
          className="mb-6"
        />

        <ThemedView className="flex-row justify-center items-center gap-1">
          <Text className="text-sm">
            Já tem uma conta?
          </Text>

          <Link href="/login" asChild>
            <TouchableOpacity>
              <ThemedText className="font-semibold text-sm">
                Entrar agora
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </AuthScreenLayout>
  );
}
