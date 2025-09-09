import React, { useState } from 'react';
import {
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useAuth } from '@/contexts/auth-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const loginSchema = z.object({
  email: z.string({ required_error: 'Este campo é obrigatório' }).email('Email inválido'),
  password: z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setIsLoading(true);

    try {
      await signIn(values.email, values.password);
      // Navigation will be handled by the auth route guard
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    } finally {
      setIsLoading(false);
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
          loading={isLoading}
          className="mt-6 mb-4"
        />

        <ThemedView className="flex-row justify-center items-center mb-8">
          <TouchableOpacity>
            <ThemedText type="link">
              Esqueci minha senha
            </ThemedText>
          </TouchableOpacity>
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
