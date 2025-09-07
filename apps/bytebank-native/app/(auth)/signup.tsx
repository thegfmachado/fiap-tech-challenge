import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useAuth } from '@/contexts/auth-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const signupSchema = z.object({
  name: z.string({ required_error: 'Este campo é obrigatório' }).min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string({ required_error: 'Este campo é obrigatório' }).email('Email inválido'),
  password: z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: SignupFormData) => {
    setIsLoading(true);

    try {
      await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      form.reset();

      Alert.alert(
        'Conta criada!',
        'Um e-mail de confirmação foi enviado para o e-mail informado. Confirme sua conta e faça login para continuar.',
        [{ text: 'OK' }]
      );

      router.replace('/login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Erro', 'Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
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
          loading={isLoading}
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
