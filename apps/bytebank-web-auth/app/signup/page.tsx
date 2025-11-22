"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, ChartPie, Shield, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button,
  FormLabel,
  Skeleton,
} from "@fiap-tech-challenge/design-system/components";

import { Header } from "@bytebank-web-auth/components/template/header";
import { WelcomeHero } from "@bytebank-web-auth/components/welcome-hero";

import { HTTPService } from "@fiap-tech-challenge/services/http";
import { AuthService } from "@bytebank-web-auth/client/services/auth-service";
import { signupSchema } from "@fiap-tech-challenge/validation-schemas";
import type { SignupSchema } from "@fiap-tech-challenge/validation-schemas";

const httpService = new HTTPService();
const authService = new AuthService(httpService);

const cards = [
  {
    title: "Controle total das suas finanças",
    icon: <ChartColumn color="white" size={20} />
  },
  {
    title: "Insights inteligentes",
    icon: <ChartPie color="white" size={20} />
  },
  {
    title: "Dados 100% seguros",
    icon: <Shield color="white" size={20} />
  },
  {
    title: "Alcance seus objetivos",
    icon: <TrendingUp color="white" size={20} />
  },
]

type SignupFormSchemaType = SignupSchema;

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: SignupFormSchemaType) => {
    setIsLoading(true);

    const user = await authService.signUp(values);

    if (!user) {
      return;
    }

    setIsLoading(false);

    form.reset();
  };

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />

      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Criar sua conta</CardTitle>
              <CardDescription>
                Crie sua conta para acessar o FinTrack
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isLoading ? (
                  <div className="p-5 w-full max-w-lg grid gap-2">
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="w-full h-12 rounded-md mt-4" />
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Digite seu nome"
                              />

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="seu@email.com"
                              />

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Digite sua senha"
                                showPasswordToggle
                              />

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmação de senha</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Confirme sua senha"
                                showPasswordToggle
                              />

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button className="w-full" size="lg" type="submit">
                        Enviar
                      </Button>

                      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2 p-4">
                        <p className="text-center text-muted-foreground">
                          Já tem uma conta?
                        </p>
                        <a className="text-primary font-medium" href="/auth/login">Entrar agora</a>
                      </div>
                    </form>
                  </Form>
                )
              }
            </CardContent>
          </Card>
        </section>
      </main>
    </div >
  )
}
