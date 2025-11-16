import React, { useState } from 'react';
import {
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@fiap-tech-challenge/validation-schemas';
import type { ForgotPasswordSchema } from '@fiap-tech-challenge/validation-schemas';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useAuth } from '@/contexts/auth-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type ForgotPasswordFormData = ForgotPasswordSchema;

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await resetPassword(values.email);

      Alert.alert(
        'E-mail enviado!',
        'Instruções para redefinir sua senha foram enviadas para o seu e-mail. Verifique sua caixa de entrada e siga as instruções.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Erro', 'Erro ao enviar e-mail de recuperação. Verifique o e-mail informado e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenLayout>
      <ThemedText className="text-4xl text-center mb-4" type="title">
        Esqueci minha senha
      </ThemedText>

      <ThemedText className="text-center mb-8 px-8 text-gray-600">
        Digite seu e-mail e enviaremos instruções para redefinir sua senha
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

        <Button
          title="Enviar instruções"
          onPress={form.handleSubmit(handleSubmit)}
          loading={isLoading}
          className="mt-6 mb-8"
        />

        <ThemedView className="flex-row justify-center items-center gap-1">
          <Text className="text-sm">
            Lembrou da senha?
          </Text>

          <Link href="/login" asChild>
            <TouchableOpacity>
              <ThemedText className="text-sm" type="link">
                Voltar ao login
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </AuthScreenLayout>
  );
}
